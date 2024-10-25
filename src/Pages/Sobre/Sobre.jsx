import React from "react";
import "./style.css";
import { useLocation, useNavigate } from 'react-router-dom';
import flecha from "../../Assets/flecha-esquerda.png";

function Sobre () {
    const location = useLocation();
    const navigate = useNavigate();

    const handlePesquisa = () => {
        navigate("/pesquisa");
    };

    const handleVoltar = () => {
        navigate("/comparativo");
    };

    return (
        <div className="sobre-container">
            <div className="sobre-main">
            <div className="cart2" style={{alignSelf: "flex-start", marginLeft: "5%"}}>
                        <img alt="Voltar" src={flecha} onClick={handleVoltar} />
                    </div>
                <div className="sobre-savvy-logo">
                    <h1>SAVVY</h1>
                </div>

                <div className="sobre-savvy-text">
                    <p>Quando você escolher o SAVVY, nosso app irá fechar com os supermercados para obter o menor preço para sua lista de compras. </p>
                    <p>Você verá o supermercado selecionado e poderá escolher a melhor data de entrega entre as opções. </p>
                    <p>Com a sua confirmação, cuidaremos de toda a logística. </p>
                    <p>Você só precisará esperar seus produtos chegarem em casa com o menor preço e a maior qualidade.</p>
                    <p className="ultimo-p">Sem custos extras! Nenhum concorrente faz isso!</p>
                </div>

                <button onClick={handlePesquisa} className="enviar-respostas">Responda nossa pesquisa</button>
            </div>
        </div>
    )
}

export default Sobre;