import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './style.css';
import cart from "../../Assets/cart.png";
import flecha from "../../Assets/flecha-esquerda.png";
import mercado from "../../Assets/home.png";
import produtos1 from "../../Assets/produtos.png";
import { useComparativo } from '../../Context/ComparativoContext';

function Comparativo() {
    const location = useLocation();
    const navigate = useNavigate();
    const { comparativoData, setComparativoData } = useComparativo();

    const {
        marketQuantity,
        selectedProductsCount,
        totalMinPrice,
        melhorMercado,
        allMarkets, // Agora vem do contexto
        produtos,  // Produtos selecionados
    } = comparativoData;

    useEffect(() => {
        console.log('Renderizando Comparativo');
        if (location.state) {
            const { responseData, allMarkets, selectedProducts, selectedProductIds } = location.state;

            if (responseData) {
                const { market_quantity, product_quantity, total } = responseData.data;
                setComparativoData(prevData => ({
                    ...prevData,
                    marketQuantity: market_quantity || 0,
                    selectedProductsCount: product_quantity || 0,
                    totalMinPrice: total || 0,
                    produtos: selectedProducts || [],
                    allMarkets, // Salva os mercados no contexto
                    responseData,
                    selectedProductIds,
                }));

                fetchLowPrice(selectedProducts, selectedProductIds);
            } else {
                console.error('responseData está indefinido');
            }
        } else {
            console.error('location.state está indefinido');
        }
    }, [location.state, setComparativoData]);

    const fetchLowPrice = async (selectedProducts, selectedProductIds) => {
        const marketIds = selectedProducts.map(prod => prod.mktId)

        const token = localStorage.getItem('authToken');
        if (!token) {
            console.error('Token não encontrado. Verifique se o usuário está autenticado.');
            return;
        }

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/checkout/low-price-where-to-buy`, {
                products: selectedProductIds,
                marketplaces: marketIds,
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const lowPriceData = response.data.data;
            if (Object.keys(lowPriceData).length > 0) {
                const melhorMercadoData = lowPriceData[Object.keys(lowPriceData)[0]];
                setComparativoData(prevData => ({
                    ...prevData,
                    melhorMercado: {
                        nome: melhorMercadoData.company || 'Não disponível',
                        quantidadeProdutos: selectedProductIds.length,
                        custo: melhorMercadoData.total || Infinity,
                    },
                }));
            }
        } catch (error) {
            console.error('Erro ao buscar o preço mais baixo:', error);
        }
    };

    const handleListaMercados = () => {
        if (!allMarkets) {
            console.error('Os mercados não estão disponíveis.');
            return;
        }
        navigate("/listaMercados", {
            state: {
                mercados: allMarkets,
                responseData: comparativoData.responseData,
            }
        });
    };

    const handleCompraUnica = () => {
        if (!produtos || produtos.length === 0) {
            console.error('Nenhum produto selecionado disponível.');
            return;
        }
        navigate("/compraUnica", {
            state: {
                selectedProducts: comparativoData.selectedProductIds,
                allMarkets: produtos.map(prod => prod.mktId),
                selectedProductsCount,
            }
        });
    };

    const handleSobre = () => {
        navigate("/sobreASavvy");
    };

    const handleVoltar = () => {
        navigate("/areaLogada");
    };

    return (
        <div className="comparativo-container">
            <div className="comparativo-main">
                <div className="login-savvy-logo2" style={{ justifyContent: "flex-end" }}>
                    <h1 style={{ fontSize: "20px" }}>SAVVY</h1>
                </div>
                <div className="comparativo-nav">
                    <div className="cart2">
                        <img alt="Voltar" src={flecha} onClick={handleVoltar} />
                    </div>
                    <div className="cart">
                        <img alt="Cart Icon" src={cart} />
                        <p>{selectedProductsCount}</p>
                    </div>
                </div>

                <div className="comparativo-cards">
                    <div className="card1">
                        <h3>O menor preço</h3>
                        <div className="card1-icons">
                            <div className="icon1">
                                <img alt="Mercado Icon" src={mercado} />
                                <p>{marketQuantity} supermercados</p>
                            </div>
                            <div className="icon2">
                                <img alt="Produtos Icon" src={produtos1} />
                                <p>{selectedProductsCount} produtos</p>
                            </div>
                        </div>
                        <div className="card1-btns">
                            <button className="ver-mercados" onClick={handleListaMercados}>Ver supermercados</button>
                            <button className="custo">Custo R$ {totalMinPrice.toFixed(2)}</button>
                        </div>
                    </div>

                    <div className="card2">
                        <h3>O melhor Supermercado</h3>
                        <div className="lista-mercados">
                            <div className="mercado1">
                                <p className="mercado-distancia">{melhorMercado?.nome || 'Indefinido'}</p>
                                <img alt="Mercado Icon" src={mercado} />
                                <p className="mercado-produtos">{selectedProductsCount} produtos</p>
                                <p className="mercado-economia">R$ {melhorMercado?.custo?.toFixed(2) || '0.00'}</p>
                            </div>
                        </div>
                        <div className="card1-btns">
                            <button className="ver-mercados" onClick={handleCompraUnica}>Ver supermercado</button>
                        </div>
                    </div>

                    <div className="card3">
                        <h3>Receba em casa</h3>
                        <div className="card3-icons">
                            <div className="icon3">
                                <img className="icon3-img" alt="Receba em casa" src={mercado} />
                                <p className='icon4-p' style={{color: "darkgreen !important"}}>Savvy</p>
                            </div>
                            <div className="icon4">
                                <img className="icon4-img" alt="Todos os produtos" src={produtos1} />
                                <p className="icon4-p">Todos os produtos</p>
                            </div>
                        </div>
                        <div className="card1-btns">
                            <button className="ver-mercados" onClick={handleSobre}>Saiba mais</button>
                            <button className="custo">Custo R$ 00,00</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Comparativo;
