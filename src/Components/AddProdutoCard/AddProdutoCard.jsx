import React, { useState } from "react";
import produto from "../../Assets/produto-imagem.png";
import WeightSelector from "../SeletorPeso/SeletorPeso";

function AddProdutoCard({ produto }) { // Recebe o produto como prop
    const [expanded, setExpanded] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
  
    const handleCheckboxChange = () => {
        setIsChecked(!isChecked);
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
                    <img alt='' src={produto.image || produto} /> {/* Atualize com a imagem do produto */}
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
