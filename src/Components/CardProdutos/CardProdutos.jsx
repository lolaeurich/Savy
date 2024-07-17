import React, { useState } from "react";
import "./style.css";
import produto from "../../Assets/produto-imagem.png";
import WeightSelector from "../SeletorPeso/SeletorPeso";

function CardProdutos () {
    const [expanded, setExpanded] = useState(false);
    const [isChecked, setIsChecked] = useState(false); // Estado para controlar o checkbox
  
    const handleCheckboxChange = () => {
        setIsChecked(!isChecked); // Alterna o estado do checkbox
    };
  
    const toggleExpansion = () => {
      setExpanded(!expanded);
    };

    return (
        <div className="card-content-produtos">
            <input
                className='checkbox-mercado'
                type="checkbox"
                checked={isChecked}
                onChange={handleCheckboxChange}
                id="produtoCheckbox"
            />
            <label htmlFor="produtoCheckbox"></label>
            <div className='card-content-sessao2'>
                <div className='card-content-titulo'>
                    <img alt='' src={produto} />
                    <div className='produto-nome-lista'>
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
    )
}

export default CardProdutos;