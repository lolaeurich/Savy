import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import "./style.css";
import cart from "../../Assets/cart.png";
import cadastro from "../../Assets/cadastro.png";
import SlideButton from 'react-slide-button';
import axios from 'axios';

function AreaLogada() {
    const [reset, setReset] = useState(0);
    const [cep, setCep] = useState('');
    const [cidade, setCidade] = useState('Lorem Ipsun'); // Valor padrão
    const navigate = useNavigate();

    useEffect(() => {
        // Recupera o CEP armazenado no localStorage
        const storedCep = localStorage.getItem('userCep');
        if (storedCep) {
            setCep(storedCep);
            fetchCidade(storedCep);
        }
    }, []);

    const fetchCidade = async (cep) => {
        try {
            // Consulta a API do IBGE (ou outra API de CEP) para obter informações
            const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
            setCidade(response.data.localidade || 'Cidade não encontrada');
        } catch (error) {
            console.error('Erro ao buscar a cidade:', error);
            setCidade('Cidade não encontrada');
        }
    };

    const handleSlideDone = () => {
        setTimeout(() => {
            navigate('/comparativo');
        }, 1000);
    };

    const handleAddProduto = () => {
        navigate("/addProduto");
    };

    return (
        <div className="areaLogada-container">
            <div className="areaLogada-main">
                <div className="areaLogada-nav">
                    <h3>Minha lista de compras</h3>
                    <div className="cart">
                        <img alt="" src={cart} />
                        <p>xx</p>
                    </div>    
                </div>

                <div className="areaLogada-dados">
                    <div className="areaLogada-endereco">
                        <p>Buscas realizadas para o CEP:<span> {cep || '00000-000'}</span></p>
                        <p>Cidade:<span> {cidade}</span></p>
                    </div>
                    <h4>Editar</h4>
                </div>

                <div className="dados-compras">
                    <div className="prod-cadastrados">
                        <h1>XX</h1>
                        <p>Produtos cadastrados</p>
                    </div>

                    <div className="reais-economizados">
                        <h1>XX</h1>
                        <p>Reais economizados</p>
                    </div>
                </div>

                <div className="container-meus-produtos">
                    <div className="meus-produtos-bar">
                        <button className="meus-produtos-btn" onClick={handleAddProduto}>Cadastrar produto<img alt="" src={cadastro} /></button>
                    </div>

                    <div className="lista-de-produtos">

                    </div>
                </div>

                <div className="consultar-preco-btn">
                    <SlideButton
                        mainText=""
                        overlayText="Consultar preço!"
                        onSlideDone={handleSlideDone}
                        reset={reset}
                    />
                </div>
            </div>
        </div>
    );
}

export default AreaLogada;
