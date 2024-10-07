import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./style.css";
import cart from "../../Assets/cart.png";
import lixo from "../../Assets/lixo.png";
import cadastro from "../../Assets/cadastro.png";
import produtoImg from "../../Assets/produto-imagem.png"; // Imagem padrão do produto
import QuantitySelector from "../../Components/SeletorQuantidade/SeletorQuantidade";

const allowedSupermarkets = [
    "Guanabara", "Condor", "VERDE MAIS VILA IZABEL", "Angeloni", "Atacadão", "Atacadao", "Carrefour", 
    "Muffato", "Festval", "Pao de Açúcar", "GPA", "Walmart", "Big", "Sonda", "BH", "Zaffari", "Jacomar",
    "Casa Fiesta", "Harri", "Goias", "Planalto", "bozlatto", "Sierra", "Tissi", "Cial Beal", "Bissoto", 
    "Carlos"
];

function AreaLogada() {
    const [cep, setCep] = useState('');
    const [cidade, setCidade] = useState('Lorem Ipsun');
    const [produtos, setProdutos] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [novoCep, setNovoCep] = useState('');
    const [selectedProductsCount, setSelectedProductsCount] = useState(0);
    const navigate = useNavigate();

    const handleUpdateQuantity = async (productId, newQuantity) => {
        const token = getAuthToken();
        if (!token) {
            console.error('Token de autenticação não encontrado.');
            return;
        }

        try {
            await axios.put(`https://savvy-api.belogic.com.br/api/shopping/${productId}`, {
                quantity: newQuantity
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            // Atualiza a lista de produtos localmente
            setProdutos(prevProdutos =>
                prevProdutos.map(prod => 
                    prod.id === productId ? { ...prod, quantity: newQuantity } : prod
                )
            );
        } catch (error) {
            console.error('Erro ao atualizar a quantidade do produto:', error.response ? error.response.data : error.message);
        }
    };

    useEffect(() => {
        const storedCep = localStorage.getItem('userCep');
        if (storedCep) {
            setCep(storedCep);
            fetchCidade(storedCep);
        }
        fetchProdutos();
        fetchProductImages(); // Chama a função para buscar imagens
    }, []);

    useEffect(() => {
        const count = produtos.filter(produto => produto.isChecked).length;
        setSelectedProductsCount(count);
    }, [produtos]);

    const fetchCidade = async (cep) => {
        try {
            const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
            setCidade(response.data.localidade || 'Cidade não encontrada');
        } catch (error) {
            console.error('Erro ao buscar a cidade:', error);
            setCidade('Cidade não encontrada');
        }
    };

    const getAuthToken = () => {
        return localStorage.getItem('authToken');
    };

    const fetchProdutos = async () => {
        const token = getAuthToken();
        if (!token) {
            console.error('Token de autenticação não encontrado.');
            return;
        }

        try {
            const response = await axios.get('https://savvy-api.belogic.com.br/api/shopping', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setProdutos(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Erro ao buscar produtos:', error);
        }
    };

    const fetchProductImages = async () => {
        const token = getAuthToken(); // Obtém o token de autenticação
        if (!token) {
            console.error('Token de autenticação não encontrado.');
            return;
        }
    
        try {
            const response = await axios.get('https://savvy-api.belogic.com.br/api/product-image', {
                headers: {
                    'Authorization': `Bearer ${token}` // Inclui o token no cabeçalho
                }
            });
            const imagesData = response.data.data;
    
            // Mapeia as imagens usando o GTIN
            const imagesMap = {};
            imagesData.forEach(item => {
                imagesMap[item.gtin] = item.image[0]?.url || produtoImg; // URL da imagem ou imagem padrão
            });
    
            // Atualiza a lista de produtos com as imagens associadas
            setProdutos(prevProdutos =>
                prevProdutos.map(prod => ({
                    ...prod,
                    image: imagesMap[prod.barcode] || produtoImg // Usa a imagem associada ou a padrão
                }))
            );
        } catch (error) {
            console.error('Erro ao buscar imagens de produtos:', error);
        }
    };

    useEffect(() => {
        localStorage.setItem('produtos', JSON.stringify(produtos));
    }, [produtos]);

    const handleSlideDone = async () => {
        const selectedProductIds = produtos
            .filter(produto => produto.isChecked)
            .map(produto => produto.id); // Mapeia para obter apenas os IDs

        if (selectedProductIds.length === 0) {
            alert('Por favor, selecione ao menos um produto.');
            return;
        }

        try {
            const token = getAuthToken();
            const response = await axios.post('https://savvy-api.belogic.com.br/api/checkout/best-cost-in-one-place', {
                products: selectedProductIds // Envia os IDs no formato esperado
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            console.log('Resposta do servidor:', response.data);
            navigate("/comparativo", { 
                state: { selectedProducts: response.data } // Passa a resposta para a próxima página, se necessário
            });
        } catch (error) {
            console.error('Erro ao enviar produtos:', error.response ? error.response.data : error.message);
        }
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
        const token = getAuthToken();
        if (!token) {
            console.error('Token de autenticação não encontrado.');
            return;
        }
    
        try {
            const response = await axios.delete(`https://savvy-api.belogic.com.br/api/shopping/${productId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
    
            console.log('Produto excluído com sucesso:', response.data);
            setProdutos(prevProdutos => prevProdutos.filter(produto => produto.id !== productId));
        } catch (error) {
            console.error('Erro ao excluir o produto:', error.response ? error.response.data : error.message);
            alert('Não foi possível excluir o produto. Verifique se ele está associado a outros registros.');
        }
    };

    return (
        <div className="areaLogada-container">
            <div className="areaLogada-main">
                <div className="login-savvy-logo2">
                    <h1>SAVVY</h1>
                </div>
                <div className="areaLogada-nav">
                    <h3>Minha lista de produtos</h3>
                    <div className="cart">
                        <img alt="Cart Icon" src={cart} />
                        <p>{selectedProductsCount}</p>
                    </div>
                </div>

                <div className="container-meus-produtos">
                    <div className="meus-produtos-bar">
                        <button className="meus-produtos-btn" onClick={handleAddProduto}>
                            Inserir produto
                            <img alt="Cadastro Icon" src={cadastro} />
                        </button>
                    </div>

                    <div className="lista-de-produtos">
                        {produtos.map(produto => (
                            <div className="card-content-produtos" key={produto.id}>
                                <input
                                    className='checkbox-mercado'
                                    type="checkbox"
                                    checked={produto.isChecked || false}
                                    onChange={() => handleCheckboxChange(produto.barcode)}
                                    id={`produtoCheckbox-${produto.barcode}`}
                                />
                                <label htmlFor={`produtoCheckbox-${produto.barcode}`}></label>
                                <img className="card-image" alt='' src={produto.image || produtoImg} />
                                <div className='card-content-sessao2'>
                                    <div className='card-content-titulo'>
                                        <div className='produto-nome-lista'>
                                            <h3 className='produto-nome-h3'>{produto.name}</h3>
                                            <p className='codigo-de-barras'>{produto.barcode}</p>
                                        </div>
                                    </div>
                                    <div className="card-content-card">
                                        <div className='card-content-quantidade'>
                                            <QuantitySelector 
                                                initialQuantity={produto.quantity || 1} 
                                                onQuantityChange={(newQuantity) => handleUpdateQuantity(produto.id, newQuantity)} 
                                            />
                                        </div>
                                    </div>
                                </div>
                                <img
                                    className='lixo-img'
                                    src={lixo}
                                    alt="Excluir"
                                    onClick={() => handleDelete(produto.id)}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="consultar-preco-btn">
                    <button
                        className="slide-button2"
                        onClick={handleSlideDone}
                    >
                        Consultar preço
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AreaLogada;
