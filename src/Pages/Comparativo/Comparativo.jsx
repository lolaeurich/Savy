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
        melhorMercado
    } = comparativoData;

    useEffect(() => {
        const storedCep = localStorage.getItem('userCep');
        if (storedCep) {
            fetchCidade(storedCep);
        }
    }, []);

    useEffect(() => {
        if (location.state) {
            const { responseData, allMarkets } = location.state;

            if (responseData) {
                const { market_quantity, product_quantity, total, products } = responseData.data;
                setComparativoData(prevData => ({
                    ...prevData,
                    marketQuantity: market_quantity || 0,
                    selectedProductsCount: product_quantity || 0,
                    totalMinPrice: total || 0,
                    produtos: products || []
                }));

                if (allMarkets) {
                    encontrarMelhorMercado(allMarkets, products);
                    fetchLowPrice(products, allMarkets);
                } else {
                    console.error('allMarkets está indefinido');
                }
            } else {
                console.error('responseData está indefinido');
            }
        } else {
            console.error('location.state está indefinido');
        }
    }, [location.state, setComparativoData]);

    const fetchCidade = async (cep) => {
        try {
            const response = await axios.get(`https://cep.awesomeapi.com.br/json/${cep}`);
            const { lat, lng } = response.data;
            // Se precisar armazenar as coordenadas, crie um estado ou adicione ao contexto
        } catch (error) {
            console.error('Erro ao buscar as coordenadas:', error);
        }
    };

    const encontrarMelhorMercado = (allMarkets, selectedProducts) => {
        if (typeof allMarkets !== 'object' || !Array.isArray(selectedProducts) || selectedProducts.length === 0) {
            console.error('allMarkets não é um objeto válido ou selectedProducts está vazio ou indefinido');
            return; 
        }

        let melhorMercado = {
            nome: 'Não disponível',
            distancia: 'Não disponível',
            quantidadeProdutos: 0,
            custo: Infinity
        };

        Object.values(allMarkets).forEach(market => {
            const produtosNoMercado = market.products || {};

            const todosProdutosPresentes = selectedProducts.every(produto => 
                produtosNoMercado[produto.id]
            );

            if (todosProdutosPresentes) {
                const custoTotalMercado = selectedProducts.reduce((total, produto) => {
                    const produtoNoMercado = produtosNoMercado[produto.id];
                    return total + (produtoNoMercado ? produtoNoMercado.total : 0);
                }, 0);

                if (custoTotalMercado < melhorMercado.custo) {
                    melhorMercado = {
                        nome: market.fantasyName || 'Não disponível',
                        distancia: `${market.distKm} km`,
                        quantidadeProdutos: selectedProducts.length,
                        custo: custoTotalMercado
                    };
                }
            }
        });

        setComparativoData(prevData => ({
            ...prevData,
            melhorMercado
        }));
    };

    const fetchLowPrice = async (selectedProducts, allMarkets) => {
        const token = localStorage.getItem('authToken');

        if (!token) {
            console.error('Token não encontrado. Verifique se o usuário está autenticado.');
            return;
        }

        const productIds = selectedProducts.map(prod => prod.gtin);
        const marketIds = Object.keys(allMarkets).map(marketId => parseInt(marketId));

        if (marketIds.length === 0) {
            console.error('Nenhum marketplace disponível para enviar.');
            return;
        }

        try {
            const response = await axios.post('https://savvy-api.belogic.com.br/api/checkout/low-price-where-to-buy', {
                products: productIds,
                marketplaces: marketIds
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
                        nome: melhorMercadoData.fantasyName || 'Não disponível',
                        distancia: `${melhorMercadoData.distKm} km`,
                        quantidadeProdutos: Object.keys(melhorMercadoData.products).length,
                        custo: melhorMercadoData.total || Infinity
                    }
                }));
            }
        } catch (error) {
            console.error('Erro ao buscar o preço mais baixo:', error);
        }
    };

    const handleListaMercados = () => {
        navigate("/listaMercados", { 
            state: { 
                mercados: location.state.allMarkets, 
                responseData: location.state.responseData 
            } 
        });
    };

    const handleCompraUnica = () => {
        navigate("/compraUnica", {
            state: {
                selectedProductsCount,
                produtos1,
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
                                <p className="mercado-distancia">{melhorMercado.fantasyName}</p>
                                <img alt="Mercado Icon" src={mercado} />
                                <p className="mercado-produtos">{selectedProductsCount} produtos</p>
                                <p className="mercado-economia">R$ {totalMinPrice.toFixed(2)}</p>
                            </div>
                        </div>
                        <div className="card1-btns">
                            <button className="ver-mercados" onClick={handleCompraUnica}>Ver supermercados</button>
                        </div>
                    </div>

                    <div className="card3">
                        <h3>Receba em casa</h3>
                        <div className="card3-icons">
                            <div className="icon3">
                                <img className="icon3-img" alt="Receba em casa" src={mercado} />
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
