import React, { useState, useEffect } from "react";
import "./style.css";
import image from "../../Assets/image.png";

function Pesquisa() {
  const [selectedAnswers, setSelectedAnswers] = useState({
    pergunta1: null,
    pergunta2: null,
  });
  const [message, setMessage] = useState(""); // Para exibir mensagens
  const [isModalOpen, setIsModalOpen] = useState(false); // Controla o estado do modal
  const [hasResponded, setHasResponded] = useState(false); // Controla se o usuário já respondeu

  useEffect(() => {
    const checkResponses = async () => {
      const token = localStorage.getItem("authToken");
      if (token) {
        try {
          const response = await fetch("https://savvy-api.belogic.com.br/api/answer-questionary", {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`,
            },
          });
          
          if (response.ok) {
            const data = await response.json();
            if (data.length > 0) { // Verifica se há respostas
              setMessage("Você já respondeu a este questionário.");
              setHasResponded(true);
              setIsModalOpen(true); // Abre o modal se já respondeu
            }
          }
        } catch (error) {
          console.error("Erro ao verificar respostas:", error);
        }
      }
    };

    checkResponses();
  }, []);

  const handleCheckboxChange = (pergunta, resposta) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [pergunta]: resposta,
    }));
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("authToken");
    console.log("Token:", token); // Debug: Mostra o token no console

    if (!token) {
      setMessage("Token inválido ou não fornecido.");
      setIsModalOpen(true);
      return;
    }

    // Montar o body da requisição
    const answers = [
      { question_id: 1, answer_id: selectedAnswers.pergunta1 },
      { question_id: 2, answer_id: selectedAnswers.pergunta2 },
    ].filter(answer => answer.answer_id !== null);

    try {
      const response = await fetch("https://savvy-api.belogic.com.br/api/answer-questionary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ questionary: answers }),
      });

      if (!response.ok) {
        throw new Error("Erro ao enviar as respostas.");
      }

      const result = await response.json();
      setMessage("Respostas enviadas com sucesso!");
      setIsModalOpen(true);
      console.log(result);
    } catch (error) {
      setMessage(`Erro: ${error.message}`);
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setMessage(""); // Limpa a mensagem
  };

  const handleBack = () => {
    // Redireciona para a página anterior
    window.history.back();
  };

  return (
    <div className="pesquisa-container">
      <img alt="" src={image} />

      <div className="perguntas">
        <div className="pergunta1">
          <h3>Pergunta:</h3>
          <p>Você pagaria uma mensalidade para acessar essas informações?</p>

          <h3>Resposta:</h3>
          <div className="resposta1">
            <input
              className='checkbox-mercado'
              type="radio"
              checked={selectedAnswers.pergunta1 === 1}
              onChange={() => handleCheckboxChange('pergunta1', 1)}
              id="pergunta1_resposta1"
              disabled={hasResponded} // Desabilita se já respondeu
            />
            <p>Com certeza</p>
          </div>
          <div className="resposta2">
            <input
              className='checkbox-mercado'
              type="radio"
              checked={selectedAnswers.pergunta1 === 2}
              onChange={() => handleCheckboxChange('pergunta1', 2)}
              id="pergunta1_resposta2"
              disabled={hasResponded} // Desabilita se já respondeu
            />
            <p>Não vejo valor</p>
          </div>
          <div className="resposta3">
            <input
              className='checkbox-mercado'
              type="radio"
              checked={selectedAnswers.pergunta1 === 3}
              onChange={() => handleCheckboxChange('pergunta1', 3)}
              id="pergunta1_resposta3"
              disabled={hasResponded} // Desabilita se já respondeu
            />
            <p>Se fosse uma mensalidade de até R$15</p>
          </div>
        </div>

        <div className="pergunta2">
          <h3>Pergunta:</h3>
          <p>Se houvesse a opção de já finalizar a compra online, você se interessaria?</p>

          <h3>Resposta:</h3>
          <div className="resposta1">
            <input
              className='checkbox-mercado'
              type="radio"
              checked={selectedAnswers.pergunta2 === 4}
              onChange={() => handleCheckboxChange('pergunta2', 4)}
              id="pergunta2_resposta1"
              disabled={hasResponded} // Desabilita se já respondeu
            />
            <p>Com certeza</p>
          </div>
          <div className="resposta2">
            <input
              className='checkbox-mercado'
              type="radio"
              checked={selectedAnswers.pergunta2 === 5}
              onChange={() => handleCheckboxChange('pergunta2', 5)}
              id="pergunta2_resposta2"
              disabled={hasResponded} // Desabilita se já respondeu
            />
            <p>Não compro online</p>
          </div>
        </div>

        {!hasResponded && (
          <button className="enviar-respostas" onClick={handleSubmit}>Enviar Respostas</button>
        )}
      </div>

      {/* Popup Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{message}</h3>
            {hasResponded ? (
              <button onClick={handleBack}>Voltar</button>
            ) : (
              <button onClick={closeModal}>Fechar</button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Pesquisa;
