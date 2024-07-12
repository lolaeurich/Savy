import React, { useState } from "react";
import "./style.css";
import local from "../../Assets/local.png";
import lista from "../../Assets/lista.png";
import conexao from "../../Assets/conexao.png";
import cesta from "../../Assets/cesta.png";
import flecha from "../../Assets/flecha-btn.png";
import { SwipeableButton } from "react-swipeable-button";

function TelaInicial () {
    const onSuccess = () => {
        console.log("Successfully Swiped!");
      };

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
            <div className="btn-cadastro">
                <SwipeableButton
                    onSuccess={onSuccess}
                    text="Deslize para cadastrar!"
                    text_unlocked="Quero começar a testar!"
                    color="#16362d"
                />
            </div>
        </div>
    )
}

export default TelaInicial;