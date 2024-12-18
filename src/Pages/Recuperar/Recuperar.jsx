import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import "./style.css";
import erro from "../../Assets/erro-icon.png";
import happy from "../../Assets/happy.png";
import SlideButton from 'react-slide-button';
import axios from 'axios';

function Recuperar() {
    const [email, setEmail] = useState('');
    const [codigo, setCodigo] = useState('');
    const [reset, setReset] = useState(0);
    const [showError, setShowError] = useState(false);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    // Função para solicitar um novo código de verificação
    const handleSlideDoneEmail = () => {
        if (!email || !email.includes('@') || !email.includes('.')) {
            setShowError(true);
            return;
        }

        // Dados para solicitar novo código
        const data = { email };

        // Envia a solicitação para o endpoint de login
        axios.post(`${process.env.REACT_APP_API_URL}/login`, data)
            .then(response => {
                // Sucesso ao solicitar novo código
                setSuccess(true);
                setTimeout(() => navigate('/validacao'), 3000);
            })
            .catch(error => {
                console.error('Erro ao solicitar novo código:', error.response ? error.response.data : error.message);
                setShowError(true);
            });
    };

    // Função para validar o código de verificação
    const handleSlideDone = () => {
        // Verifica se o e-mail e o código de verificação são válidos
        if (!email || !email.includes('@') || !email.includes('.') || !codigo) {
            setShowError(true);
            return;
        }

        // Dados para a validação
        const data = { email, code: codigo };

        // Envia a solicitação de validação para o endpoint de validação
        axios.post(`${process.env.REACT_APP_API_URL}/email-validate`, data)
            .then(response => {
                // Sucesso na validação
                const token = response.data.token; // Ajuste conforme a estrutura da resposta da API
                if (token) {
                    localStorage.setItem('authToken', token);
                }
                setTimeout(() => navigate('/areaLogada'), 2000);
            })
            .catch(error => {
                console.error('Erro ao validar e-mail:', error.response ? error.response.data : error.message);
                setShowError(true);
            });
    };

    const handleTryAgain = () => {
        setShowError(false);
        setSuccess(false);
        setReset(reset + 1);
    };

    return (
        <div className="">
            <div className="login-main-recuperar">
                <div className="login-savvy-logo-recuperar">
                    <h1>SAVVY</h1>
                </div>

                    <h2 className="login-esqueci">Esqueci a senha</h2>

                <div className="login-savvy-text">
                    <h3 className="bem-vindo">Seja bem-vindo!</h3>
                    <h2 className="melhor-compra">Com Savvy, você</h2>
                    <h2 className="melhor-compra">sempre tem a melhor opção!</h2>
                </div>

                <div className="login-savvy-text2">
                    <h2 className="digite-dados" style={{ textAlign: "center", color: "#3A7C22" }}>
                        Informe seu e-mail para receber um novo código de verificação:
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

                <button
                    className="slide-button"
                    onClick={handleSlideDoneEmail}
                >Solicitar nova senha</button>
            </div>

            {showError && (
                <div className="popup">
                    <div className="popup-content">
                        <img alt="Erro" src={erro} />
                        <div className="erro-text">
                            <h3>Ops!!</h3>
                            <p>Houve um erro ao solicitar um novo código. Verifique seu e-mail e tente novamente!</p>
                        </div>
                        <button onClick={handleTryAgain}>Tentar Novamente</button>
                    </div>
                </div>
            )}

            {success && (
                <div className="popup">
                    <div className="popup-content">
                        <img alt="Sucesso" src={happy} />
                        <div className="erro-text">
                            <h3>Sucesso!</h3>
                            <p>Um novo código foi enviado para o seu e-mail. Verifique sua caixa de entrada.</p>
                        </div>
                        <button onClick={() => navigate('/validacao')}>Ir para Validação</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Recuperar;
