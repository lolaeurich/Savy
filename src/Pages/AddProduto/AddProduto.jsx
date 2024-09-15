import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import "./style.css";
import flecha from "../../Assets/flecha-esquerda.png";
import camera from "../../Assets/camera.png";
import lixo from "../../Assets/lixo.png";
import QuantitySelector from "../../Components/SeletorQuantidade/SeletorQuantidade";
import { BarcodeDialog } from "../../Components/BarcodeDialog";

function AddProduto() {
  const [dialogOpen, setDialogOpen] = useState(false); // Estado para controlar o diálogo
  const [code, setCode] = useState(""); // Estado para armazenar o código de barras
  const navigate = useNavigate();

  useEffect(() => {
    const handleProductFound = (event) => {
      setCode(event.detail); // Atualiza o campo de texto com a descrição do produto
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
  };

  return (
    <div className="add-produto-container">
      <div className="add-produto-main">
        {/*<div className="add-produto-nav">
          <div className="cart2">
            <img alt="" src={flecha} onClick={handleVoltar} />
          </div>
          <h3>Cadastro de produto</h3>
        </div>*/}

        <div className="cadastro-container">
          <div className="cadastro-nome">
            {/*<div className="nome-produto">
              <form>
                <label>Nome ou código de barras</label>
                <input
                  type="text"
                  placeholder="Digite aqui"
                  name="nome"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
              </form>
            </div>*/}

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

         {/*} <div className="descricao-produto">
            <form>
              <label>Descrição do produto</label>
              <input
                type="text"
                placeholder="Digite aqui"
                name="nome"
                value={code}
                readOnly
              />
            </form>
          </div>*/}

          {/*<div className="container-categorias">
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
          </div>*/}
        </div>
      </div>

      {/* Adicione o BarcodeDialog aqui */}
      <BarcodeDialog
        open={dialogOpen}
        setOpen={setDialogOpen}
        setCode={handleCodeDetected}
      />
    </div>
  );
}

export default AddProduto;