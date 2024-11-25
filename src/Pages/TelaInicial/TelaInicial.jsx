import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import "./style.css";
import logo from "../../Assets/logo1.png";

function TelaInicial () {
    const [reset, setReset] = useState(0);
    const navigate = useNavigate();


    const handleValidacao = () => {
        navigate("/validacao");
    };

    const handleUpload = () => {
        navigate("/upload");
    };

    return (
        <div className="tela-inicial-container">
            <div className="tela-inicial-main">
                <div className="savvy-logo">
                     <img alt="" src={logo}/>
                </div>
                <div className="savvy-text">
                    <h3 className="conheca-missao">Sobre esse APP:</h3>
                </div>

                <h3 className="voce-so-precisa">Seja sagaz, seja Savvy.</h3>

                    <p className="inicio-p">Cada compra pode ser uma oportunidade de
                        economizar, e o Savvy está aqui para garantir
                        isso. Com uma interface amigável e um
                        sistema de busca inteligente, você
                        rapidamente descobre os menores preços na
                        sua região. Imagine saber exatamente onde
                        comprar e quanto vai economizar a cada vez.
                        Com o Savvy, é possível. Basta inserir seu CEP
                        e sua lista de compras, e nós cuidamos do
                        resto. Transforme suas compras em uma
                        experiência mais eficiente e satisfatória. Com o
                        Savvy, você não apenas economiza, mas se
                        torna um consumidor consciente e informado,
                        capaz de fazer o seu dinheiro render mais.
                    </p>

                    <button
                className="slide-button"
                onClick={handleValidacao}
                reset={reset}
            >Vamos começar!</button>

            </div>
        </div>
    )
}

export default TelaInicial;
