import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import "./style.css";
import erro from "../../Assets/erro-icon.png";
import SlideButton from 'react-slide-button';
import axios from 'axios';

function Login() {
    const [email, setEmail] = useState('');
    const [nome, setNome] = useState('');
    const [cep, setCep] = useState('');
    const [reset, setReset] = useState(0);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleRecuperar = () => {
        navigate("/recuperar");
    };

    const handleLogin = () => {
        navigate("/validacao");
    };

    const handleSlideDone = () => {
        // Verifica se o e-mail é válido
        if (!email || !email.includes('@') || !email.includes('.')) {
            setShowError(true);
            setErrorMessage("Por favor, insira um e-mail válido.");
            return;
        }

        // Verifica se o nome e o CEP são válidos
        if (!nome || !cep) {
            setShowError(true);
            setErrorMessage("Nome e CEP são obrigatórios.");
            return;
        }

        // Dados para o registro
        const data = { email, name: nome, cep };

        // Envia a solicitação de registro para a API
        axios.post('https://savvy-api.belogic.com.br/api/first-registration', data)
            .then(response => {
                // Sucesso no registro
                setTimeout(() => navigate('/validacao'), 1000);
            })
            .catch(error => {
                console.error('Erro ao registrar:', error.response ? error.response.data : error.message);
                setShowError(true);

                // Exibe mensagem de erro específica
                if (error.response && error.response.data && error.response.data.errors) {
                    const errors = error.response.data.errors;
                    setErrorMessage(errors.email ? errors.email[0] : errors.message || "Houve um erro ao tentar registrar.");
                } else {
                    setErrorMessage("Houve um erro ao tentar registrar. Verifique seus dados e tente novamente!");
                }
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
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Nome"
                        value={nome}
                        onChange={e => setNome(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="CEP"
                        value={cep}
                        onChange={e => setCep(e.target.value)}
                    />
                </form>

                <p className="recuperar">Já tenho cadastro.<br /> <span onClick={handleRecuperar}>Solicitar novo código de acesso!</span></p>
                <p className="recuperar">Tenho um código de acesso e lembro dele<br /> <span onClick={handleLogin}>Quero acessar agora!</span></p>

                <SlideButton
                    mainText="Deslize para cadastrar"
                    overlayText="Começar a economizar!"
                    onSlideDone={handleSlideDone}
                    reset={reset}
                />
            </div>

            {showError && (
                <div className="popup">
                    <div className="popup-content">
                        <img alt="Erro" src={erro} />
                        <div className="erro-text">
                            <h3>Ops!!</h3>
                            <p>{errorMessage}</p>
                        </div>
                        <button onClick={handleTryAgain}>Tentar Novamente</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Login;
