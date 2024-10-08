import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./style.css";
import "../../Components/Mercados/style.css";
import flecha from "../../Assets/flecha-esquerda.png";
import flecha2 from "../../Assets/flecha-direita.png";
import cart from "../../Assets/cart.png";
import produtoImg from "../../Assets/produto-imagem.png"; // Imagem padrão do produto
import QuantitySelector from "../../Components/SeletorQuantidade/SeletorQuantidade";

function ListaMercados() {
    const location = useLocation();
    const navigate = useNavigate();
    const [produtos, setProdutos] = useState([]); // Estado para os produtos
    const [expandedIndex, setExpandedIndex] = useState(null); // Estado para controlar qual card está expandido
    const [produtoCount, setProdutoCount] = useState(0); // Contador de produtos do carrinho

    // UseEffect para receber os produtos da página anterior
    useEffect(() => {
        if (location.state && location.state.responseData) {
            const { products } = location.state.responseData.data;
            setProdutos(products || []);
            console.log("Produtos recebidos:", products);
            fetchProductImages(products || []); // Chama a função para buscar imagens
        } else {
            console.error("Nenhum dado recebido da página anterior.");
        }
    }, [location.state]);

// Função para buscar as imagens dos produtos
const fetchProductImages = async (products) => {
    const gtins = products.map(produto => produto.gtin).join(',');

    if (!gtins) {
        console.error("Nenhum GTIN disponível para buscar imagens.");
        return;
    }

    const token = localStorage.getItem('authToken'); // Recupera o token do localStorage

    try {
        const response = await axios.get(`https://savvy-api.belogic.com.br/api/product-image?gtin=${gtins}`, {
            headers: {
                'Authorization': `Bearer ${token}` // Adiciona o token ao cabeçalho
            }
        });

        const productImages = response.data.data;

        // Atualiza os produtos com a imagem correspondente
        const updatedProducts = products.map(produto => {
            const imageData = productImages.find(img => img.gtin === produto.gtin);
            return {
                ...produto,
                imageUrl: imageData && imageData.image.length > 0 ? imageData.image[0].url : produtoImg // Usa a imagem da API ou a imagem padrão
            };
        });

        setProdutos(updatedProducts);
    } catch (error) {
        console.error('Erro ao buscar imagens dos produtos:', error.response ? error.response.data : error.message);
    }
};


    // UseEffect para buscar a lista de produtos da API e atualizar o contador
    useEffect(() => {
        const fetchProdutoCount = async () => {
            const token = localStorage.getItem('authToken'); // Recuperar o token do localStorage

            if (!token) {
                console.error('Token não encontrado. Usuário não autenticado.');
                return; // Evitar fazer requisição sem token
            }

            try {
                const response = await axios.get('https://savvy-api.belogic.com.br/api/products', {
                    headers: {
                        'Authorization': `Bearer ${token}` // Usar o token recuperado
                    }
                });

                console.log('Resposta da API:', response.data);

                const items = response.data.data;
                if (Array.isArray(items)) {
                    setProdutoCount(items.length);
                } else {
                    console.error('Resposta da API não contém um array de itens:', items);
                    setProdutoCount(0);
                }
            } catch (error) {
                console.error('Erro ao buscar produtos:', error);
                setProdutoCount(0);
            }
        };

        fetchProdutoCount();
    }, []);

    // Função para alternar a expansão dos cards
    const toggleExpansion = (index) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    const handleComparativo = () => {
        localStorage.setItem('comparativoData', JSON.stringify(produtos));
        navigate("/comparativo");
    };

    return (
        <div className="listamercados-container">
            <div className="listamercados-main">
                <div className="login-savvy-logo2" style={{ justifyContent: "flex-end" }}>
                    <h1 style={{ fontSize: "20px" }}>SAVVY</h1>
                </div>
                <div className="listamercados-nav">
                    <div className="cart2">
                        <img alt="Voltar" src={flecha} onClick={handleComparativo} />
                    </div>
                    <div className="cart">
                        <img alt="Cart Icon" src={cart} />
                        <p>{produtos.length}</p> {/* Mostrando a quantidade de produtos do carrinho */}
                    </div>
                </div>

                <div className="listamercados-geral">
                    <h3 className="listamercados-geral-h3">Preço baixo e onde comprar</h3>

                    {/* Cards dinâmicos */}
                    {produtos.map((produto, index) => (
                        <div className="card" key={index}>
                            <div className="card-header" onClick={() => toggleExpansion(index)}>
                                <img className={`arrow ${expandedIndex === index ? 'arrow-up' : 'arrow-down'}`} src={flecha2} alt="Seta" />
                                <div className="card-mercado-text">
                                    <h2 className="card-title">{produto.fantasyName || 'Mercado Desconhecido'}</h2>
                                    <p>Distância: {produto.distKm} km</p>
                                </div>
                                <button className="custo">R$ {produto.value}</button>
                            </div>
                            {expandedIndex === index && (
                                <div className="card-content">
                                    <div className='card-content-sessao1'>
                                        <div className='card-content-titulo'>
                                            <img alt='Produto' src={produto.imageUrl || produtoImg} /> {/* Usando a URL da imagem correspondente */}
                                            <div className='produto-nome'>
                                                <h3 className='produto-nome-h3'>{produto.product}</h3>
                                                <p className='codigo-de-barras'>{produto.gtin}</p>
                                            </div>
                                        </div>
                                        <div className='card-content-quantidade'>
                                            <h3 className='card-content-quantidade-h3'>Quantidade: {produto.quantity}</h3>
                                        </div>
                                    </div>
                                    <p className='card-content-valor'>R$ {produto.value}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ListaMercados;
