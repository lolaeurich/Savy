import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './style.css';
import cart from "../../Assets/cart.png";
import flecha from "../../Assets/flecha-esquerda.png";
import mercado from "../../Assets/home.png";
import produtos1 from "../../Assets/produtos.png";

function Comparativo() {
    const location = useLocation();
    const navigate = useNavigate();
    const [mercadoCount, setMercadoCount] = useState(0);
    const [produtoCount, setProdutoCount] = useState(0);
    const [selectedProductsCount, setSelectedProductsCount] = useState(0); // Adicionado para armazenar a contagem de produtos selecionados
    const [produtos, setProdutos] = useState([]);
    const [cep, setCep] = useState('');
    const [coordenadas, setCoordenadas] = useState('');
    const [custoTotal, setCustoTotal] = useState(0);
    const [melhorMercado, setMelhorMercado] = useState({
        nome: 'Não disponível',
        distancia: 'Não disponível',
        quantidadeProdutos: 0,
        custo: Infinity
    });

    useEffect(() => {
        const storedCep = localStorage.getItem('userCep');
        if (storedCep) {
            setCep(storedCep);
            fetchCidade(storedCep);
        }
    }, []);

    useEffect(() => {
        if (location.state) {
            const { selectedProducts, priceInfo, allMarkets, totalMinPrice, selectedProductsCount } = location.state;

            if (selectedProducts && selectedProducts.length > 0) {
                setProdutos(selectedProducts);
                setProdutoCount(selectedProducts.length);
                setSelectedProductsCount(selectedProductsCount); // Atualiza a contagem de produtos selecionados

                const totalMercados = Object.values(priceInfo).reduce((acc, info) => {
                    const match = info.match(/em (\d+) mercados/);
                    return match ? acc + parseInt(match[1], 10) : acc;
                }, 0);

                setMercadoCount(totalMercados);
                setCustoTotal(totalMinPrice);

                encontrarMelhorMercado(allMarkets, selectedProducts);
            }
        }
    }, [location.state]);

    const fetchCidade = async (cep) => {
        try {
            const response = await axios.get(`https://cep.awesomeapi.com.br/json/${cep}`);
            const { lat, lng } = response.data;
            setCoordenadas(`${lat},${lng}`);
        } catch (error) {
            console.error('Erro ao buscar as coordenadas:', error);
        }
    };

    const encontrarMelhorMercado = (allMarkets, selectedProducts) => {
        let melhorMercado = {
            nome: 'Não disponível',
            distancia: 'Não disponível',
            quantidadeProdutos: 0,
            custo: Infinity
        };

        allMarkets.forEach(market => {
            const produtosNoMercado = market.produtos || [];

            const todosProdutosPresentes = selectedProducts.every(produto => 
                produtosNoMercado.some(p => p.id === produto.id)
            );

            if (todosProdutosPresentes) {
                const custoTotalMercado = selectedProducts.reduce((total, produto) => {
                    const produtoNoMercado = produtosNoMercado.find(p => p.id === produto.id);
                    return total + (produtoNoMercado ? produtoNoMercado.preco : 0);
                }, 0);

                if (custoTotalMercado < melhorMercado.custo) {
                    melhorMercado = {
                        nome: market.nomeDoMercado || 'Não disponível',
                        distancia: market.distancia || 'Não disponível',
                        quantidadeProdutos: selectedProducts.length,
                        custo: custoTotalMercado
                    };
                }
            }
        });

        setMelhorMercado(melhorMercado);
    };

    const handleListaMercados = () => {
        navigate("/listaMercados", { 
            state: { 
                mercados: location.state.allMarkets,
                selectedProductsCount // Passa a contagem de produtos selecionados
            } 
        });
    };

    const handleCompraUnica = () => {
        navigate("/compraUnica");
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
            <div className="login-savvy-logo2" style={{justifyContent: "flex-end"}}>
                    <h1 style={{fontSize: "20px"}}>SAVVY</h1>
                </div>
                <div className="comparativo-nav">
                    <div className="cart2">
                        <img alt="Voltar" src={flecha} onClick={handleVoltar} />
                    </div>
                    <div className="cart">
                        <img alt="Cart Icon" src={cart} />
                        <p>{selectedProductsCount}</p> {/* Exibe a contagem de produtos selecionados */}
                    </div>
                </div>
                
                <div className="comparativo-cards">
                    <div className="card1">
                        <h3>O menor preço</h3>
                        <div className="card1-icons">
                            <div className="icon1">
                                <img alt="Mercado Icon" src={mercado} />
                                <p>{mercadoCount} supermercados</p>
                            </div>
                            <div className="icon2">
                                <img alt="Produtos Icon" src={produtos1} />
                                <p>{produtoCount} produtos</p>
                            </div>
                        </div>
                        <div className="card1-btns">
                            <button className="ver-mercados" onClick={handleListaMercados}>Ver supermercados</button>
                            <button className="custo">Custo R$ {custoTotal.toFixed(2)}</button>
                        </div>
                    </div>

                    <div className="card2">
                        <h3>O melhor Supermercado</h3>
                        <div className="lista-mercados">
                            <div className="mercado1">
                                <p className="mercado-distancia">{melhorMercado.distancia}</p>
                                <img alt="Mercado Icon" src={mercado} />
                                <p className="mercado-produtos">{melhorMercado.quantidadeProdutos} produtos</p>
                                <p className="mercado-economia">R$ {melhorMercado.custo.toFixed(2)}</p>
                            </div>
                        </div>
                        <div className="card1-btns">
                            <button className="ver-mercados" onClick={handleCompraUnica}>Ver supermercados</button>
                            <button className="custo">Custo R$ {melhorMercado.custo.toFixed(2)}</button>
                        </div>
                    </div>

                    <div className="card3">
                        <h3>Receba em casa</h3>
                        <div className="card3-icons">
                            <div className="icon3">
                                <img className="icon3-img" alt="Receba em casa" src={mercado} />
                                <div className="login-savvy-logo2" style={{justifyContent: "flex-end"}}>
                    <h1 style={{fontSize: "20px"}}>SAVVY</h1>
                </div>
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
