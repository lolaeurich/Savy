import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './style.css';

function AdminNovosProdutos() {
    const [searchTerm, setSearchTerm] = useState(""); // Para nome ou GTIN
    const [productData, setProductData] = useState([]); // Para armazenar os dados do produto
    const [error, setError] = useState(null); // Para armazenar erros
    const [code, setCode] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        // Se necessário, você pode buscar todos os produtos aqui
    }, []);

    const getAuthToken = () => {
        return localStorage.getItem('authToken');
    };

    const fetchProductData = async (term) => {
        console.log("Iniciando busca por:", term);
        
        if (!term) {
            setProductData([]);
            console.log("Termo vazio, limpando resultados.");
            return;
        }

        const token = getAuthToken();
        if (!token) {
            setError("Token de autenticação não encontrado.");
            console.error("Token de autenticação não encontrado.");
            return;
        }

        const url = "https://savvy-api.belogic.com.br/api/products/find";
        const params = /^\d+$/.test(term) ? { gtin: term } : { nome: term };

        console.log("Fazendo requisição para a API com os parâmetros:", params);

        try {
            const response = await axios.get(url, {
                headers: { 'Authorization': `Bearer ${token}` },
                params,
            });

            console.log("Resposta da API:", response.data);
            const products = response.data.data || [];

            if (products.length === 0) {
                setError("Nenhum produto encontrado.");
                console.warn("Nenhum produto encontrado para o termo:", term);
                return;
            }

            const productsWithImages = products.map(product => ({
                id: product.id,
                nome: product.nome,
                gtin: product.gtin,
                desc: product.desc,
                imagem: product.imagem || "https://img.icons8.com/?size=100&id=89619&format=png&color=3A7C22",
                editable: false // Adicionando o estado de edição
            }));

            setProductData(productsWithImages);
            setError(null);
            console.log("Produtos encontrados:", productsWithImages);
        } catch (error) {
            console.error("Erro ao buscar o produto:", error);
            setError("Erro ao buscar o produto: " + (error.response?.data.message || error.message));
        }
    };

    const toggleEdit = async (productId) => {
        const productToEdit = productData.find(product => product.id === productId);
        
        if (productToEdit.editable) {
            // Se estava editável, fazer o POST
            const data = {
                name: productToEdit.nome,
                description: productToEdit.desc,
                barcode: productToEdit.gtin,
            };

            const token = getAuthToken();
            if (!token) {
                setError("Token de autenticação não encontrado.");
                return;
            }

            try {
                await axios.post("https://savvy-api.belogic.com.br/api/products", data, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                console.log("Produto atualizado:", data);
                setError(null);
            } catch (error) {
                console.error("Erro ao atualizar produto:", error);
                setError("Erro ao atualizar produto: " + (error.response?.data.message || error.message));
            }
        }

        // Alternar estado de edição
        setProductData(prevProducts => 
            prevProducts.map(product =>
                product.id === productId ? { ...product, editable: !product.editable } : product
            )
        );
    };

    const handleChange = (productId, field, value) => {
        setProductData(prevProducts => 
            prevProducts.map(product =>
                product.id === productId ? { ...product, [field]: value } : product
            )
        );
    };

    const handleVoltar = () => {
        navigate("/areaLogada");
    };

    return (
        <div className="login-container">
            <div style={{ display: "flex", flexDirection: "column" }} className="add-main">
                <h1>SAVVY</h1>
                <p>Encontre um novo produto e adicione ele a nossa base!</p>
                <form style={{ display: "flex", flexDirection: "column" }} onSubmit={(e) => {
                    e.preventDefault();
                    fetchProductData(code);
                }}>
                    <label>Termo ou código de barras</label>
                    <input
                        style={{ height: "45px", borderRadius: "12px", paddingInline: "2%", marginTop: "15px" }}
                        type="text"
                        placeholder="Digite aqui"
                        name="nome"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                    />
                    <button style={{ width: "50%", height: "35px", backgroundColor: "green", color: "#fff", marginTop: "10px" }} type="submit">Buscar</button>
                </form>

                {error && <p className="error-message">{error}</p>}

                {productData.length > 0 && (
                    <div className="product-results">
                        <h2>Resultados:</h2>
                        {productData.map(product => (
                            <div key={product.id} className="product-item" style={{backgroundColor: "#fff", border: "solid 1px black", borderRadius: "15px", paddingInline: "10%", margin: "auto", marginBottom: "5%", padding: "3%"}}>
                                {product.editable ? (
                                    <>
                                        <input
                                            type="text"
                                            value={product.desc}
                                            onChange={(e) => handleChange(product.id, 'desc', e.target.value)}
                                        />
                                        <input
                                            type="text"
                                            value={product.gtin}
                                            onChange={(e) => handleChange(product.id, 'gtin', e.target.value)}
                                        />
                                        <input
                                            type="text"
                                            value={product.nome}
                                            onChange={(e) => handleChange(product.id, 'nome', e.target.value)}
                                        />
                                    </>
                                ) : (
                                    <>
                                        <p><strong>Nome:</strong> {product.desc}</p>
                                        <p><strong>GTIN:</strong> {product.gtin}</p>
                                        <p><strong>Descrição:</strong> {product.desc}</p>
                                    </>
                                )}
                                <button style={{backgroundColor: "green", color: "#fff", border: "none", width: "15%", height: "30px", marginTop: "3%"}} onClick={() => toggleEdit(product.id)}>
                                    {product.editable ? "Salvar" : "Editar"}
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminNovosProdutos;
