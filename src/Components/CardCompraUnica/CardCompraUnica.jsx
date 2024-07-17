import React from "react"
import "./style.css";
import { useNavigate } from 'react-router-dom';
import visualizar from "../../Assets/visualizar.png";

function CardCompraUnica () {
    const navigate = useNavigate();

    const handleListaCompras = () => {
        navigate("/listaCompras");
    };  

    const handlePesquisa = () => {
        navigate("/pesquisa");
    }; 

    return(
        <div className="card-compraunica">
        <div className="card-header-compraunica">
            <img src={visualizar} alt="" onClick={handlePesquisa}/>
            <div className="card-mercado-text">
                <h2 className="card-title">Nome do mercado</h2>
                <p>Distância</p>
            </div>
            <button className="custo">Custo R$ 00,00</button>
        </div>
        </div>   
    ) 
}

export default CardCompraUnica;