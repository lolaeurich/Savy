import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import "./style.css";

function ListarProdutos() {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    const getAuthToken = () => {
        return localStorage.getItem('authToken');
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        await fetchProducts(searchTerm);
    };
    const fetchProducts = async (search) => {
        const token = getAuthToken();
        if (!token) {
            console.error("Token de autenticação não encontrado.");
            return;
        }
    
        try {
            const response = await fetch("https://savvy-api.belogic.com.br/api/products", {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
    
            if (!response.ok) {
                throw new Error(`Erro ${response.status}: ${response.statusText}`);
            }
    
            const data = await response.json();
            console.log("Dados recebidos:", data);
    
            // Filtrar produtos com base no primeiro caractere do termo de busca
            const filteredProducts = data.data.filter(product => {
                const firstChar = search.charAt(0);
                const isNumber = !isNaN(firstChar);
    
                if (isNumber) {
                    // Se o primeiro caractere é um número, procurar no barcode
                    return product.barcode.includes(search);
                } else {
                    // Se o primeiro caractere é uma letra, procurar na description
                    return product.description.toLowerCase().includes(search.toLowerCase());
                }
            });
    
            setProducts(filteredProducts);
        } catch (error) {
            console.error("Erro ao buscar produtos:", error);
        }
    };
    

    const downloadExcel = () => {
        const csvContent = "data:text/csv;charset=utf-8," 
            + products.map(product => `${product.name},${product.description},${product.barcode}`).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "produtos.csv");
        document.body.appendChild(link); // necessário para o Firefox
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="login-container">
            <div className="add-main">
                <div className="login-savvy-logo">
                    <h1>SAVVY</h1>
                </div>
                <p style={{ width: "80%" }}>Consulte e baixe a lista de produtos disponíveis na nossa base:</p>

                <form className="buscar-produto" onSubmit={handleSearch}>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Pesquisar por barcode ou descrição"
                    />
                    <button style={{padding: "3%", width: "22%", display: "flex", alignItems: "center", justifyContent: "center"  }} type="submit">Listar produtos da base</button>
                </form>

                <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
                    <button onClick={downloadExcel} disabled={products.length === 0} style={{ width: "30%", height: "40px", borderRadius: "10px", backgroundColor: "orange", color: "black", border: "none", fontWeight: "700" }}>
                        Baixar Excel
                    </button>
                </div>

                <div>
                    {products.length > 0 ? (
                        <ul>
                           {products.map((product) => (
                                <li key={product.id}>
                                    <strong>{product.name}</strong><br />
                                    {product.description}<br />
                                    GTIN: {product.barcode}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p style={{ width: "100%", textAlign: "center", paddingInline: "5%" }}>Nenhum produto encontrado. Clique em "Listar produtos da base" para buscar.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ListarProdutos;
