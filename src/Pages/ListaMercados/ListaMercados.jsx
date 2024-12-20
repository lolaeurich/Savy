import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./style.css";
import "../../Components/Mercados/style.css";
import flecha from "../../Assets/flecha-esquerda.png";
import flecha2 from "../../Assets/flecha-direita.png";
import cart from "../../Assets/cart.png";
import produtoImg1 from "../../Assets/products.png"; 

function ListaMercados() {
    const location = useLocation();
    const navigate = useNavigate();
    const [produtos, setProdutos] = useState([]);
    const [expandedIndices, setExpandedIndices] = useState([]); 
    const [produtoCount, setProdutoCount] = useState(0);

    useEffect(() => {
        if (location.state && location.state.responseData) {
            const { products } = location.state.responseData.data;
            setProdutos(products || []);
        } else {
            console.error("Nenhum dado recebido da página anterior.");
        }
    }, [location.state]);

    const toggleExpansion = (index) => {
        setExpandedIndices((prevExpandedIndices) => {
            if (prevExpandedIndices.includes(index)) { 
                // Remove o índice se já estiver expandido
                return prevExpandedIndices.filter(i => i !== index);
            } else {
                // Adiciona o índice se não estiver expandido
                return [...prevExpandedIndices, index];
            }
        });
    };

    const handleComparativo = () => {
        localStorage.setItem('comparativoData', JSON.stringify(produtos));
        navigate("/comparativo");
    };

    return (
        <div className="listamercados-container">
            <div className="listamercados-main">
                <div className="login-savvy-logo2" style={{ justifyContent: "flex-end" }}>
                    <h1 style={{ fontSize: "20px" }}>SAVVY</h1>
                </div>
                <div className="listamercados-nav">
                    <div className="cart2">
                        <img alt="Voltar" src={flecha} onClick={handleComparativo} />
                    </div>
                    <div className="cart">
                        <img alt="Cart Icon" src={cart} />
                        <p>{produtos.length}</p>
                    </div>
                </div>

                <div className="listamercados-geral">
                    <h3 className="listamercados-geral-h3">Preço baixo e onde comprar</h3>

                    {produtos.map((produto, index) => (
                        <div className="card" key={index}>
                            <div className="card-header" onClick={() => toggleExpansion(index)}>
                                <img className={`arrow ${expandedIndices.includes(index) ? 'arrow-up' : 'arrow-down'}`} src={flecha2} alt="Seta" />
                                <div className="card-mercado-text">
                                    <h2 className="card-title">{produto.fantasyName || produto.company.split(' ')[0]}</h2>
                                    <p>Distância: {produto.distKm} km</p>
                                    <p>{produto.address.streetType} {produto.address.street} {produto.address.number}</p>
                                </div>
                                <button className="custo">R$ {produto.value}</button>
                            </div>
                            {expandedIndices.includes(index) && (
                                <div className="card-content">
                                    <div className='card-content-sessao1'>
                                        <div className='card-content-titulo'>
                                            <img alt='Produto' src={produto.imageUrl || produtoImg1} />
                                            <div className='produto-nome'>
                                                <h3 className='produto-nome-h3'>{produto.product}</h3>
                                                <p className='codigo-de-barras'>{produto.gtin}</p>
                                            </div>
                                        </div>
                                        <div className='card-content-quantidade'>
                                            <h3 className='card-content-quantidade-h3'>Quantidade: {produto.quantity}</h3>
                                        </div>
                                    </div>
                                    <p className='card-content-valor'>R$ {produto.value}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ListaMercados;
