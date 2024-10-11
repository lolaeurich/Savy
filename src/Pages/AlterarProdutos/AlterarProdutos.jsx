import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import "./style.css";

function AlterarProdutos() {

    const navigate = useNavigate();

    const handleEncontrar = () => {
        navigate("/adicionarProdutos");
    };

    const handleEditar = () => {
        navigate("/editarProdutos");
    };

    const handleListar = () => {
        navigate("/listarProdutos");
    };

    return (
        <div className="login-container">
            <div className="login-main">
                <div className="login-savvy-logo">
                    <h1>SAVVY</h1>
                </div>
                <div className="botoes-home">
                    <button onClick={handleEncontrar} style={{ height: "75px", fontSize: "14px", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.5)" }}>
                    Encontre novos produtos e adicione à base
                    </button> 
                    <button onClick={handleEditar} style={{ height: "75px", fontSize: "14px", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.5)" }}>
                    Edite produtos da nossa base
                    </button> 
                    <button onClick={handleListar} style={{ height: "75px", fontSize: "14px", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.5)" }}>
                    Liste todos os produtos da base
                    </button>
                </div>
            </div>

        </div>
    );
}

export default AlterarProdutos;
