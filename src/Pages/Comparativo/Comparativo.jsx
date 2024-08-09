import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./style.css";
import cart from "../../Assets/cart.png";
import flecha from "../../Assets/flecha-esquerda.png";
import mercado from "../../Assets/home.png";
import produtos1 from "../../Assets/produtos.png";

function Comparativo() {
    const navigate = useNavigate();
    const location = useLocation();
    const [mercadoCount, setMercadoCount] = useState(0); // Para armazenar o número de mercados
    const [produtoCount, setProdutoCount] = useState(0); // Para armazenar o número de produtos
    const [produtos, setProdutos] = useState([]);
    const [cep, setCep] = useState('');
    const [coordenadas, setCoordenadas] = useState('');

    useEffect(() => {
        const storedCep = localStorage.getItem('userCep');
        if (storedCep) {
            setCep(storedCep);
            fetchCidade(storedCep);
        }
    }, []);

    useEffect(() => {
        if (location.state) {
            const { selectedProducts, priceInfo } = location.state;
            if (selectedProducts && selectedProducts.length > 0) {
                setProdutos(selectedProducts);
                setProdutoCount(selectedProducts.length);

                // Acessa o número total de mercados disponíveis para os produtos
                const totalMercados = Object.values(priceInfo).reduce((acc, info) => {
                    const match = info.match(/em (\d+) mercados/);
                    return match ? acc + parseInt(match[1], 10) : acc;
                }, 0);

                setMercadoCount(totalMercados);
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

    const handleListaMercados = () => {
        navigate("/listaMercados");
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
                <div className="comparativo-nav">
                    <div className="cart2">
                        <img alt="Voltar" src={flecha} onClick={handleVoltar} />
                    </div>

                    <h3>Menor preço</h3>

                    <div className="cart">
                        <img alt="Cart Icon" src={cart} />
                        <p>{produtoCount}</p> {/* Exibe a quantidade de produtos no carrinho */}
                    </div>
                </div>

                <div className="comparativo-cards">
                    <div className="card1">
                        <h3>Preço baixo e onde comprar</h3>

                        <div className="card1-icons">
                            <div className="icon1">
                                <img alt="Mercado Icon" src={mercado} />
                                <p>{mercadoCount} supermercados</p> {/* Exibe o número total de mercados */}
                            </div>

                            <div className="icon2">
                                <img alt="Produtos Icon" src={produtos1} />
                                <p>{produtoCount} produtos</p> {/* Exibe o número total de produtos */}
                            </div>
                        </div>

                        <div className="card1-btns">
                            <button className="ver-mercados" onClick={handleListaMercados}>Ver supermercados</button>
                            <button className="custo">Custo R$ 00,00</button>
                        </div>
                    </div>

                    <div className="card2">
                        <h3>Melhor custo-benefício em um só lugar</h3>
                        <div className="lista-mercados">
                            {/* Aqui você pode adicionar elementos de lista de mercados com base nas informações obtidas */}
                            {/* Exemplo: */}
                            <div className="mercado1">
                                <p className="mercado-distancia">100 M</p>
                                <img alt="Mercado Icon" src={mercado} />
                                <p className="mercado-produtos">XX produtos</p>
                                <p className="mercado-economia">R$ 00.00</p>
                            </div>
                        </div>
                        <div className="card1-btns">
                            <button className="ver-mercados" onClick={handleCompraUnica}>Ver supermercados</button>
                            <button className="custo">Custo R$ 00,00</button>
                        </div>
                    </div>

                    <div className="card3">
                        <h3>Savvy</h3>
                        <p>Inteligência, qualidade e conveniência na sua porta</p>
                        <div className="card3-icons">
                            <div className="icon3">
                                <img className="icon3-img" alt="Receba em casa" src={mercado} />
                                <p className="icon3-p">Receba em casa</p>
                            </div>

                            <div className="icon4">
                                <img className="icon4-img" alt="Todos os produtos" src={produtos} />
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
