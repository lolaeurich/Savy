import React, { useState } from "react";
import "./style.css";
import local from "../../Assets/local.png";
import lista from "../../Assets/lista.png";
import conexao from "../../Assets/conexao.png";
import cesta from "../../Assets/cesta.png";
import SlideButton from 'react-slide-button';

function TelaInicial () {
    const [reset, setReset] = useState(0);

    return (
        <div className="tela-inicial-container">
            <div className="tela-inicial-main">
                <div className="savvy-logo">
                     <h1>SAVVY</h1>
                </div>
                <div className="savvy-text">
                    <h3 className="conheca-missao">Conheça mais sobre nossa missão</h3>
                    <h2 className="compras-inteligentes">Compras inteligentes:
                    <br />
                    Menos gastos com mercado
                    <br />
                    Mais recursos para seus sonhos
                    </h2>
                </div>
                <h3 className="voce-so-precisa">Você só precisa:</h3>
                <div className="container-precisa">
                    <div className="cadastro-cep">
                        <img alt="" src={local} />
                        <p>Cadastrar seu CEP</p>
                    </div>
                    <div className="cadastro-cep">
                        <img alt="" src={lista} />
                        <p>Cadastrar sua lista de compras</p>
                    </div>
                </div>
                <h3 className="voce-so-precisa">E nós te entregamos:</h3>
                <div className="container-entregamos">
                    <div className="cadastro-cep">
                        <img alt="" src={conexao} />
                        <p>Preço baixo e onde comprar</p>
                    </div>
                    <h3 className="entregamos-h3">ou</h3>
                    <div className="cadastro-cep">
                        <img alt="" src={cesta} />
                        <p>Melhor custo benefício em um só lugar</p>
                    </div>
                </div>
            </div>
            <SlideButton 
            mainText="Deslize para cadastrar" 
            overlayText="Quero começar a testar!" 
            onSlideDone={function () {
                console.log("Done!");
            }} 
            reset={reset}
            />
        </div>
    )
}

export default TelaInicial;