import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import "./style.css";

function AdminHome() {
    const navigate = useNavigate();
    const [produtos, setProdutos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [productName, setProductName] = useState("");
    const [productData, setProductData] = useState(null);
    const [showEditPopup, setShowEditPopup] = useState(false);
    const [showUploadPopup, setShowUploadPopup] = useState(false);
    const [imageInput, setImageInput] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [sortOption, setSortOption] = useState("name");

    const handleAddProduto = () => {
        navigate("/upload");
    };

    const getAuthToken = () => {
        return localStorage.getItem('authToken');
    };

    const fetchProdutos = async () => {
        const token = getAuthToken();
        if (!token) {
            console.error('Token não encontrado');
            navigate('/admin');
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
                    navigate('/admin');
                }
                throw new Error('Falha ao buscar produtos');
            }

            const data = await response.json();
            setProdutos(data.data);
            setFilteredProducts(data.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProdutos();
    }, []);

    const parseDate = (dateString) => {
        const [datePart, timePart] = dateString.split(" ");
        const [day, month, year] = datePart.split("/").map(Number);
        const [hours, minutes, seconds] = timePart.split(":").map(Number);
        return new Date(year, month - 1, day, hours, minutes, seconds);
    };

    const sortProducts = (products) => {
        let sortedProducts = [...products];

        switch (sortOption) {
            case "name":
                sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case "created_at":
                sortedProducts.sort((a, b) => parseDate(a.created_at) - parseDate(b.created_at));
                break;
            case "updated_at":
                sortedProducts.sort((a, b) => parseDate(a.updated_at) - parseDate(b.updated_at));
                break;
            case "no_image":
                sortedProducts.sort((a, b) => (a.image.length ? 1 : 0) - (b.image.length ? 1 : 0));
                break;
            default:
                break;
        }

        return sortedProducts;
    };

    const handleSearch = (e) => {
        e.preventDefault();
        const token = getAuthToken();
        if (!token) {
            console.error("Token de autenticação não encontrado.");
            return;
        }

        const searchLower = productName.toLowerCase();
        const matchedProducts = produtos.filter(product => {
            const productNameLower = product.name ? product.name.toLowerCase() : "";
            const productBarcodeString = product.barcode ? product.barcode.toString() : "";
            return productNameLower.includes(searchLower) || productBarcodeString.includes(searchLower);
        });

        const sortedProducts = sortProducts(matchedProducts);
        setFilteredProducts(sortedProducts);
    };

    const handleSortChange = (e) => {
        setSortOption(e.target.value);
    };

    useEffect(() => {
        const sortedProducts = sortProducts(filteredProducts);
        setFilteredProducts(sortedProducts);
    }, [sortOption, produtos]); // Atualiza ao mudar o sortOption ou produtos

    useEffect(() => {
        const sortedProducts = sortProducts(produtos);
        setFilteredProducts(sortedProducts);
    }, [produtos]); // Atualiza a lista filtrada quando produtos são carregados

    const handleOpenEditPopup = (produto) => {
        setProductData(produto);
        setShowEditPopup(true);
    };

    const openUploadPopup = () => {
        setShowUploadPopup(true);
    };

    const closeUploadPopup = () => {
        setShowUploadPopup(false);
        setImageInput([]);
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length + imageInput.length > 50) {
            alert("Você pode subir até 50 imagens.");
            return;
        }
        setImageInput(prevImages => [...prevImages, ...files]);
    };

    const handleSubmit = async () => {
        if (imageInput.length === 0) {
            alert("Por favor, escolha pelo menos uma imagem.");
            return;
        }

        const batchSize = 10;
        const token = getAuthToken();

        for (let i = 0; i < imageInput.length; i += batchSize) {
            const formData = new FormData();
            formData.append('_method', 'PUT');
            const currentBatch = imageInput.slice(i, i + batchSize);
            currentBatch.forEach((image) => {
                formData.append('images[]', image);
            });

            try {
                const response = await fetch('https://savvy-api.belogic.com.br/api/product-image', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                    body: formData,
                });

                if (response.ok) {
                    alert("Imagens enviadas com sucesso!");
                    fetchProdutos();
                } else {
                    const errorText = await response.text();
                    throw new Error(`Erro ao subir as imagens: ${errorText}`);
                }
            } catch (error) {
                console.error("Erro ao subir imagens:", error);
                alert("Erro ao enviar imagens.");
            }
        }

        setImageInput([]);
        closeUploadPopup();
    };

    const removeImage = (index) => {
        setImageInput(prevImages => prevImages.filter((_, i) => i !== index));
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
                setShowEditPopup(false);
                setProductData(null);
                fetchProdutos();
            } else {
                console.error("Erro ao atualizar produto:", await response.text());
            }
        } catch (error) {
            console.error("Erro ao atualizar produto:", error);
        }
    };

    return (
        <div className="login-container">
            <div className="login-savvy-logo">
                <h1>SAVVY</h1>
            </div>
            <div className="botoes-home">
                <button onClick={handleAddProduto}>Incluir Novo Produto</button>
                <button onClick={() => navigate("/alterarProdutos")}>Alterar/incluir produtos</button>
            </div>

            <form onSubmit={handleSearch}>
                <input 
                    type="text" 
                    value={productName} 
                    onChange={(e) => setProductName(e.target.value)} 
                    placeholder="Buscar produto..."
                />
                <button type="submit">Buscar</button>
                <select value={sortOption} onChange={handleSortChange}>
                    <option value="name">Ordenar por Nome</option>
                    <option value="created_at">Ordenar por Data de Criação</option>
                    <option value="updated_at">Ordenar por Data de Atualização</option>
                    <option value="no_image">Produtos sem Imagem</option>
                </select>
            </form>

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
                            {filteredProducts.map(produto => (
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
                                        <button onClick={openUploadPopup}>Adicionar imagem</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {showEditPopup && productData && (
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

            {showUploadPopup && (
                <div className="popup">
                    <div className="popup-content">
                        <h2>Escolha as imagens que deseja subir:</h2>
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageChange}
                        />
                        <button onClick={handleSubmit}>Subir Imagens</button>
                        <h3>Imagens carregadas:</h3>
                        <ul>
                            {imageInput.map((image, index) => (
                                <li key={index}>
                                    {image.name} 
                                    <button onClick={() => removeImage(index)}>Remover</button>
                                </li>
                            ))}
                        </ul>
                        <button onClick={closeUploadPopup}>Fechar</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminHome;
