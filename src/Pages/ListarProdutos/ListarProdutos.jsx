import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import "./style.css";

function ListarProdutos() {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    const handleEncontrar = () => {
        navigate("/adicionarProdutos");
    };

    const handleEditar = () => {
        navigate("/editarProdutos");
    };

    const handleListar = () => {
        navigate("/listarProdutos");
    };

    const getAuthToken = () => {
        return localStorage.getItem('authToken');
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        await fetchProducts();
    };

    const fetchProducts = async () => {
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

            // Verifique se a resposta é bem-sucedida
            if (!response.ok) {
                throw new Error(`Erro ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();

            // Acesse a propriedade 'data' para obter a lista de produtos
            if (Array.isArray(data.data)) {
                const sortedData = data.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Ajuste se necessário
                setProducts(sortedData);
            } else {
                console.error("Dados recebidos não são um array:", data);
            }
        } catch (error) {
            console.error("Erro ao buscar produtos:", error);
        }
    };

    const downloadExcel = () => {
        const csvContent = "data:text/csv;charset=utf-8," 
            + products.map(product => `${product.name},${product.description},${product.gtin}`).join("\n");
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
                <p style={{width: "80%"}}>Consulte e baixe a lista de produtos disponíveis na nossa base:</p>

                <form className="buscar-produto" onSubmit={handleSearch}>
                    <button type="submit">Listar produtos da base</button>
                </form>

                <div style={{width: "100%", display: "flex", justifyContent: "center"}}>
                    <button onClick={downloadExcel} disabled={products.length === 0} style={{width: "30%", height: "40px", borderRadius: "10px", backgroundColor: "orange", color: "black", border: "none", fontWeight: "700"}}>
                        Baixar Excel
                    </button>
                </div>

                <div>
                    {products.length > 0 ? (
                        <ul>
                           {products.map((product, index) => (
    <li key={product.id || `${product.gtin}-${index}`}>
        <strong>{product.name}</strong><br />
        {product.description}<br />
        GTIN: {product.gtin}
    </li>
))}

                        </ul>
                    ) : (
                        <p style={{width: "100%", textAlign: "center", paddingInline: "5%"}}>Nenhum produto encontrado. Clique em "Listar produtos da base" para buscar.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ListarProdutos;
