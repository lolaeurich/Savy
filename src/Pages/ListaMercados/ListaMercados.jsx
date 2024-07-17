import React from "react";
import "./style.css";
import { useNavigate } from 'react-router-dom';
import flecha from "../../Assets/flecha-esquerda.png";
import cart from "../../Assets/cart.png";
import Card from "../../Components/Mercados/Mercados";

function ListaMercados () {
    const navigate = useNavigate();

    const handleComparativo = () => {
        navigate("/comparativo");
    };  

    return (
        <div className="listamercados-container">
            <div className="listamercados-main">
                <div className="listamercados-nav">
                    <div className="cart2">
                            <img alt="" src={flecha} onClick={handleComparativo}/>
                    </div>

                    <h3>Menor preço</h3>

                    <div className="cart">
                        <img alt="" src={cart} />
                        <p>xx</p>
                    </div>    
                </div>

                <div className="listamercados-geral">
                    <h3 className="listamercados-geral-h3">Preço baixo e onde comprar</h3>
                    <Card />
                </div>   
            </div>
        </div>
    )
}

export default ListaMercados;