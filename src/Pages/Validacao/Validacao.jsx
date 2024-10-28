import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import "./style.css";
import erro from "../../Assets/erro-icon.png";
import axios from 'axios';

function Validacao() {
    const [email, setEmail] = useState('');
    const [showError, setShowError] = useState(false);
    const navigate = useNavigate();

    const handleRecuperar = () => {
        navigate("/recuperar");
    };

    const handleLogin = () => {
        navigate("/login");
    };

    const handleSlideDone = () => {
        // Verifica se o e-mail é válido
        if (!email || !email.includes('@') || !email.includes('.')) {
            setShowError(true);
            return;
        }

        // Dados para a validação
        const data = { email };

        // Envia a solicitação de validação para a API
        axios.post('https://savvy-api.belogic.com.br/api/login', data)
            .then(response => {
                // Sucesso na validação
                const token = response.data.token; // Ajuste conforme a estrutura da resposta da API
                if (token) {
                    localStorage.setItem('authToken', token); // Armazena o token
                }
                setTimeout(() => navigate('/InfoIniciais'), 1000);
            })
            .catch(error => {
                console.error('Erro ao validar e-mail:', error.response ? error.response.data : error.message);
                setShowError(true);
            });
    };

    const handleTryAgain = () => {
        setShowError(false);
    };

    return (
        <div className="">
            <div className="login-main">
                <div className="login-savvy-logo">
                    <h1>SAVVY</h1>
                </div>

                <div className="login-savvy-text">
                    <h3 className="bem-vindo">Seja bem-vindo!</h3>
                    <h2 className="melhor-compra">Com o Savvy, você</h2>
                    <h2 className="melhor-compra">sempre faz a melhor compra!</h2>
                </div>

                <div className="login-savvy-text2">
                    <h2 className="digite-dados" style={{ textAlign: "center", color: "#3A7C22" }}>
                        Informe seu e-mail para acessar a plataforma:
                    </h2>
                </div>

                <form className="login-form">
                    <input
                        type="text"
                        placeholder="E-mail"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                </form>
                
                <div className="logins">
                    <p className="recuperar" onClick={handleLogin}><img alt="" src="https://img.icons8.com/?size=100&id=22396&format=png&color=3a7c22"/>Quero me cadastrar!<br /></p>
                </div>
                <button
                    className="slide-button"
                    onClick={handleSlideDone}
                >Quero economizar!</button>
            </div>

            {showError && (
                <div className="popup">
                    <div className="popup-content">
                        <img alt="Erro" src={erro} />
                        <div className="erro-text">
                            <h3>Ops!!</h3>
                            <p>Houve um erro ao realizar a verificação. Confira seu e-mail e tente novamente!</p>
                        </div>
                        <button onClick={handleTryAgain}>Tentar Novamente</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Validacao;
