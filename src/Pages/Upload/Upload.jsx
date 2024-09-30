import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import "./style.css";

function Upload() {
    const navigate = useNavigate();
    const [textInput, setTextInput] = useState("");
    const [imageInput, setImageInput] = useState(null);
    const [showPopup, setShowPopup] = useState(false);

    const handleTextChange = (e) => {
        setTextInput(e.target.value);
    };

    const handleImageChange = (e) => {
        setImageInput(e.target.files[0]);
    };

    const handleSubmit = async () => {
        if (!textInput || !imageInput) {
            alert("Por favor, preencha o GTIN e escolha uma imagem.");
            return;
        }

        const formData = new FormData();
        formData.append('_method', 'PUT');
        formData.append('gtin', textInput);
        formData.append('image', imageInput);

        try {
            const response = await fetch('https://savvy-api.belogic.com.br/api/product-image', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer 19|fOvn5kU8eYYn3OETTlIKrVarFrih56cW03LOVkaS93a28077`,
                },
                body: formData,
            });

            if (response.ok) {
                const result = await response.json();
                console.log("Sucesso:", result);
                setShowPopup(true);
                // Limpa os campos
                setTextInput("");
                setImageInput(null);
            } else {
                const error = await response.json();
                console.error("Erro:", error);
                alert("Erro ao subir a imagem.");
            }
        } catch (error) {
            console.error("Erro de rede:", error);
            alert("Erro de rede.");
        }
    };

    const closePopup = () => {
        setShowPopup(false);
    };

    return (
        <div className="upload" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <h2>Digite o GTIN e escolha a imagem associada a ele:</h2>
            <input
                type="text"
                value={textInput}
                onChange={handleTextChange}
                placeholder="GTIN"
            />
            <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
            />
            <button
                className="slide-button"
                onClick={handleSubmit}
            >
                Subir Imagens
            </button>

            {showPopup && (
                <div className="popup3">
                    <div className="popup-content2">
                        <p>Imagem enviada com sucesso!</p>
                        <button onClick={closePopup}>Fechar</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Upload;
