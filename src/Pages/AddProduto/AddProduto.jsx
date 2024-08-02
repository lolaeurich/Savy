import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import "./style.css";
import flecha from "../../Assets/flecha-esquerda.png";
import camera from "../../Assets/camera.png";
import lixo from "../../Assets/lixo.png";
import QuantitySelector from "../../Components/SeletorQuantidade/SeletorQuantidade";
import { BarcodeDialog } from "../../Components/BarcodeDialog";
import Popup from "../../Components/PopUp/PopUp";

function AddProduto() {
    const [dialogOpen, setDialogOpen] = useState(false); // Estado para controlar o diálogo
    const [code, setCode] = useState(""); // Estado para armazenar o código de barras
    const [popupOpen, setPopupOpen] = useState(false); // Estado para controlar o popup
    const navigate = useNavigate();

    useEffect(() => {
        const handleProductFound = (event) => {
            setCode(event.detail); // Atualiza o campo de texto com a descrição do produto
            setPopupOpen(true); // Abre o popup quando o código é encontrado
        };

        const handleProductNotFound = () => {
            setCode(""); // Limpa o campo se o produto não for encontrado
        };

        window.addEventListener('productFound', handleProductFound);
        window.addEventListener('productNotFound', handleProductNotFound);

        return () => {
            window.removeEventListener('productFound', handleProductFound);
            window.removeEventListener('productNotFound', handleProductNotFound);
        };
    }, []);

    const handleVoltar = () => {
        navigate("/areaLogada");
    };

    const handleCameraClick = () => {
        setDialogOpen(true); // Abre o diálogo quando a imagem da câmera é clicada
    };

    const handleCodeDetected = (code) => {
        setCode(code);
        setDialogOpen(false); // Fecha o diálogo quando um código é detectado
        setPopupOpen(true); // Abre o popup com o código detectado
    };

    const handleValidate = () => {
        // Lógica para validar o código, se necessário
        setPopupOpen(false); // Fecha o popup
    };

    return (
        <div className="add-produto-container">
            <div className="add-produto-main">
                <div className="cadastro-container">
                    <div className="cadastro-nome">
                        <div
                            className="camera-container"
                            onClick={handleCameraClick} // Abre o diálogo ao clicar
                        >
                            <img className="tilt-in-tr" alt="" src={camera} />
                            <p>
                                Clique no ícone acima e aponte a câmera do seu celular para o código
                                de barras do produto
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Adicione o BarcodeDialog aqui */}
            <BarcodeDialog
                open={dialogOpen}
                setOpen={setDialogOpen}
                setCode={handleCodeDetected}
            />

            {/* Popup com o código capturado */}
            {popupOpen && (
                <Popup
                    code={code}
                    onValidate={handleValidate}
                    onClose={() => setPopupOpen(false)}
                />
            )}
        </div>
    );
}

export default AddProduto;
