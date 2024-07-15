import React from "react";
import "./style.css";
import cart from "../../Assets/cart.png";
import flecha from "../../Assets/flecha-esquerda.png";
import mercado from "../../Assets/home.png";
import produtos from "../../Assets/produtos.png";

function Comparativo () {
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
                            <button className="ver-mercados">Ver supermercados</button>
                            <button className="custo">Custo R$ 00,00</button>
                        </div>
                    </div>
                
                    <div className="card2">

                    </div>

                    <div className="card3">

                    </div>
                </div>    
            </div>    
        </div>
    )
}

export default Comparativo;