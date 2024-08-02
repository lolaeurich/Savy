import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import "./style.css";
import erro from "../../Assets/erro-icon.png";
import SlideButton from 'react-slide-button';
import axios from 'axios';

function Login() {
    const [reset, setReset] = useState(0);
    const [showError, setShowError] = useState(false);
    const navigate = useNavigate();

    const handleSlideDone = () => {
        const email = document.querySelector('input[name="email"]').value;
        const nome = document.querySelector('input[name="nome"]').value;
        const cep = document.querySelector('input[name="cep"]').value;

        // Verifica se o e-mail contém '@'
        if (!email || !email.includes('@')) {
            setShowError(true);
            return;
        }

        // Dados para o registro
        const data = {
            email: email,
            name: nome,
            cep: cep
        };

        // Envia a solicitação de registro para a API
        axios.post('https://savvy.belogic.com.br/api/first-registration', data)
            .then(response => {
                // Sucesso no registro
                // Armazena o token de autenticação, se disponível
                const token = response.data.token; // Ajuste conforme a estrutura da resposta da API
                if (token) {
                    localStorage.setItem('authToken', token);
                }

                // Armazena o CEP no localStorage
                localStorage.setItem('userCep', cep);

                // Redireciona para a área logada após o registro
                setTimeout(() => {
                    navigate('/areaLogada');
                }, 1000);
            })
            .catch(error => {
                // Se houver erro na solicitação, mostre o erro
                console.error('Erro ao registrar:', error);
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
                    <h3 className="economizar">Comece a economizar</h3>
                    <h2 className="digite-dados">Digite seus dados abaixo:</h2>
                </div>

                <form className="login-form">
                    <input
                        type="text"
                        placeholder="E-mail"
                        name="email"
                    />
                    <input
                        type="text"
                        placeholder="Nome"
                        name="nome"
                    />
                    <input
                        type="text"
                        placeholder="CEP"
                        name="cep"
                    />
                </form>

                <SlideButton
                    mainText="Deslize para cadastrar"
                    overlayText="Começar a economizar!"
                    onSlideDone={handleSlideDone}
                    reset={reset}
                />
            </div>

            {/* Modal de erro */}
            {showError && (
                <div className="popup">
                    <div className="popup-content">
                        <img alt="" src={erro} />
                        <div className="erro-text">
                            <h3>Ops!!</h3>
                            <p>Houve um erro ao tentar registrar. Verifique seus dados e tente novamente!</p>
                        </div>    
                        <button onClick={handleTryAgain}>Tentar Novamente</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Login;
