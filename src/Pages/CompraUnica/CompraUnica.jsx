import React from "react";
import "./style.css";
import { useNavigate } from 'react-router-dom';
import cart from "../../Assets/cart.png";
import flecha from "../../Assets/flecha-esquerda.png";
import mercado from "../../Assets/home.png";
import produtos from "../../Assets/produtos.png";
import CardCompraUnica from "../../Components/CardCompraUnica/CardCompraUnica";

function CompraUnica () {
    const navigate = useNavigate();

    const handleComparativo = () => {
        navigate("/comparativo");
    };  

    const handleListaCompras = () => {
        navigate("/listaCompras");
    };   

    return (
        <div className="compraunica-container">
            <div className="compraunica-main">
                <div className="compraunica-nav">
                    <div className="cart3">
                        <img alt="" src={flecha} onClick={handleComparativo}/>
                    </div>

                    <h3>Menor preço</h3>

                    <div className="cart" onClick={handleListaCompras}>
                        <img alt="" src={cart} />
                        <p>xx</p>
                    </div>    
                </div>  

                <div className="compraunica-geral">
                    <h3 className="compraunica-geral-h3">Melhor custo-benefício em um só lugar</h3>
                    <div className="icon1-geral-compraunica">
                        <img alt="" src={mercado} />
                        <p>Lista disponível em: XX supermercados</p>
                    </div>
                    <CardCompraUnica />
                </div> 
            </div>
        </div>
    )
}

export default CompraUnica;