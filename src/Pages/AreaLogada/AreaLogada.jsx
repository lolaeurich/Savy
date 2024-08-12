import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import "./style.css";
import cart from "../../Assets/cart.png";
import lixo from "../../Assets/lixo.png";
import cadastro from "../../Assets/cadastro.png";
import axios from 'axios';
import WeightSelector from "../../Components/SeletorPeso/SeletorPeso";
import produtoImg from "../../Assets/produto-imagem.png"; // Imagem padrão do produto
import QuantitySelector from "../../Components/SeletorQuantidade/SeletorQuantidade";

function AreaLogada() {
    const [cep, setCep] = useState('');
    const [cidade, setCidade] = useState('Lorem Ipsun');
    const [produtos, setProdutos] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [novoCep, setNovoCep] = useState('');
    const [priceInfo, setPriceInfo] = useState({});
    const [marketInfo, setMarketInfo] = useState({});
    const allowedSupermarkets = ["Guanabara", "Condor", "VERDE MAIS VILA IZABEL", "Angeloni", "Atacadão", "Atacadao", "Carrefour", 
        "Muffato", "Festval", "Pao de Açúcar", "GPA", "Walmart", "Big", "Sonda", "BH", "Zaffari", "Jacomar", "Casa Fiesta", "Harri",
        "Goias", "Planalto", "bozlatto", "Sierra", "Tissi", "Cial Beal", "Bissoto", "Carlos"
    ];
    const navigate = useNavigate();

    useEffect(() => {
        const storedCep = localStorage.getItem('userCep');
        if (storedCep) {
            setCep(storedCep);
            fetchCidade(storedCep);
        }
        fetchProdutos();
    }, []);

    const fetchCidade = async (cep) => {
        try {
            const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
            setCidade(response.data.localidade || 'Cidade não encontrada');
        } catch (error) {
            console.error('Erro ao buscar a cidade:', error);
            setCidade('Cidade não encontrada');
        }
    };

    const fetchProdutos = async () => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            console.error('Token de autenticação não encontrado.');
            return;
        }

        try {
            const response = await axios.get('https://savvy-api.belogic.com.br/api/products', {
                headers: {
                    'Authorization': `Bearer 19|fOvn5kU8eYYn3OETTlIKrVarFrih56cW03LOVkaS93a28077`
                }
            });
            setProdutos(Array.isArray(response.data.data) ? response.data.data : []);
        } catch (error) {
            console.error('Erro ao buscar produtos:', error);
        }
    };

    const fetchCoordinatesFromCep = async (cep) => {
        try {
            const response = await axios.get(`https://cep.awesomeapi.com.br/json/${cep}`);
            const { lat, lng } = response.data;

            if (lat && lng) {
                return {
                    latitude: lat,
                    longitude: lng,
                };
            } else {
                console.error("Coordenadas não encontradas.");
                return null;
            }
        } catch (error) {
            console.error("Erro ao obter coordenadas:", error);
            return null;
        }
    };

    const fetchPriceFromApi = async (productName) => {
        try {
            const coordinates = await fetchCoordinatesFromCep(cep);
            if (!coordinates) {
                console.error("Não foi possível obter as coordenadas.");
                return [];
            }
    
            const { latitude, longitude } = coordinates;
            const encodedProductName = encodeURIComponent(productName);
            const encodedLatitude = encodeURIComponent(latitude);
            const encodedLongitude = encodeURIComponent(longitude);
            const searchUrl = `https://menorpreco.notaparana.pr.gov.br/api/v1/produtos?local=${encodedLatitude}%2C${encodedLongitude}&termo=${encodedProductName}&raio=20`;
    
            console.log(`Consultando preços na URL: ${searchUrl}`);
            const response = await axios.get(searchUrl);
            const produtos = response.data.produtos;
    
            console.log("Produtos retornados da API:", produtos);
    
            // Filtra os produtos para encontrar os que estão em supermercados permitidos
            const filteredMarkets = produtos
                .filter(produto => {
                    const supermercadoNome = produto.estabelecimento.nm_emp.toLowerCase();
                    return allowedSupermarkets.some(supermarket => supermercadoNome.includes(supermarket.toLowerCase()));
                })
                .map(produto => ({
                    nomeDoMercado: produto.estabelecimento.nm_fan,
                    distancia: produto.distkm,
                    custo: produto.valor,
                    produto: productName,
                    codigoDeBarras: produto.ncm
                }));
    
            console.log("Mercados filtrados para o produto", productName, ":", filteredMarkets);
            console.log("Número de mercados encontrados para o produto", productName, ":", filteredMarkets.length);
    
            return filteredMarkets; // Retorna a lista de mercados filtrados
        } catch (error) {
            console.error("Erro ao buscar o preço:", error);
            return [];
        }
    };
    

    const handleSlideDone = async () => {
        const selectedProducts = produtos.filter(produto => produto.isChecked);
        const updatedPriceInfo = {};
        const allMarkets = [];
    
        console.log("Produtos selecionados:", selectedProducts);
    
        for (const produto of selectedProducts) {
            const filteredMarkets = await fetchPriceFromApi(produto.name);
            if (filteredMarkets.length > 0) {
                updatedPriceInfo[produto.id] = `Produto disponível em ${filteredMarkets.length} mercados`;
                allMarkets.push(...filteredMarkets); // Adiciona os mercados encontrados para o array allMarkets
            } else {
                updatedPriceInfo[produto.id] = "Nenhum mercado encontrado";
            }
        }
    
        setPriceInfo(updatedPriceInfo);
    
        // Passa os produtos selecionados, os preços e os mercados para a página de comparativo
        navigate("/comparativo", { state: { selectedProducts, priceInfo: updatedPriceInfo, allMarkets } });
    };
    
    

    const handleAddProduto = () => {
        navigate("/addProduto");
    };

    const handleEditCep = () => {
        setIsEditing(true);
        setNovoCep(cep);
    };

    const handleSaveCep = async () => {
        if (novoCep === cep) {
            setIsEditing(false);
            return;
        }

        try {
            await fetchCidade(novoCep);
            setCep(novoCep);
            localStorage.setItem('userCep', novoCep);
            setIsEditing(false);
        } catch (error) {
            console.error('Erro ao salvar o novo CEP:', error);
        }
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setNovoCep(cep);
    };

    const handleCheckboxChange = (barcode) => {
        setProdutos(prevProdutos =>
            prevProdutos.map(prod => prod.barcode === barcode ? { ...prod, isChecked: !prod.isChecked } : prod)
        );
    };

    const handleDelete = async (productId) => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.delete(`https://savvy-api.belogic.com.br/api/products/${productId}`, {
                headers: {
                    'Authorization': `Bearer 19|fOvn5kU8eYYn3OETTlIKrVarFrih56cW03LOVkaS93a28077`
                }
            });

            console.log('Produto excluído com sucesso:', response.data);
            setProdutos(prevProdutos => prevProdutos.filter(produto => produto.id !== productId));
        } catch (error) {
            console.error('Erro ao excluir o produto:', error.response ? error.response.data : error.message);
        }
    };

    return (
        <div className="areaLogada-container">
            <div className="areaLogada-main">
                <div className="areaLogada-nav">
                    <h3>Minha lista de compras</h3>
                    <div className="cart">
                        <img alt="Cart Icon" src={cart} />
                        <p>{produtos.length}</p>
                    </div>
                </div>

                <div className="areaLogada-dados">
                    <div className="areaLogada-endereco">
                        {isEditing ? (
                            <div>
                                <input
                                    type="text"
                                    value={novoCep}
                                    onChange={e => setNovoCep(e.target.value)}
                                    placeholder="Digite o novo CEP"
                                />
                                <div style={{ display: "flex", columnGap: "5px" }}>
                                    <h4 onClick={handleSaveCep}>Salvar</h4>
                                    <h4 onClick={handleCancelEdit} style={{ width: "80px" }}>Cancelar</h4>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <p>Buscas realizadas para o CEP:<span> {cep || '00000-000'}</span></p>
                                <p>Cidade:<span> {cidade}</span></p>
                                <div>
                                    <h4 onClick={handleEditCep}>Editar</h4>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="dados-compras">
                    <div className="prod-cadastrados">
                        <h1>{produtos.length}</h1>
                        <p>Produtos cadastrados</p>
                    </div>

                    <div className="reais-economizados">
                        <h1>0</h1>
                        <p>Reais economizados</p>
                    </div>
                </div>

                <div className="container-meus-produtos">
                    <div className="meus-produtos-bar">
                        <button className="meus-produtos-btn" onClick={handleAddProduto}>
                            Cadastrar produto
                            <img alt="Cadastro Icon" src={cadastro} />
                        </button>
                    </div>

                    <div className="lista-de-produtos">
                        {produtos.map(produto => (
                            <div className="card-content-produtos" key={produto.barcode}>
                                <input
                                    className='checkbox-mercado'
                                    type="checkbox"
                                    checked={produto.isChecked || false}
                                    onChange={() => handleCheckboxChange(produto.barcode)}
                                    id={`produtoCheckbox-${produto.barcode}`} // Garantir que a id seja única
                                />
                                <label htmlFor={`produtoCheckbox-${produto.barcode}`}></label>
                                <div className='card-content-sessao2'>
                                    <div className='card-content-titulo'>
                                        <img alt='Produto' src={produto.image || produtoImg} /> {/* Usa a imagem do produto ou uma imagem padrão */}
                                        <div className='produto-nome-lista'>
                                            <h3 className='produto-nome-h3'>{produto.name}</h3>
                                            <p className='codigo-de-barras'>{produto.barcode}</p>
                                        </div>
                                    </div>
                                    <div className="card-content-card">
                                        <div className='card-content-quantidade'>
                                            <h3 className='card-content-quantidade-h3'>Quantidade</h3>
                                            <QuantitySelector />
                                        </div>
                                        <img
                                            className='lixo-img'
                                            src={lixo}
                                            alt="Excluir"
                                            onClick={() => handleDelete(produto.id)}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="consultar-preco-btn">
                    <button
                        className="slide-button2"
                        onClick={handleSlideDone}
                    >Consultar preço</button>
                </div>
            </div>
        </div>
    );
}

export default AreaLogada;
