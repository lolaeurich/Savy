import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import "./style.css";
import "../../Components/Mercados/style.css";
import flecha from "../../Assets/flecha-esquerda.png";
import flecha2 from "../../Assets/flecha-direita.png";
import cart from "../../Assets/cart.png";
import produtoImg from "../../Assets/produto-imagem.png"; // Imagem padrão do produto
import WeightSelector from "../../Components/SeletorPeso/SeletorPeso";

function ListaMercados() {
    const location = useLocation();
    const navigate = useNavigate();
    const [mercados, setMercados] = useState([]); // Estado para os mercados
    const [expandedIndex, setExpandedIndex] = useState(null); // Estado para controlar qual card está expandido

    // UseEffect para receber os mercados da página anterior
    useEffect(() => {
        if (location.state && location.state.selectedProducts) {
            const allMarkets = location.state.selectedProducts.flatMap(product => product.mercados || []);
            setMercados(allMarkets);
            console.log("Mercados recebidos:", allMarkets); // Verifique se os dados estão sendo recebidos corretamente
        } else {
            console.error("Nenhum dado recebido da página anterior.");
        }
    }, [location.state]);

    // Função para lidar com mudanças no checkbox
    const handleCheckboxChange = (index) => {
        console.log(`Checkbox no mercado ${index} alterado.`);
        // Adicione lógica para lidar com a mudança do checkbox se necessário
    };

    // Função para alternar a expansão dos cards
    const toggleExpansion = (index) => {
        setExpandedIndex(expandedIndex === index ? null : index); // Alterna a expansão do card
    };

    // Função para navegar de volta para a página comparativo
    const handleComparativo = () => {
        navigate("/comparativo");
    };

    // Card fixo para visualização
    const cardFixo = {
        name: "Mercado Fixo",
        distance: "2 km",
        cost: "R$ 5,00",
        product: "Produto Exemplo",
        barcode: "1234567890123", // Código de barras fictício
        value: "R$ 10,00",
    };

    return (
        <div className="listamercados-container">
            <div className="listamercados-main">
                <div className="listamercados-nav">
                    <div className="cart2">
                        <img alt="Voltar" src={flecha} onClick={handleComparativo} />
                    </div>

                    <h3>Menor preço</h3>

                    <div className="cart">
                        <img alt="Cart Icon" src={cart} />
                        <p>{mercados.length + 1}</p> {/* Incluindo o card fixo */}
                    </div>
                </div>

                <div className="listamercados-geral">
                    <h3 className="listamercados-geral-h3">Preço baixo e onde comprar</h3>

                    {/* Card fixo */}
                    <div className="card">
                        <div className="card-header" onClick={() => toggleExpansion('fixo')}>
                            <img className={`arrow ${expandedIndex === 'fixo' ? 'arrow-up' : 'arrow-down'}`} src={flecha2} alt="Seta" />
                            <div className="card-mercado-text">
                                <h2 className="card-title">{cardFixo.name}</h2>
                                <p>{cardFixo.distance}</p>
                            </div>
                            <button className="custo">{cardFixo.cost}</button>
                        </div>
                        {expandedIndex === 'fixo' && (
                            <div className="card-content">
                                <input
                                    className='checkbox-mercado'
                                    type="checkbox"
                                    id="produtoCheckboxFixo"
                                    onChange={() => handleCheckboxChange('fixo')}
                                />
                                <label htmlFor="produtoCheckboxFixo"></label>
                                <div className='card-content-sessao1'>
                                    <div className='card-content-titulo'>
                                        <img alt='Produto' src={produtoImg} />
                                        <div className='produto-nome'>
                                            <h3 className='produto-nome-h3'>{cardFixo.product}</h3>
                                            <p className='codigo-de-barras'>{cardFixo.barcode}</p>
                                        </div>
                                    </div>
                                    <div className='card-content-quantidade'>
                                        <h3 className='card-content-quantidade-h3'>Quantidade</h3>
                                        <WeightSelector />
                                    </div>
                                </div>
                                <p className='card-content-valor'>{cardFixo.value}</p>
                            </div>
                        )}
                    </div>

                    {/* Cards dinâmicos */}
                    {mercados.map((mercado, index) => (
                        <div className="card" key={index}>
                            <div className="card-header" onClick={() => toggleExpansion(index)}>
                                <img className={`arrow ${expandedIndex === index ? 'arrow-up' : 'arrow-down'}`} src={flecha2} alt="Seta" />
                                <div className="card-mercado-text">
                                    <h2 className="card-title">{mercado.nomeDoMercado || 'Mercado Desconhecido'}</h2>
                                    <p>{mercado.distancia}</p>
                                </div>
                                <button className="custo">{mercado.custo}</button>
                            </div>
                            {expandedIndex === index && (
                                <div className="card-content">
                                    <input
                                        className='checkbox-mercado'
                                        type="checkbox"
                                        id={`produtoCheckbox${index}`}
                                        onChange={() => handleCheckboxChange(index)}
                                    />
                                    <label htmlFor={`produtoCheckbox${index}`}></label>
                                    <div className='card-content-sessao1'>
                                        <div className='card-content-titulo'>
                                            <img alt='Produto' src={produtoImg} />
                                            <div className='produto-nome'>
                                                <h3 className='produto-nome-h3'>{mercado.produto}</h3>
                                                <p className='codigo-de-barras'>{mercado.codigoDeBarras}</p>
                                            </div>
                                        </div>
                                        <div className='card-content-quantidade'>
                                            <h3 className='card-content-quantidade-h3'>Quantidade</h3>
                                            <WeightSelector />
                                        </div>
                                    </div>
                                    <p className='card-content-valor'>{mercado.custo}</p>
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
