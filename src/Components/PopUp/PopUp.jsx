import React from "react";
import "./style.css";

function Popup({ code, onValidate, onClose }) {
    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <h2>Código Capturado</h2>
                <p>{code}</p>
                <div className="popup-buttons">
                    <button onClick={onValidate}>Validar</button>
                    <button onClick={onClose}>Fechar</button>
                </div>
            </div>
        </div>
    );
}

export default Popup;