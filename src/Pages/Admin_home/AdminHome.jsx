import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import "./style.css";

function AdminHome() {
    const navigate = useNavigate();
    const [produtos, setProdutos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [productName, setProductName] = useState("");
    const [showEditPopup, setShowEditPopup] = useState(false);
    const [showNewProductPopup, setShowNewProductPopup] = useState(false);
    const [showUploadPopup, setShowUploadPopup] = useState(false);
    const [imageInput, setImageInput] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [sortOption, setSortOption] = useState("name");
    const [newProductData, setNewProductData] = useState({ searchTerm: "" });
    const [productData, setProductData] = useState([]); // Mudei de null para []


    const [code, setCode] = useState("");


    const getAuthToken = () => localStorage.getItem('authToken');

    const fetchProdutos = async () => {
        const token = getAuthToken();
        if (!token) {
            navigate('/admin');
            return;
        }

        try {
            const response = await fetch('https://savvy-api.belogic.com.br/api/products', {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                if (response.status === 401) navigate('/admin');
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
        const searchLower = productName.toLowerCase();
        const matchedProducts = produtos.filter(product => {
            const productNameLower = product.name ? product.name.toLowerCase() : "";
            const productBarcodeString = product.barcode ? product.barcode.toString() : "";
            return productNameLower.includes(searchLower) || productBarcodeString.includes(searchLower);
        });
        setFilteredProducts(sortProducts(matchedProducts));
    };

    const handleSortChange = (e) => {
        setSortOption(e.target.value);
    };

    useEffect(() => {
        setFilteredProducts(sortProducts(filteredProducts));
    }, [sortOption, produtos]);

    useEffect(() => {
        setFilteredProducts(sortProducts(produtos));
    }, [produtos]);

    const handleOpenEditPopup = (produto) => {
        setProductData(produto);
        setShowEditPopup(true);
    };

    const openNewProductPopup = () => {
        setShowNewProductPopup(true);
    };

    const closeNewProductPopup = () => {
        setShowNewProductPopup(false);
        setNewProductData({ name: "", barcode: "", description: "" });
    };

    const handleAddNewProduct = async () => {
        const token = getAuthToken();
        if (!token) {
            console.error("Token de autenticação não encontrado.");
            return;
        }
    
        const term = newProductData.searchTerm;
        const url = "https://savvy-api.belogic.com.br/api/products/find";
        const params = /^\d+$/.test(term) ? { gtin: term } : { nome: term };
    
        try {
            const response = await fetch(`${url}?${new URLSearchParams(params)}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
    
            if (response.ok) {
                const product = await response.json();
                alert("Produto encontrado!");
                closeNewProductPopup();
            } else {
                console.error("Erro ao buscar produto:", await response.text());
            }
        } catch (error) {
            console.error("Erro ao buscar produto:", error);
        }
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
            currentBatch.forEach(image => {
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
        if (!token) return;

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

    const fetchProductData = async (term) => {
        const token = getAuthToken();
        const url = "https://savvy-api.belogic.com.br/api/products/find";
        const params = /^\d+$/.test(term) ? { gtin: term } : { nome: term };
    
        try {
            const response = await fetch(`${url}?${new URLSearchParams(params)}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
    
            if (response.ok) {
                const data = await response.json();
                setProductData(data.data || []); // Garantindo que seja um array
                setError(""); // Limpa o erro se a busca for bem-sucedida
            } else {
                setError("Erro ao buscar produtos.");
            }
        } catch (err) {
            setError("Erro ao buscar produtos.");
        }
    };
    
    
    const handleChange = (id, field, value) => {
        setProductData(prevData => prevData.map(product => {
            if (product.id === id) {
                return { ...product, [field]: value, editable: true }; // Permite edição
            }
            return product;
        }));
    };
    
    const toggleEdit = (id) => {
        setProductData(prevData => prevData.map(product => {
            if (product.id === id) {
                return { ...product, editable: !product.editable }; // Alterna entre editar e salvar
            }
            return product;
        }));
    };

    const handleSelectProduct = async (product) => {
        const token = getAuthToken();
    
        // Mapeando os campos para o formato esperado pela API
        const payload = {
            name: product.desc,         // Mapeia o nome do produto
            description: product.desc,  // Mapeia a descrição do produto
            barcode: product.gtin       // Mapeia o código de barras
        };
    
        try {
            const response = await fetch('https://savvy-api.belogic.com.br/api/products', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload) // Envia o objeto mapeado
            });
    
            if (response.ok) {
                alert("Produto adicionado com sucesso!");
                closeNewProductPopup(); // Fecha a popup após adicionar
                fetchProdutos(); // Atualiza a lista de produtos
            } else {
                const errorText = await response.text();
                alert(`Erro ao adicionar produto: ${errorText}`);
            }
        } catch (error) {
            console.error("Erro ao adicionar produto:", error);
            alert("Erro ao adicionar produto.");
        }
    };
    

    return (
        <div className="login-container">
            <div className="login-savvy-logo">
                <h1>SAVVY</h1>
            </div>
            <div className="botoes-home">
                <button style={{cursor: "pointer"}} onClick={openNewProductPopup}>Incluir Novo Produto +</button>
            </div>

            <form onSubmit={handleSearch} style={{ width: "90%", display: "flex" }}>
                <input
                    style={{ height: "35px", borderRadius: "12px", padding: "1%", border: "1px solid #2a5e17" }}
                    type="text"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="Buscar produto..."
                />
                <button type="submit" style={{ marginLeft: "1%", cursor: "pointer", backgroundColor: "#2a5e17", color: "#fff", border: "none", marginRight: "3%", paddingInline: "1%", borderRadius: "12px" }}>Buscar</button>
                <label>
                    <select
                        name="filtro"
                        value={sortOption}
                        onChange={handleSortChange}
                        style={{ height: "35px", borderRadius: "12px", padding: "1%", border: "1px solid #2a5e17" }}
                    >
                        <option value="filtrar" disabled>Filtrar</option>
                        <option value="name">Ordenar por Nome</option>
                        <option value="created_at">Ordenar por Data de Criação</option>
                        <option value="updated_at">Ordenar por Data de Atualização</option>
                        <option value="no_image">Produtos sem Imagem</option>
                    </select>
                </label>
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
                                    <td style={{ color: "red" }}>{produto.barcode}</td>
                                    <td>{produto.created_at}</td>
                                    <td>{produto.updated_at}</td>
                                    <td>
                                        {produto.image.length > 0 && (
                                            <img src={produto.image[0].url} alt={produto.name} style={{ maxWidth: '50px' }} />
                                        )}
                                    </td>
                                    <td className="acoes-container">
                                        <button style={{cursor: "pointer"}} onClick={() => handleOpenEditPopup(produto)}>Alterar produto</button>
                                        <button style={{cursor: "pointer"}} onClick={openUploadPopup}>Adicionar imagem</button>
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
                            value={productData.barcode}
                            onChange={(e) => setProductData({ ...productData, barcode: e.target.value })}
                        />
                        <label>Descrição:</label>
                        <input
                            type="text"
                            value={productData.description}
                            onChange={(e) => setProductData({ ...productData, description: e.target.value })}
                        />
                        <button style={{cursor: "pointer"}} onClick={handleUpdateProduct}>Salvar Alterações</button>
                        <button style={{cursor: "pointer"}} onClick={() => setShowEditPopup(false)}>Cancelar</button>
                    </div>
                </div>
            )}

{showNewProductPopup && (
    <div className="popup">
        <div className="popup-content">
        <a style={{ width: "10%", fontSize: "xx-large", alignSelf: "end", position: "relative", top: "-20px" }} onClick={closeNewProductPopup}>x</a>
            <h2 style={{fontSize: "28px", color: "darkgreen"}}>Incluir Novo Produto</h2>
            <form
                style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
                onSubmit={(e) => {
                    e.preventDefault();
                    fetchProductData(newProductData.searchTerm);
                }}
            >
                <label>Termo ou código de barras</label>
                <input
                    style={{ height: "45px", borderRadius: "12px", paddingInline: "2%", marginTop: "15px", width: "110%" }}
                    type="text"
                    placeholder="Digite aqui"
                    value={newProductData.searchTerm}
                    onChange={(e) => setNewProductData({ ...newProductData, searchTerm: e.target.value })}
                />
                <button
                    style={{ width: "50%", height: "35px", backgroundColor: "green", color: "#fff", marginTop: "10px", cursor: "pointer" }}
                    type="submit"
                >
                    Buscar
                </button>
            </form>

            {error && <p className="error-message">{error}</p>}

            {Array.isArray(productData) && productData.length > 0 && (
                <div className="product-results">
                    <h2>Resultados:</h2>
                    {productData.map(product => (
                        <div key={product.id} className="product-item" style={{ backgroundColor: "#fff", border: "solid 1px black", borderRadius: "15px", paddingInline: "10%", margin: "auto", marginBottom: "5%", padding: "3%" }}>
                            <p><strong>Nome:</strong> {product.desc}</p>
                            <p><strong>GTIN:</strong> {product.gtin}</p>
                            <p><strong>Descrição:</strong> {product.desc}</p>
                            <button
                                style={{ backgroundColor: "darkorange", color: "#fff", border: "none", width: "40%", height: "37px", marginTop: "3%", cursor: "pointer" }}
                                onClick={() => handleSelectProduct(product)}
                            >
                                Selecionar
                            </button>
                        </div>
                    ))}
                </div>
            )}

        </div>
    </div>
)}


            {showUploadPopup && (
                <div className="popup">
                    <div className="popup-content">
                        <a style={{ width: "10%", fontSize: "xx-large", alignSelf: "end", position: "relative", top: "-20px" }} onClick={closeUploadPopup}>x</a>
                        <h2>Escolha as imagens que deseja subir:</h2>
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageChange}
                        />
                        <button style={{cursor: "pointer"}} onClick={handleSubmit}>Subir Imagens</button>
                        <h3>Imagens carregadas:</h3>
                        <ul>
                            {imageInput.map((image, index) => (
                                <li key={index}>
                                    {image.name}
                                    <button style={{cursor: "pointer"}} onClick={() => removeImage(index)}>Remover</button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminHome;
