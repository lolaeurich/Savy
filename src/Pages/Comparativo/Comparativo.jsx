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
                    produtos: selectedProducts || []  // Aqui você atribui os produtos selecionados
                }));
    
                console.log('Products:', selectedProducts);
                console.log('All Markets:', allMarkets);
                console.log('Selected Product IDs:', selectedProductIds); // Log para depuração
    
                if (allMarkets) {
                    fetchLowPrice(selectedProductIds, allMarkets); // Usando selectedProductIds
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
    
    

    const fetchLowPrice = async (selectedProducts, allMarkets) => {
        const token = localStorage.getItem('authToken');
        console.log('Token:', token); // Verifique o token
    
        if (!token) {
            console.error('Token não encontrado. Verifique se o usuário está autenticado.');
            return;
        }
    
        // Obter os IDs dos produtos selecionados da location.state
        const productIds = selectedProducts.map(prod => prod.product_id); // Aqui você mapeia para pegar os IDs
        
        // Verifique se allMarkets é um array antes de mapear
        if (!Array.isArray(allMarkets)) {
            console.error('allMarkets não é um array:', allMarkets);
            return;
        }
    
        const marketIds = allMarkets.map(market => market.mktId); // Extrair os mktId dos mercados
    
        if (productIds.length === 0 || marketIds.length === 0) {
            console.error('Nenhum ID de produto ou mercado disponível para enviar.');
            return;
        }
    
        console.log('IDs dos produtos:', productIds);
        console.log('IDs dos mercados:', marketIds);
    
        try {
            const response = await axios.post('https://savvy-api.belogic.com.br/api/checkout/low-price-where-to-buy', {
                products: productIds,
                marketplaces: marketIds
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
    
            console.log('Resposta da API:', response.data); // Log da resposta da API
    
            const lowPriceData = response.data.data;
            if (Object.keys(lowPriceData).length > 0) {
                // Pega o primeiro mercado com o menor preço
                const melhorMercadoData = lowPriceData[Object.keys(lowPriceData)[0]];
                setComparativoData(prevData => ({
                    ...prevData,
                    melhorMercado: {
                        nome: melhorMercadoData.company || 'Não disponível', // Nome da empresa
                        quantidadeProdutos: productIds.length, // Usar o número de produtos selecionados
                        custo: melhorMercadoData.total || Infinity // Total
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
        console.log('Selected Product IDs:', location.state.selectedProductIds); // Log para depuração
    
        navigate("/compraUnica", {
            state: {
                selectedProducts: location.state.selectedProductIds, // Usar selectedProductIds aqui
                allMarkets: comparativoData.produtos.map(prod => prod.mktId), // IDs dos mercados
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
                                <p className="mercado-distancia">{melhorMercado.nome}</p>
                                <img alt="Mercado Icon" src={mercado} />
                                <p className="mercado-produtos">{selectedProductsCount} produtos</p>
                                <p className="mercado-economia">R$ {melhorMercado.custo.toFixed(2)}</p>
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
