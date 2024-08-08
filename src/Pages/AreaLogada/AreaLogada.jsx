import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import "./style.css";
import cart from "../../Assets/cart.png";
import cadastro from "../../Assets/cadastro.png";
import SlideButton from 'react-slide-button';
import axios from 'axios';
import AddProdutoCard from '../../Components/AddProdutoCard/AddProdutoCard'; // Certifique-se de importar o componente correto

function AreaLogada() {
    const [reset, setReset] = useState(0);
    const [cep, setCep] = useState('');
    const [cidade, setCidade] = useState('Lorem Ipsun');
    const [produtos, setProdutos] = useState([]); // Estado para armazenar os produtos
    const [isEditing, setIsEditing] = useState(false); // Estado para controlar o modo de edição
    const [novoCep, setNovoCep] = useState(''); // Estado para o novo CEP
    const navigate = useNavigate();

    useEffect(() => {
        const storedCep = localStorage.getItem('userCep');
        if (storedCep) {
            setCep(storedCep);
            fetchCidade(storedCep);
        }

        fetchProdutos();
    }, []);

    const fetchCidade = async (cep) => {
        try {
            const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
            setCidade(response.data.localidade || 'Cidade não encontrada');
        } catch (error) {
            console.error('Erro ao buscar a cidade:', error);
            setCidade('Cidade não encontrada');
        }
    };

    const fetchProdutos = async () => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            console.error('Token de autenticação não encontrado.');
            return;
        }

        try {
            const response = await axios.get('https://savvy-api.belogic.com.br/api/products', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log(response.data); // Verifique a estrutura da resposta
            setProdutos(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Erro ao buscar produtos:', error);
        }
    };

    const handleSlideDone = () => {
        setTimeout(() => {
            navigate('/comparativo');
        }, 1000);
    };

    const handleAddProduto = () => {
        navigate("/addProduto");
    };

    const handleEditCep = () => {
        setIsEditing(true);
        setNovoCep(cep); // Define o CEP atual no campo de edição
    };

    const handleSaveCep = async () => {
        if (novoCep === cep) {
            // Se o novo CEP é igual ao atual, não faça nada
            setIsEditing(false);
            return;
        }

        try {
            await fetchCidade(novoCep);
            setCep(novoCep);
            localStorage.setItem('userCep', novoCep);
            setIsEditing(false);
        } catch (error) {
            console.error('Erro ao salvar o novo CEP:', error);
        }
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setNovoCep(cep); // Restaura o CEP original se a edição for cancelada
    };

    const addProduto = (produto) => {
        setProdutos(prevProdutos => [...prevProdutos, produto]);
    };

    useEffect(() => {
        // Adiciona um listener para detectar alterações na navegação para garantir que a lista de produtos seja atualizada
        const handleProdutoAdicionado = (produto) => {
            addProduto(produto);
        };

        // Verifica se o produto foi adicionado e atualiza a lista de produtos
        window.addEventListener('produtoAdicionado', handleProdutoAdicionado);

        return () => {
            window.removeEventListener('produtoAdicionado', handleProdutoAdicionado);
        };
    }, []);

    return (
        <div className="areaLogada-container">
            <div className="areaLogada-main">
                <div className="areaLogada-nav">
                    <h3>Minha lista de compras</h3>
                    <div className="cart">
                        <img alt="" src={cart} />
                        <p>{produtos.length}</p>
                    </div>    
                </div>

                <div className="areaLogada-dados">
                    <div className="areaLogada-endereco">
                        {isEditing ? (
                            <div>
                                <input
                                    type="text"
                                    value={novoCep}
                                    onChange={e => setNovoCep(e.target.value)}
                                    placeholder="Digite o novo CEP"
                                />
                                <button onClick={handleSaveCep}>Salvar</button>
                                <button onClick={handleCancelEdit}>Cancelar</button>
                            </div>
                        ) : (
                            <div>
                                <p>Buscas realizadas para o CEP:<span> {cep || '00000-000'}</span></p>
                                <p>Cidade:<span> {cidade}</span></p>
                                <div>
                                    <h4 onClick={handleEditCep}>Editar</h4>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="dados-compras">
                    <div className="prod-cadastrados">
                        <h1>{produtos.length}</h1>
                        <p>Produtos cadastrados</p>
                    </div>

                    <div className="reais-economizados">
                        <h1>XX</h1>
                        <p>Reais economizados</p>
                    </div>
                </div>

                <div className="container-meus-produtos">
                    <div className="meus-produtos-bar">
                        <button className="meus-produtos-btn" onClick={handleAddProduto}>Cadastrar produto<img alt="" src={cadastro} /></button>
                    </div>

                    <div className="lista-de-produtos">
                        {produtos.map((produto, index) => (
                            <AddProdutoCard key={index} produto={produto} />
                        ))}
                    </div>
                </div>

                <div className="consultar-preco-btn">
                    <SlideButton
                        mainText=""
                        overlayText="Consultar preço!"
                        onSlideDone={handleSlideDone}
                        reset={reset}
                    />
                </div>
            </div>
        </div>
    );
}

export default AreaLogada;
