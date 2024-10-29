import React, { useState, useEffect } from "react";
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import { Chart, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import './style.css';
import { useNavigate } from 'react-router-dom';

// Registre os componentes necessários
Chart.register(CategoryScale, LinearScale, BarElement, Title);

function Respostas() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();


    const handleHome = () => {
        navigate("/adminHome");
    };

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('authToken');
            if (!token) {
                console.error("Token não encontrado!");
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get("https://savvy-api.belogic.com.br/api/questionary", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setData(response.data.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const getResponsesCount = () => {
        const userCount = new Set(data.map(item => item.user_id)).size;

        const question1Responses = data.filter(item => item.question_id === 1);
        const question2Responses = data.filter(item => item.question_id === 2);

        const question1Counts = [0, 0, 0];
        const question2Counts = [0, 0];

        question1Responses.forEach(item => {
            question1Counts[item.answer_id - 1] += 1;
        });

        question2Responses.forEach(item => {
            question2Counts[item.answer_id - 4] += 1;
        });

        return {
            userCount,
            question1Counts,
            question2Counts
        };
    };

    const { userCount, question1Counts, question2Counts } = getResponsesCount();

    const question1Data = {
        labels: ['Com certeza', 'Não vejo valor', 'Até R$ 15'],
        datasets: [
            {
                label: 'Respostas para a Pergunta 1',
                data: question1Counts,
                backgroundColor: "darkgreen",
            },
        ],
    };

    const question2Data = {
        labels: ['Com certeza', 'Não compro online'],
        datasets: [
            {
                label: 'Respostas para a Pergunta 2',
                data: question2Counts,
                backgroundColor: "orange",
            },
        ],
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="login-container">
            <div className="login-savvy-logo" style={{flexDirection: "column"}}>
            <button className="voltar-admin" style={{cursor: "pointer"}} onClick={handleHome}>&larr; Voltar para a home</button>
                <h1 style={{paddingBottom: "10%"}}>SAVVY</h1>
                <p style={{paddingBottom: "5%", fontWeight: "500", fontSize: "22px"}}>Total de usuários que responderam o questionário: <span style={{color: "green", textDecoration: "underline"}}>{userCount}</span></p>
                <div style={{display: "flex", columnGap: "120px"}}>
                    <div style={{width: "45%"}}>
                        <h2 style={{fontSize: "18px"}}>"Você pagaria uma mensalidade para acessar essas informações?"</h2>
                        <Bar data={question1Data} />
                    </div>
                    <div style={{width: "45%"}}>
                        <h2 style={{fontSize: "18px"}}>"Se houvesse a opção de já finalizar a compra 
                        online, você se interessaria?"</h2>
                        <Bar data={question2Data} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Respostas;
