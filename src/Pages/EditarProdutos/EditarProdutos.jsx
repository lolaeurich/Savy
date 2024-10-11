import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import "./style.css";

function EditarProdutos() {
    const [productName, setProductName] = useState("");
    const [productData, setProductData] = useState(null); // Para armazenar os dados do produto
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
        if (productName.trim() === "") return;

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
            console.log(data); // Log dos dados para debug

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

    return (
        <div className="login-container">
            <div className="add-main">
                <div className="login-savvy-logo">
                    <h1>SAVVY</h1>
                </div>
                <p style={{width: "80%"}}>Busque por um produto da nossa base para editar:</p>

                <form className="buscar-produto" onSubmit={handleSearch}>
                    <label htmlFor="product-search" style={{paddingInline: "15%", textAlign: "center"}}>Insira o nome ou o GTIN do produto que deseja procurar:</label>
                    <input 
                        id="product-search"
                        type="text" 
                        value={productName} 
                        onChange={(e) => setProductName(e.target.value)} 
                        placeholder="Buscar produto..."
                    />
                    <button type="submit">Buscar</button>
                </form>

                {productData && (
                    <div className="product-details" style={{marginTop: "20px", padding: "10px", border: "1px solid #ccc", borderRadius: "8px"}}>
                        <h2>Detalhes do Produto:</h2>
                        <p><strong>Nome:</strong> {productData.nome}</p>
                        <p><strong>GTIN:</strong> {productData.gtin}</p>
                        <p><strong>Descrição:</strong> {productData.desc}</p>
                        {/* Aqui você pode adicionar inputs para edição se necessário */}
                    </div>
                )}
            </div>
        </div>
    );
}

export default EditarProdutos;
