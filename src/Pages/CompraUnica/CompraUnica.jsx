import React, { useEffect, useState } from "react";
import "./style.css";
import { useNavigate, useLocation } from 'react-router-dom';
import cart from "../../Assets/cart.png";
import flecha from "../../Assets/flecha-esquerda.png";
import mercado from "../../Assets/home.png";
import CardCompraUnica from "../../Components/CardCompraUnica/CardCompraUnica";
import axios from 'axios';

function CompraUnica() {
    const navigate = useNavigate();
    const location = useLocation();
    
    // Obter dados da localização anterior
    const { selectedProducts, allMarkets, selectedProductsCount } = location.state || {};
    const [marketData, setMarketData] = useState(null);

    const handleComparativo = () => {
        navigate("/comparativo");
    };

    const handleListaCompras = () => {
        navigate("/listaCompras");
    };

    useEffect(() => {
        const fetchMarketData = async () => {
            if (!selectedProducts || !allMarkets) return;

            const productIds = selectedProducts.map(prod => prod.product_id);
            const marketIds = Object.keys(allMarkets);

            try {
                const response = await axios.post('https://savvy-api.belogic.com.br/api/checkout/low-price-where-to-buy', {
                    products: productIds,
                    marketplaces: marketIds
                });

                setMarketData(response.data.data);
            } catch (error) {
                console.error('Erro ao buscar dados dos mercados:', error.response ? error.response.data : error.message);
            }
        };

        fetchMarketData();
    }, [selectedProducts, allMarkets]);

    const renderMarketInfo = () => {
        if (!marketData) return null;

        return Object.keys(marketData).map(marketId => {
            const market = marketData[marketId];

            return (
                <div key={marketId} className="market-info">
                    <h4>Empresa: {market.company || 'Não disponível'}</h4>
                    <p>Total: R$ {market.total.toFixed(2)}</p>
                    <h5>Produtos:</h5>
                    <ul>
                        {market.products.map((product, index) => (
                            typeof product === 'string' ? (
                                <li key={index}>{product}</li> // Produto não encontrado
                            ) : (
                                <li key={index}>
                                    {product.product} - R$ {product.value.toFixed(2)} (Quantidade: {product.quantity})
                                </li>
                            )
                        ))}
                    </ul>
                </div>
            );
        });
    };

    return (
        <div className="compraunica-container">
            <div className="compraunica-main">
                <div className="compraunica-nav">
                    <div className="cart3">
                        <img alt="" src={flecha} onClick={handleComparativo} />
                    </div>

                    <h3>Menor preço</h3>

                    <div className="cart" onClick={handleListaCompras}>
                        <img alt="" src={cart} />
                        <p>{selectedProductsCount}</p> {/* Usando o count aqui */}
                    </div>
                </div>

                <div className="compraunica-geral">
                    <h3 className="compraunica-geral-h3">Melhor custo-benefício em um só lugar</h3>
                    <div className="icon1-geral-compraunica">
                        <img alt="" src={mercado} />
                        <p>Lista disponível em: 1 supermercado</p>
                    </div>
                    <CardCompraUnica />
                    {renderMarketInfo()}
                </div>
            </div>
        </div>
    );
}

export default CompraUnica;
