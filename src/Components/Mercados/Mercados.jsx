import React, { useState } from 'react';
import "./style.css";
import flecha from "../../Assets/flecha-direita.png";
import produto from "../../Assets/produto-imagem.png";
import WeightSelector from "../../Components/SeletorPeso/SeletorPeso";

const Card = () => {
  const [expanded, setExpanded] = useState(false);
  const [isChecked, setIsChecked] = useState(false); // Estado para controlar o checkbox

  const handleCheckboxChange = () => {
      setIsChecked(!isChecked); // Alterna o estado do checkbox
  };

  const toggleExpansion = () => {
    setExpanded(!expanded);
  };

  return (
    <div className="card">
      <div className="card-header" onClick={toggleExpansion}>
        <img className={`arrow ${expanded ? 'arrow-up' : 'arrow-down'}`} src={flecha}></img>
        <div className="card-mercado-text">
            <h2 className="card-title">Nome do mercado</h2>
            <p>Distância</p>
        </div>
        <button className="custo">Custo R$ 00,00</button>
      </div>
      {expanded && (
        <div className="card-content">
            <input
                className='checkbox-mercado'
                type="checkbox"
                checked={isChecked}
                onChange={handleCheckboxChange}
                id="produtoCheckbox"
            />
            <label htmlFor="produtoCheckbox"></label> {/* Adicione um label vazio associado ao checkbox */}
            <div className='card-content-sessao1'>
                <div className='card-content-titulo'>
                    <img alt='' src={produto} />
                    <div className='produto-nome'>
                        <h3 className='produto-nome-h3'>Produto</h3>
                        <p className='codigo-de-barras'>código de barras</p>
                    </div>
                </div>

                <div className='card-content-quantidade'>
                    <h3 className='card-content-quantidade-h3'>Quantidade</h3>
                    <WeightSelector />
                </div>
            </div> 
            <p className='card-content-valor'>R$ 00.00</p>   
        </div>
      )}
    </div>
  );
};

export default Card;
