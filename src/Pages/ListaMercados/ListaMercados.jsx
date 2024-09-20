import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./style.css";
import "../../Components/Mercados/style.css";
import flecha from "../../Assets/flecha-esquerda.png";
import flecha2 from "../../Assets/flecha-direita.png";
import cart from "../../Assets/cart.png";
import produtoImg from "../../Assets/produto-imagem.png"; // Imagem padrão do produto
import QuantitySelector from "../../Components/SeletorQuantidade/SeletorQuantidade";

function ListaMercados() {
    const location = useLocation();
    const navigate = useNavigate();
    const [mercados, setMercados] = useState([]); // Estado para os mercados
    const [expandedIndex, setExpandedIndex] = useState(null); // Estado para controlar qual card está expandido
    const [produtoCount, setProdutoCount] = useState(0); // Contador de produtos do carrinho
    const cardCount = mercados.length;

    // UseEffect para receber os mercados da página anterior
    useEffect(() => {
        if (location.state && location.state.mercados) {
            const filteredMercados = filterFirstProductPerType(location.state.mercados);
            setMercados(filteredMercados);
            console.log("Mercados recebidos e filtrados:", filteredMercados); // Verifique se os dados estão sendo recebidos corretamente
        } else {
            console.error("Nenhum dado recebido da página anterior.");
        }
    }, [location.state]);

    // Função para filtrar o primeiro item de cada produto
    const filterFirstProductPerType = (mercados) => {
        const seenProducts = new Set();
        const filtered = [];

        mercados.forEach((mercado) => {
            if (!seenProducts.has(mercado.produto)) {
                seenProducts.add(mercado.produto);
                filtered.push(mercado);
            }
        });

        return filtered;
    };

    // UseEffect para buscar a lista de produtos da API e atualizar o contador
    useEffect(() => {
        const fetchProdutoCount = async () => {
            try {
                const response = await axios.get('https://savvy-api.belogic.com.br/api/products', {
                    headers: {
                        'Authorization': `Bearer 19|fOvn5kU8eYYn3OETTlIKrVarFrih56cW03LOVkaS93a28077`
                    }
                });

                // Log da resposta para verificar sua estrutura
                console.log('Resposta da API:', response.data);

                // Verificar se `response.data.data` é um array
                const items = response.data.data; // Ajustado para acessar o array correto
                if (Array.isArray(items)) {
                    setProdutoCount(items.length);
                } else {
                    console.error('Resposta da API não contém um array de itens:', items);
                    setProdutoCount(0); // Define como 0 caso não seja um array
                }
            } catch (error) {
                console.error('Erro ao buscar produtos:', error);
                setProdutoCount(0); // Define como 0 em caso de erro
            }
        };

        fetchProdutoCount();
    }, []);

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

    return (
        <div className="listamercados-container">
            <div className="listamercados-main">
            <div className="login-savvy-logo2" style={{justifyContent: "flex-end"}}>
                    <h1 style={{fontSize: "20px"}}>SAVVY</h1>
                </div>
                <div className="listamercados-nav">
                    <div className="cart2">
                        <img alt="Voltar" src={flecha} onClick={handleComparativo} />
                    </div>

                    <div className="cart">
                        <img alt="Cart Icon" src={cart} />
                        <p>{cardCount}</p> {/* Mostrando a quantidade de produtos do carrinho */}
                    </div>
                </div>

                <div className="listamercados-geral">
                    <h3 className="listamercados-geral-h3">Preço baixo e onde comprar</h3>

                    {/* Cards dinâmicos */}
                    {mercados.map((mercado, index) => (
                        <div className="card" key={index}>
                            <div className="card-header" onClick={() => toggleExpansion(index)}>
                                <img className={`arrow ${expandedIndex === index ? 'arrow-up' : 'arrow-down'}`} src={flecha2} alt="Seta" />
                                <div className="card-mercado-text">
                                    <h2 className="card-title">{mercado.nomeDoMercado || 'Mercado Desconhecido'}</h2>
                                    <p>Distância: {mercado.distancia} km</p>
                                    <p>Endereço: {mercado.logradouro}, {mercado.numero}</p>
                                </div>
                                <button className="custo">R$ {mercado.custo}</button>
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
                                            <QuantitySelector />
                                        </div>
                                    </div>
                                    <p className='card-content-valor'>R$ {mercado.custo}</p>
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
