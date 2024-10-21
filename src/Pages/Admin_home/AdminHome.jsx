import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import "./style.css";

function AdminHome() {
    const navigate = useNavigate();
    const [produtos, setProdutos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isPopupOpen, setPopupOpen] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [imageInput, setImageInput] = useState([]);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);

    const handleAddProduto = () => {
        navigate("/upload");
    };

    const handleProduto = () => {
        navigate("/alterarProdutos");
    };

    const handleOpenPopup = (productId) => {
        setSelectedProductId(productId);
        setPopupOpen(true);
    };

    const getAuthToken = () => {
        return localStorage.getItem('authToken');
    };

    useEffect(() => {
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

        fetchProdutos();
    }, [navigate]);

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

        const batchSize = 10; // Tamanho do lote
        const token = localStorage.getItem('authToken');

        for (let i = 0; i < imageInput.length; i += batchSize) {
            const formData = new FormData();
            formData.append('_method', 'PUT'); // Método que deve ser usado
            const currentBatch = imageInput.slice(i, i + batchSize);
            currentBatch.forEach((image) => {
                formData.append('images[]', image);
            });

            try {
                const response = await fetch(`https://savvy-api.belogic.com.br/api/product-image`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error("Erro ao enviar imagens.");
                }
            } catch (error) {
                console.error("Erro:", error);
                alert("Erro ao subir as imagens.");
            }
        }

        setShowSuccessPopup(true);
        setImageInput([]);
        setPopupOpen(false); // Fecha o popup após o envio
    };

    const closePopup = () => {
        setPopupOpen(false);
    };

    const removeImage = (index) => {
        setImageInput(prevImages => prevImages.filter((_, i) => i !== index));
    };

    return (
        <div className="login-container">
            <div className="login-savvy-logo">
                <h1>SAVVY</h1>
            </div>
            <div className="botoes-home">
                <button onClick={handleAddProduto}>Adicionar imagens de produtos</button>
                <button onClick={handleProduto}>Alterar/incluir produtos</button>
            </div>
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
                                        <button onClick={() => handleOpenPopup(produto.id)}>Adicionar imagem</button>
                                        <button onClick={() => navigate(`/alterar-produto/${produto.id}`)}>Alterar produto</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Popup para Adicionar Imagem */}
            {isPopupOpen && (
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

                        <button onClick={closePopup}>Fechar</button>
                    </div>
                </div>
            )}

            {/* Popup de Sucesso */}
            {showSuccessPopup && (
                <div className="popup">
                    <div className="popup-content">
                        <p>Imagens enviadas com sucesso!</p>
                        <button onClick={() => setShowSuccessPopup(false)}>Fechar</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminHome;
