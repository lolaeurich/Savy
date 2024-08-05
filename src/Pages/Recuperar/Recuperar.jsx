import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import erro from "../../Assets/erro-icon.png";
import SlideButton from 'react-slide-button';
import axios from 'axios';

function Recuperar() {
    const [email, setEmail] = useState('');
    const [codigo, setCodigo] = useState('');
    const [reset, setReset] = useState(0);
    const [showError, setShowError] = useState(false);
    const navigate = useNavigate();

    const handleSlideDoneEmail = () => {

        setTimeout(() => {
            navigate('/login');
        }, 1000); 
    };

    const handleSlideDone = () => {
        // Verifica se o e-mail e o código de verificação são válidos
        if (!email || !email.includes('@') || !email.includes('.') || !codigo) {
            setShowError(true);
            return;
        }

        // Dados para a validação
        const data = { email, code: codigo };

        // Envia a solicitação de validação para a API
        axios.post('https://savvy.belogic.com.br/api/email-validate', data)
            .then(response => {
                // Sucesso na validação
                const token = response.data.token; // Ajuste conforme a estrutura da resposta da API
                if (token) {
                    localStorage.setItem('authToken', token);
                }
                setTimeout(() => navigate('/validacao'), 1000);
            })
            .catch(error => {
                console.error('Erro ao validar e-mail:', error.response ? error.response.data : error.message);
                setShowError(true);
            });
    };

    const handleTryAgain = () => {
        setShowError(false);
        setReset(reset + 1);
    };

    return (
        <div className="login-container">
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

                <SlideButton
                    mainText="Ir para a página de validação"
                    overlayText=""
                    onSlideDone={handleSlideDoneEmail}
                    reset={reset}
                />
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

export default Recuperar;
