import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import "./style.css";

function Upload() {
    const navigate = useNavigate();
    const [imageInput, setImageInput] = useState([]);
    const [showPopup, setShowPopup] = useState(false);

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
        const token = localStorage.getItem('authToken'); // Recupera o token do localStorage
    
        for (let i = 0; i < imageInput.length; i += batchSize) {
            const formData = new FormData();
            formData.append('_method', 'PUT'); // Método que deve ser usado
            const currentBatch = imageInput.slice(i, i + batchSize);
            currentBatch.forEach((image) => {
                formData.append('images[]', image);
            });
    
            try {
                const response = await fetch('https://savvy-api.belogic.com.br/api/product-image', {
                    method: 'POST', // Mantenha como POST se a rota estiver configurada para isso
                    headers: {
                        'Authorization': `Bearer ${token}`, // Usando o token do localStorage
                    },
                    body: formData,
                });
    
                const responseText = await response.text();
                if (response.ok) {
                    const result = JSON.parse(responseText);
                    console.log("Sucesso:", result);
                } else {
                    console.error("Erro:", responseText);
                    alert(`Erro ao subir as imagens: o produto ainda não existe em nossa base. Adicione o produto e tente novamente!`);
                }
            } catch (error) {
                console.error("Erro de rede:", error);
                alert("Erro de rede. Verifique sua conexão ou tente novamente.");
            }
        }
    
        setShowPopup(true);
        setImageInput([]); // Limpa os campos após o upload
    };
    

    const closePopup = () => {
        setShowPopup(false);
    };

    const removeImage = (index) => {
        setImageInput(prevImages => prevImages.filter((_, i) => i !== index));
    };

    return (
        <div className="upload" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div className="div-nova">
            <h2>Escolha as imagens que deseja subir:</h2>
            <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
            />
    
            <button
                className="slide-button"
                onClick={handleSubmit}
            >
                Subir Imagens
            </button>

            <h3>Imagens carregadas:</h3>
            <ul style={{ height: "30%" }}>
                {imageInput.map((image, index) => (
                    <li key={index}>
                        {image.name} 
                        <button onClick={() => removeImage(index)}>Remover</button>
                    </li>
                ))}
            </ul>

            {showPopup && (
                <div className="popup3">
                    <div className="popup-content2">
                        <p>Imagens enviadas com sucesso!</p>
                        <button onClick={closePopup}>Fechar</button>
                    </div>
                </div>
            )}
        </div>
        </div>
    );
}

export default Upload;
