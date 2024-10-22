import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import "./style.css";

function AdminHome() {
    const navigate = useNavigate();
    const [produtos, setProdutos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [productName, setProductName] = useState("");
    const [productData, setProductData] = useState(null); // Para armazenar os dados do produto
    const [showEditPopup, setShowEditPopup] = useState(false); // Controle do popup de edição

    const handleAddProduto = () => {
        navigate("/upload");
    };

    const handleProduto = () => {
        navigate("/alterarProdutos");
    };

    const getAuthToken = () => {
        return localStorage.getItem('authToken');
    };

    const fetchProdutos = async () => {
        const token = getAuthToken();
        if (!token) {
            console.error('Token não encontrado');
            navigate('/admin'); // Redirecionar se não houver token
            return;
        }

        try {
            const response = await fetch('https://savvy-api.belogic.com.br/api/products', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                if (response.status === 401) {
                    navigate('/admin'); // Redirecionar para a página de login
                }
                throw new Error('Falha ao buscar produtos');
            }

            const data = await response.json();
            setProdutos(data.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProdutos();
    }, []);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (productName.trim() === "") {
            setProductData(null);
            return;
        }

        const token = getAuthToken();
        if (!token) {
            console.error("Token de autenticação não encontrado.");
            return;
        }

        try {
            const response = await fetch(`https://savvy-api.belogic.com.br/api/products/find?nome=${encodeURIComponent(productName)}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();

            if (data && data.data && data.data.length > 0) {
                setProductData(data.data[0]); // Assume que vamos trabalhar com o primeiro produto retornado
            } else {
                setProductData(null); // Limpa se não encontrar
                console.error("Produto não encontrado");
            }
        } catch (error) {
            console.error("Erro ao buscar produto:", error);
        }
    };

    const handleUpdateProduct = async () => {
        const token = getAuthToken();
        if (!token) {
            console.error("Token de autenticação não encontrado.");
            return;
        }

        try {
            const response = await fetch(`https://savvy-api.belogic.com.br/api/products/${productData.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(productData)
            });

            if (response.ok) {
                alert("Produto atualizado com sucesso!");
                setShowEditPopup(false); // Fecha o popup após a atualização
                setProductData(null); // Limpa os dados após a atualização
                fetchProdutos(); // Atualiza a lista de produtos
            } else {
                console.error("Erro ao atualizar produto:", await response.text());
            }
        } catch (error) {
            console.error("Erro ao atualizar produto:", error);
        }
    };

    const handleOpenEditPopup = (produto) => {
        setProductData(produto);
        setShowEditPopup(true);
    };

    return (
        <div className="login-container">
            <div className="login-savvy-logo">
                <h1>SAVVY</h1>
            </div>
            <div className="botoes-home">
                <button onClick={handleProduto}>Alterar/incluir produtos</button>
            </div>

            <form onSubmit={handleSearch}>
                <input 
                    type="text" 
                    value={productName} 
                    onChange={(e) => setProductName(e.target.value)} 
                    placeholder="Buscar produto..."
                />
                <button type="submit">Buscar</button>
            </form>

            {productData && (
                <div className="product-details">
                    <h2>Detalhes do Produto:</h2>
                    <p><strong>Nome:</strong> {productData.name}</p>
                    <p><strong>GTIN:</strong> {productData.gtin}</p>
                    <p><strong>Descrição:</strong> {productData.description}</p>
                    <button onClick={() => handleOpenEditPopup(productData)}>Alterar Produto</button>
                </div>
            )}

            <div className="produtos-list">
                {loading && <p>Carregando produtos...</p>}
                {error && <p>Erro: {error}</p>}
                {!loading && !error && (
                    <table className="produtos-table">
                        <thead>
                            <tr className="titulos">
                                <th>Nome</th>
                                <th>Descrição</th>
                                <th>Barcode</th>
                                <th>Criado em</th>
                                <th>Atualizado em</th>
                                <th>Imagem</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {produtos.map(produto => (
                                <tr key={produto.id} className="produto-item">
                                    <td>{produto.name}</td>
                                    <td>{produto.description || "N/A"}</td>
                                    <td>{produto.barcode}</td>
                                    <td>{produto.created_at}</td>
                                    <td>{produto.updated_at}</td>
                                    <td>
                                        {produto.image.length > 0 && (
                                            <img src={produto.image[0].url} alt={produto.name} style={{ maxWidth: '50px' }} />
                                        )}
                                    </td>
                                    <td className="acoes-container">
                                        <button onClick={() => handleOpenEditPopup(produto)}>Alterar produto</button>
                                        <button onClick={() => handleAddProduto(produto.id)}>Adicionar imagem</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {showEditPopup && (
                <div className="popup">
                    <div className="popup-content">
                        <h2>Editar Produto</h2>
                        <label>Nome:</label>
                        <input 
                            type="text" 
                            value={productData.name} 
                            onChange={(e) => setProductData({ ...productData, name: e.target.value })} 
                        />
                        <label>GTIN:</label>
                        <input 
                            type="text" 
                            value={productData.gtin} 
                            onChange={(e) => setProductData({ ...productData, gtin: e.target.value })} 
                        />
                        <label>Descrição:</label>
                        <input 
                            type="text" 
                            value={productData.description} 
                            onChange={(e) => setProductData({ ...productData, description: e.target.value })} 
                        />
                        <button onClick={handleUpdateProduct}>Salvar Alterações</button>
                        <button onClick={() => setShowEditPopup(false)}>Cancelar</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminHome;
