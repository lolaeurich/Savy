import React from "react";
import "./style.css";
import { useNavigate } from 'react-router-dom';
import cart from "../../Assets/cart.png";
import flecha from "../../Assets/flecha-esquerda.png";
import mercado from "../../Assets/home.png";
import produtos from "../../Assets/produtos.png";
import local from "../../Assets/local-cinza.png";

function Comparativo () {
    const navigate = useNavigate();

    const handleListaMercados = () => {
        navigate("/listaMercados");
    };

    const handleCompraUnica = () => {
        navigate("/compraUnica");
    };

    const handleSobre = () => {
        navigate("/sobreASavvy");
    };

    return (
        <div className="comparativo-container">
            <div className="comparativo-main">
                <div className="comparativo-nav">
                    <div className="cart2">
                        <img alt="" src={flecha} />
                    </div>

                    <h3>Menor preço</h3>

                    <div className="cart">
                        <img alt="" src={cart} />
                        <p>xx</p>
                    </div>    
                </div>

                <div className="comparativo-cards">
                    <div className="card1">
                        <h3>Preço baixo e onde comprar</h3>

                        <div className="card1-icons">
                            <div className="icon1">
                                <img alt="" src={mercado} />
                                <p>XX supermercados</p>
                            </div>

                            <div className="icon2">
                                <img alt="" src={produtos} />
                                <p>XX produtos</p>
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
                            <div className="mercado1">
                                <p className="mercado-distancia">100 M</p>
                                <img alt="" src={mercado} />
                                <p className="mercado-produtos">XX produtos</p>
                                <p className="mercado-economia">R$ 00.00</p>
                            </div>
                            <div className="mercado1">
                                <p className="mercado-distancia">100 M</p>
                                <img alt="" src={mercado} />
                                <p className="mercado-produtos">XX produtos</p>
                                <p className="mercado-economia">R$ 00.00</p>
                            </div>
                            <div className="mercado1">
                                <p className="mercado-distancia">100 M</p>
                                <img alt="" src={mercado} />
                                <p className="mercado-produtos">XX produtos</p>
                                <p className="mercado-economia">R$ 00.00</p>
                            </div>
                            <div className="mercado1">
                                <p className="mercado-distancia">100 M</p>
                                <img alt="" src={mercado} />
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
                        <h3>Savvyr</h3>
                        <p>Inteligência, qualidade e conveniência na sua porta</p>
                            <div className="card3-icons">
                                <div className="icon3">
                                    <img className="icon3-img" alt="" src={mercado} />
                                    <p className="icon3-p">Receba em casa</p>
                                </div>

                                <div className="icon4">
                                    <img className="icon4-img" alt="" src={produtos} />
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
    )
}

export default Comparativo;