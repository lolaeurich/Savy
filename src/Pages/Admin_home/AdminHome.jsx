import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import "./style.css";

function AdminHome() {

    const navigate = useNavigate();

    const handleAddProduto = () => {
        navigate("/upload");
    };

    const handleProduto = () => {
        navigate("/alterarProdutos");
    };

    return (
        <div className="login-container">
            <div className="login-main">
                <div className="login-savvy-logo">
                    <h1>SAVVY</h1>
                </div>
                <p>Escolha o que deseja fazer na plataforma:</p>
                <div className="botoes-home">
                    <button onClick={handleAddProduto}>Adicionar imagens de produtos</button> 
                    <button onClick={handleProduto}>Alterar/incluir produtos</button> 
                </div>
            </div>

        </div>
    );
}

export default AdminHome;
