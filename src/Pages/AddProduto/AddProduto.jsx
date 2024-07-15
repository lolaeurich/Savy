import React, { useState } from "react";
import "./style.css";
import flecha from "../../Assets/flecha-esquerda.png";
import camera from "../../Assets/camera.png";
import lixo from "../../Assets/lixo.png";
import QuantitySelector from "../../Components/Seletor/SeletorQuantidade";
import QRCodeScannerComponent from "../../Components/BarcodeScanner/BarcodeScanner";

function AddProduto() {
    const [exibirScanner, setExibirScanner] = useState(false);
    const [scannedCode, setScannedCode] = useState("");

    const abrirCamera = () => {
        setExibirScanner(true);
    };

    const handleQRCodeScanned = (code) => {
        setScannedCode(code);
        // Aqui você pode lidar com o código escaneado, por exemplo, atualizando o estado do seu componente
        setExibirScanner(false); // Fechar o scanner após escanear
    };

    return (
        <div className="add-produto-container">
            <div className="add-produto-main">
                <div className="add-produto-nav">
                    <div className="cart2">
                        <img alt="" src={flecha} />
                    </div>
                    <h3>Cadastro de produto</h3>
                </div>

                <div className="cadastro-container">
                    <div className="cadastro-nome">
                        <div className="nome-produto">
                            <form>
                                <label>Nome ou código de barras</label>
                                <input
                                    type="text"
                                    placeholder="Digite aqui"
                                    name="nome"
                                />
                            </form>
                        </div>

                        <div
                            className="camera-container"
                            onClick={abrirCamera}
                        >
                            <img alt="" src={camera} />
                            <p>
                                Aponte a câmera do seu celular para o código
                                de barras do produto
                            </p>
                        </div>
                    </div>

                    <div className="descricao-produto">
                        <form>
                            <label>Descrição do produto</label>
                            <input
                                type="text"
                                placeholder="Digite aqui"
                                name="nome"
                            />
                        </form>
                    </div>

                    <div className="container-categorias">
                        <h3>Categoria do produto</h3>
                        <label className="custom-control custom-checkbox">
                            <span>Lorem Ipsum</span>
                            <input
                                type="checkbox"
                                id="check-btn"
                                className="custom-control-input"
                            />
                            <span className="custom-control-indicator"></span>
                        </label>
                        <label className="custom-control custom-checkbox">
                            <span>Lorem Ipsum</span>
                            <input
                                type="checkbox"
                                id="check-btn"
                                className="custom-control-input"
                            />
                            <span className="custom-control-indicator"></span>
                        </label>
                        <label className="custom-control custom-checkbox">
                            <span>Lorem Ipsum</span>
                            <input
                                type="checkbox"
                                id="check-btn"
                                className="custom-control-input"
                            />
                            <span className="custom-control-indicator"></span>
                        </label>
                        <label className="custom-control custom-checkbox">
                            <span>Lorem Ipsum</span>
                            <input
                                type="checkbox"
                                id="check-btn"
                                className="custom-control-input"
                            />
                            <span className="custom-control-indicator"></span>
                        </label>
                    </div>

                    <div className="container-quantidade">
                        <h3>Quantidade:</h3>
                        <QuantitySelector />
                    </div>

                    <div className="procurar-outra-marca">
                        <label className="custom-control custom-checkbox">
                            <span>Podemos procurar outra marca</span>
                            <input
                                type="checkbox"
                                id="check-btn"
                                className="custom-control-input"
                            />
                            <span className="custom-control-indicator"></span>
                        </label>
                    </div>

                    <div className="cadastrar-produtos-botoes">
                        <button className="btn-salvar">Salvar</button>
                        <button className="btn-cancelar">Cancelar</button>
                        <button className="btn-lixo">
                            <img alt="" src={lixo} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Renderizar o scanner de QR code se exibirScanner for true */}
            {exibirScanner && (
                <QRCodeScannerComponent onQRCodeScanned={handleQRCodeScanned} />
            )}

            {/* Mostrar o código escaneado, se houver */}
            {scannedCode && (
                <div className="scanned-code-container">
                    <p>Código QR escaneado: {scannedCode}</p>
                </div>
            )}
        </div>
    );
}

export default AddProduto;
