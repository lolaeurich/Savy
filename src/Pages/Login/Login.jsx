import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import "./style.css";
import SlideButton from 'react-slide-button';

function Login () {
    const [reset, setReset] = useState(0);
    const navigate = useNavigate();

    const handleSlideDone = () => {

        setTimeout(() => {
            navigate('/login');
        }, 2000); 
    };

    return (
        <div className="login-container">
            <div className="login-main">
                <div className="login-savvy-logo">
                    <h1>SAVVY</h1>
                </div>   

                 <div className="login-savvy-text">
                    <h3 className="bem-vindo">Seja bem-vindo!</h3>
                    <h2 className="melhor-compra">Com o Savvy, você 
                    <br />
                    sempre faz a melhor compra!
                    </h2>
                </div> 

                <div className="login-savvy-text2">
                    <h3 className="economizar">Comece a economizar</h3>
                    <h2 className="digite-dados">Digite seus dados abaixo:</h2>
                </div> 

                <form className="login-form">
                    <input
                        type="text"
                        value="E-mail"
                        name="E-mail"
                    />
                    <input
                        type="text"
                        value="Nome"
                        name="nome"
                    />
                    <input
                        type="text"
                        value="CEP"
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
        </div>
    )
}

export default Login;