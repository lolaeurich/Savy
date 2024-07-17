import React, { useState } from "react";
import "./style.css";
import image from "../../Assets/image.png";

function Pesquisa () {
    const [expanded, setExpanded] = useState(false);
  const [isChecked, setIsChecked] = useState(false); // Estado para controlar o checkbox

  const handleCheckboxChange = () => {
      setIsChecked(!isChecked); // Alterna o estado do checkbox
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
                        type="checkbox"
                        checked={isChecked}
                        onChange={handleCheckboxChange}
                        id="produtoCheckbox"
                        />
                        <label htmlFor="produtoCheckbox"></label>
                        <p>Com certeza</p>
                    </div>
                    <div className="resposta2">
                        <input
                        className='checkbox-mercado'
                        type="checkbox"
                        checked={isChecked}
                        onChange={handleCheckboxChange}
                        id="produtoCheckbox"
                        />
                        <label htmlFor="produtoCheckbox"></label>
                        <p>Não vejo valor</p>
                    </div>
                    <div className="resposta3">
                        <input
                        className='checkbox-mercado'
                        type="checkbox"
                        checked={isChecked}
                        onChange={handleCheckboxChange}
                        id="produtoCheckbox"
                        />
                        <label htmlFor="produtoCheckbox"></label>
                        <p>Se fosse uma mensalidade de até R$15</p>
                    </div>
                </div>

                <div className="pergunta1">
                    <h3>Pergunta:</h3>
                    <p>Se houvesse a opção de já finalizar a compra online, você se interessaria?</p>

                    <h3>Resposta:</h3>
                    <div className="resposta1">
                        <input
                        className='checkbox-mercado'
                        type="checkbox"
                        checked={isChecked}
                        onChange={handleCheckboxChange}
                        id="produtoCheckbox"
                        />
                        <label htmlFor="produtoCheckbox"></label>
                        <p>Com certeza</p>
                    </div>
                    <div className="resposta2">
                        <input
                        className='checkbox-mercado'
                        type="checkbox"
                        checked={isChecked}
                        onChange={handleCheckboxChange}
                        id="produtoCheckbox"
                        />
                        <label htmlFor="produtoCheckbox"></label>
                        <p>Não compro online</p>
                    </div>
                    <div className="resposta3">
                        <input
                        className='checkbox-mercado'
                        type="checkbox"
                        checked={isChecked}
                        onChange={handleCheckboxChange}
                        id="produtoCheckbox"
                        />
                        <label htmlFor="produtoCheckbox"></label>
                        <p>Se fosse uma mensalidade de até R$15</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Pesquisa;