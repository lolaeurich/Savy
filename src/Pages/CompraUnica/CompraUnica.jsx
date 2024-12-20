import React, { useEffect, useState } from "react";
import "./style.css";
import { useNavigate, useLocation } from 'react-router-dom';
import cart from "../../Assets/cart.png";
import flecha from "../../Assets/flecha-esquerda.png";
import mercado from "../../Assets/home.png";
import axios from 'axios';
import visualizar from "../../Assets/visualizar.png";
import { radioClasses } from "@mui/material";

function CompraUnica() {
    const navigate = useNavigate();
    const location = useLocation();
    
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

            const token = localStorage.getItem('authToken');
            if (!token) {
                console.error('Token não encontrado. Verifique se o usuário está autenticado.');
                return;
            }

            try {
                const response = await axios.post(`${process.env.REACT_APP_API_URL}/checkout/low-price-where-to-buy`, {
                    products: selectedProducts,
                    marketplaces: allMarkets
                }, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
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

        const marketWithHighestCost = Object.values(marketData)
            .map(market => ({
                ...market,
                validProducts: market.products.filter(product => typeof product !== 'string')
            }))
            .filter(market => market.validProducts.length > 0)
            .reduce((highest, current) => {
                return current.total > highest.total ? current : highest;
            }, { total: 0 });

        if (marketWithHighestCost.total === 0) return null;

        return (
            <div key={marketWithHighestCost.mktId} className="market-info" style={{ display: "flex", alignItems: "flex-start", columnGap: "20px", border: "1px solid green", padding: "4%", borderRadius: "12px" }}>
                <img src={visualizar} alt=""/>
                <div>
                    <h4 style={{ fontSize: "12px", color: "green" }}>{marketWithHighestCost.fantasyName || marketWithHighestCost.company.split(' ')[0]}</h4>
                    <p style={{ fontSize: "12px" }}>{marketWithHighestCost.address.streetType} {marketWithHighestCost.address.street} {marketWithHighestCost.address.number}</p>

                    <h5 style={{ paddingTop: "5px" }}>Produtos:</h5>
                    <ul style={{ listStyle: "none", rowGap: "5%" }}>
                        {marketWithHighestCost.validProducts.map((product, index) => (
                            <li key={index} style={{ fontSize: "12px", paddingTop: "10px" }}>
                                &#10140; {product.product} - R$ {parseFloat(product.value).toFixed(2)} {/* Exibe o valor unitário do item */}
                            </li>
                        ))}
                    </ul>
                </div>  
                <p style={{ fontSize: "14px", backgroundColor: "transparent", border: "1px solid green", padding: "2%", textAlign: "center", fontWeight: "700", color: "green", borderRadius: "12px" }}>Custo: R$ {marketWithHighestCost.total.toFixed(2)}</p>  
            </div>
        );
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
                        <p>{selectedProductsCount}</p>
                    </div>
                </div>

                <div className="compraunica-geral">
                    <h3 className="compraunica-geral-h3">Melhor custo-benefício em um só lugar</h3>
                    <div className="icon1-geral-compraunica">
                        <img alt="" src={mercado} />
                        <p>Lista disponível em: 1 supermercado</p>
                    </div>
                    {renderMarketInfo()}
                </div>
            </div>
        </div>
    );
}

export default CompraUnica;
