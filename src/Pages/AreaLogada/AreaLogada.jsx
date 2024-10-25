import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./style.css";
import cart from "../../Assets/cart.png";
import lixo from "../../Assets/lixo.png";
import cadastro from "../../Assets/cadastro.png";
import produtoImg from "../../Assets/products.png"; // imagem padrão
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

    useEffect(() => {
        const storedCep = localStorage.getItem('userCep');
        if (storedCep) {
            setCep(storedCep);
            fetchCidade(storedCep);
        }
        fetchProdutos();
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
            setProdutos(Array.isArray(response.data.data) ? response.data.data : []);
        } catch (error) {
            console.error('Erro ao buscar produtos:', error);
        }
    };

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

            setProdutos(prevProdutos =>
                prevProdutos.map(prod => 
                    prod.id === productId ? { ...prod, quantity: newQuantity } : prod
                )
            );
        } catch (error) {
            console.error('Erro ao atualizar a quantidade do produto:', error.response ? error.response.data : error.message);
        }
    };

    const handleCheckboxChange = (barcode) => {
        setProdutos(prevProdutos => {
            const updatedProdutos = prevProdutos.map(prod => 
                prod.barcode === barcode ? { ...prod, isChecked: !prod.isChecked } : prod
            );
            return updatedProdutos;
        });
    };
    

    const handleDelete = async (productId) => {
        const token = getAuthToken();
        if (!token) {
            console.error('Token de autenticação não encontrado.');
            return;
        }

        try {
            await axios.delete(`https://savvy-api.belogic.com.br/api/shopping/${productId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            setProdutos(prevProdutos => prevProdutos.filter(produto => produto.id !== productId));
        } catch (error) {
            console.error('Erro ao excluir o produto:', error.response ? error.response.data : error.message);
            alert('Não foi possível excluir o produto. Verifique se ele está associado a outros registros.');
        }
    };

    const handleSlideDone = async () => {
        const selectedProducts = produtos.filter(produto => produto.isChecked);
        const selectedProductIds = selectedProducts.map(produto => produto.product_id); // Alterado para product_id
    
        console.log("Produtos selecionados:", selectedProducts);
        console.log("IDs dos produtos selecionados:", selectedProductIds);
    
        if (selectedProductIds.length === 0) {
            alert('Por favor, selecione ao menos um produto.');
            return;
        }
    
        try {
            const token = getAuthToken();
    
            const bestCostResponse = await axios.post('https://savvy-api.belogic.com.br/api/checkout/best-cost-in-one-place', {
                products: selectedProductIds // Enviando product_id
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
    
            console.log('Resposta do servidor para best-cost:', bestCostResponse.data);
    
            navigate("/comparativo", {
                state: {
                    selectedProducts: bestCostResponse.data.products || [],
                    priceInfo: bestCostResponse.data.priceInfo || {},
                    totalMinPrice: bestCostResponse.data.total || 0,
                    selectedProductsCount: bestCostResponse.data.product_quantity || 0,
                    responseData: bestCostResponse.data,
                    allMarkets: bestCostResponse.data.allMarkets || {}
                }
            });
        } catch (error) {
            console.error('Erro ao enviar produtos:', error.response ? error.response.data : error.message);
            alert('Ocorreu um erro ao processar sua solicitação. Tente novamente.');
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

    useEffect(() => {
        localStorage.setItem('produtos', JSON.stringify(produtos));
    }, [produtos]);

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
                        <p>{produtos.length}</p>
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
                                <img
                                    className="card-image"
                                    alt={produto.description}
                                    src={(produto.image && produto.image.length > 0) ? produto.image[0].url : produtoImg}
                                />
                                <div className='card-content-sessao2'>
                                    <div className='card-content-titulo'>
                                        <div className='produto-nome-lista'>
                                            <h3 className='produto-nome-h3'>{produto.description}</h3>
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
                    <button className="slide-button2" onClick={handleSlideDone}>
                        Consultar preço
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AreaLogada;
