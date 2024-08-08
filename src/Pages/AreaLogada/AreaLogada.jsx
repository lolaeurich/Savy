import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import "./style.css";
import cart from "../../Assets/cart.png";
import lixo from "../../Assets/lixo.png";
import cadastro from "../../Assets/cadastro.png";
import axios from 'axios';
import WeightSelector from "../../Components/SeletorPeso/SeletorPeso";
import produtoImg from "../../Assets/produto-imagem.png"; // Imagem padrão do produto

function AreaLogada() {
    const [cep, setCep] = useState('');
    const [cidade, setCidade] = useState('Lorem Ipsun');
    const [produtos, setProdutos] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [novoCep, setNovoCep] = useState('');
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
                    'Authorization': `Bearer 19|fOvn5kU8eYYn3OETTlIKrVarFrih56cW03LOVkaS93a28077`
                }
            });
            console.log(response.data);
            setProdutos(Array.isArray(response.data.data) ? response.data.data : []);
        } catch (error) {
            console.error('Erro ao buscar produtos:', error);
        }
    };

    const handleSlideDone = () => {
        navigate("/comparativo");
    };

    const handleAddProduto = () => {
        navigate("/addProduto");
    };

    const handleEditCep = () => {
        setIsEditing(true);
        setNovoCep(cep);
    };

    const handleSaveCep = async () => {
        if (novoCep === cep) {
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
        setNovoCep(cep);
    };

    const handleCheckboxChange = (barcode) => {
        setProdutos(prevProdutos =>
            prevProdutos.map(prod => prod.barcode === barcode ? { ...prod, isChecked: !prod.isChecked } : prod)
        );
    };

    const handleDelete = async (productId) => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.delete(`https://savvy-api.belogic.com.br/api/products/${productId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            console.log('Produto excluído com sucesso:', response.data);
            // Atualiza o estado para remover o produto excluído
            setProdutos(prevProdutos => prevProdutos.filter(produto => produto.id !== productId));
        } catch (error) {
            console.error('Erro ao excluir o produto:', error.response ? error.response.data : error.message);
        }
    };


    return (
        <div className="areaLogada-container">
            <div className="areaLogada-main">
                <div className="areaLogada-nav">
                    <h3>Minha lista de compras</h3>
                    <div className="cart">
                        <img alt="Cart Icon" src={cart} />
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
                                <div style={{ display: "flex", columnGap: "5px" }}>
                                    <h4 onClick={handleSaveCep}>Salvar</h4>
                                    <h4 onClick={handleCancelEdit} style={{ width: "80px" }}>Cancelar</h4>
                                </div>
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
                        <button className="meus-produtos-btn" onClick={handleAddProduto}>
                            Cadastrar produto
                            <img alt="Cadastro Icon" src={cadastro} />
                        </button>
                    </div>

                    <div className="lista-de-produtos">
                        {produtos.map(produto => (
                            <div className="card-content-produtos" key={produto.barcode}>
                                <input
                                    className='checkbox-mercado'
                                    type="checkbox"
                                    checked={produto.isChecked || false}
                                    onChange={() => handleCheckboxChange(produto.barcode)}
                                    id={`produtoCheckbox-${produto.barcode}`} // Garantir que a id seja única
                                />
                                <label htmlFor={`produtoCheckbox-${produto.barcode}`}></label>
                                <div className='card-content-sessao2'>
                                    <div className='card-content-titulo'>
                                        <img alt='Produto' src={produto.image || produtoImg} /> {/* Usa a imagem do produto ou uma imagem padrão */}
                                        <div className='produto-nome-lista'>
                                            <h3 className='produto-nome-h3'>{produto.name}</h3>
                                            <p className='codigo-de-barras'>{produto.barcode}</p>
                                        </div>
                                    </div>
                                    <div className="card-content-card">
                                        <div className='card-content-quantidade'>
                                            <h3 className='card-content-quantidade-h3'>Quantidade</h3>
                                            <WeightSelector />
                                        </div>
                                        <img 
                                            className="lixo" 
                                            alt="Excluir Produto" 
                                            src={lixo}
                                            onClick={() => handleDelete(produto.id)} // Passa o ID do produto para a função de exclusão
                                        />
                                    </div>
                                </div> 
                            </div>
                        ))}
                    </div>
                </div>

                <div className="consultar-preco-btn">
                    <button
                        className="slide-button"
                        onClick={handleSlideDone}
                    >Consultar preço</button>
                </div>
            </div>
        </div>
    );
}

export default AreaLogada;
