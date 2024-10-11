import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';

function Admin() {
    const [email, setEmail] = useState("");
    const [showError, setShowError] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault(); // Evita o envio do formulário

        try {
            const response = await fetch('https://savvy-api.belogic.com.br/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            if (response.ok) {
                const data = await response.json();
                // Armazene o token se necessário
                localStorage.setItem('authToken', data.token); // Armazena o token no localStorage
                navigate("/adminHome"); // Navega para a página de upload se a autenticação for bem-sucedida
            } else {
                setShowError(true); // Exibe mensagem de erro se as credenciais estiverem incorretas
            }
        } catch (error) {
            console.error("Erro ao fazer login:", error);
            setShowError(true);
        }
    };

    return (
        <div className="login-container">
            <div className="login-main">
                <div className="login-savvy-logo">
                    <h1>SAVVY</h1>
                </div>

                <div className="login-savvy-text">
                    <h2 className="melhor-compra">Seja bem-vindo ao</h2>
                    <h2 className="melhor-compra">painel de controle SAVVY!</h2>
                </div>

                <div className="login-savvy-text2">
                    <h2 className="digite-dados" style={{ textAlign: "center", color: "#3A7C22" }}>
                        Informe seu e-mail para acessar a plataforma:
                    </h2>
                </div>

                <form className="login-form" onSubmit={handleLogin}>
                    <input
                        type="text"
                        placeholder="E-mail"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required // Torna o campo obrigatório
                    />
                    <button
                        className="slide-button"
                        type="submit"
                    >
                        Fazer login
                    </button>
                </form>
            </div>

            {showError && (
                <div className="popup">
                    <div className="popup-content">
                        <img alt="Erro" src="https://img.icons8.com/?size=100&id=22396&format=png&color=3a7c22" />
                        <div className="erro-text">
                            <h3>Ops!!</h3>
                            <p>Houve um erro ao realizar a verificação. Confira seu e-mail e tente novamente!</p>
                        </div>
                        <button onClick={() => setShowError(false)}>Tentar Novamente</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Admin;
