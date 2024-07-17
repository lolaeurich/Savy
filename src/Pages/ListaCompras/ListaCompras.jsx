import React from "react";
import "./style.css";
import { useNavigate } from 'react-router-dom';
import cart from "../../Assets/cart.png";
import flecha from "../../Assets/flecha-esquerda.png";
import mercado from "../../Assets/home.png";
import CardProdutos from "../../Components/CardProdutos/CardProdutos";

function ListaCompras () {
    const navigate = useNavigate();

    const handleCompraUnica = () => {
        navigate("/compraUnica");
    };  

    return (
        <div className="listacompras-container">
            <div className="listacompras-main">
                <div className="listacompras-nav">
                    <div className="cart4" onClick={handleCompraUnica}>
                        <img alt="" src={flecha}/>
                    </div>

                    <h3>Minha lista de compras</h3>

                    <div className="cart">
                        <img alt="" src={cart} />
                        <p>xx</p>
                    </div>    
                </div> 

                <div className="listacompras-geral">
                    <CardProdutos/>
                </div>   
            </div>
        </div>
    )
}

export default ListaCompras;
