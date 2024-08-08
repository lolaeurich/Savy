import React, { useState } from "react";
import produtoImg from "../../Assets/produto-imagem.png";
import WeightSelector from "../SeletorPeso/SeletorPeso";

function AddProdutoCard({ produto }) {
    const [isChecked, setIsChecked] = useState(false);

    const handleCheckboxChange = () => {
        setIsChecked(!isChecked);
    };

    return (
        <div className="card-content-produtos">
            <input
                className='checkbox-mercado'
                type="checkbox"
                checked={isChecked}
                onChange={handleCheckboxChange}
                id={`produtoCheckbox-${produto.barcode}`} // Garantir que a id seja única
            />
            <label htmlFor={`produtoCheckbox-${produto.barcode}`}></label>
            <div className='card-content-sessao2'>
                <div className='card-content-titulo'>
                    <img alt='Produto' src={produto.image || produtoImg} /> {/* Usa a imagem do produto ou uma imagem padrão */}
                    <div className='produto-nome-lista'>
                        <h3 className='produto-nome-h3'>{produto.name || 'Produto'}</h3>
                        <p className='codigo-de-barras'>{produto.barcode || 'Código de barras'}</p>
                    </div>
                </div>
                <div className='card-content-quantidade'>
                    <h3 className='card-content-quantidade-h3'>Quantidade</h3>
                    <WeightSelector />
                </div>
            </div> 
        </div>
    );
}

export default AddProdutoCard;
