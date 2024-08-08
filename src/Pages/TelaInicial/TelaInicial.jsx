import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import "./style.css";
import here from "../../Assets/here.png";
import lista from "../../Assets/lista1.png";
import conexao from "../../Assets/conexao.png";
import cesta from "../../Assets/cesta.png";
import logo from "../../Assets/logo1.png";
import intelig from "../../Assets/inteligencia.jpeg";
import economia from "../../Assets/economia.jpeg";
import controle from "../../Assets/controle.jpeg";


function TelaInicial () {
    const [reset, setReset] = useState(0);
    const navigate = useNavigate();


    const handleValidacao = () => {
        navigate("/validacao");
    };

    return (
        <div className="tela-inicial-container">
            <div className="tela-inicial-main">
                <div className="savvy-logo">
                     <img alt="" src={logo}/>
                </div>
                <div className="savvy-text">
                    <h3 className="conheca-missao">Sua melhor maneira de comprar</h3>
                </div>

                <h3 className="voce-so-precisa">Cadastre:</h3>

                <div className="container-precisa">
                    <div className="cadastro-cep">
                        <img alt="" src={here} />
                        <p>CEP</p>
                    </div>
                    <p>e</p>
                    <div className="cadastro-cep">
                        <img alt="" src={lista} />
                        <p>Lista de compras</p>
                    </div>
                </div>

                <h3 className="voce-so-precisa">Receba:</h3>

                <div className="container-entregamos">
                    <div className="cadastro-cep2">
                        <h5>Economia</h5>
                        <img alt="" src={economia} />
                        <p>Encontre o menor preço de cada item.</p>
                    </div>
                    <div className="cadastro-cep2">
                        <h5>Controle</h5>
                        <img alt="" src={controle} />
                        <p>Ache os menores preços no supermercado.</p>
                    </div>
                    <div className="cadastro-cep2">
                        <h5>Inteligência</h5>
                        <img alt="" src={intelig} />
                        <p>Receba em casa pelo de menor preço.</p>
                    </div>
                </div>
            </div>

            <button
                className="slide-button"
                onClick={handleValidacao}
                reset={reset}
            >Quero começar a economizar</button>

        </div>
    )
}

export default TelaInicial;
