// src/pages/AddProduto/index.js

import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import flecha from "../../Assets/flecha-esquerda.png";
import camera from "../../Assets/camera.png";
import lixo from "../../Assets/lixo.png";
import QuantitySelector from "../../Components/SeletorQuantidade/SeletorQuantidade";
import { BarcodeDialog } from "../../Components/BarcodeDialog";
import './style.css';

function AddProduto() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // Alterado de 'code' para 'searchTerm'
  const [cep, setCep] = useState(""); 
  const [productData, setProductData] = useState(null);
  const [error, setError] = useState(null);
  const [anotherBrand, setAnotherBrand] = useState(false); // Estado para 'Outra marca'
  const navigate = useNavigate();

  useEffect(() => {
    const storedCep = localStorage.getItem('userCep');
    if (storedCep) {
      setCep(storedCep);
    }

    const handleProductFound = (event) => {
      setSearchTerm(event.detail);
      fetchProductData(event.detail);
    };

    const handleProductNotFound = () => {
      setSearchTerm("");
      setProductData(null);
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
    setDialogOpen(true);
  };

  const handleCodeDetected = (code) => {
    setSearchTerm(code);
    setDialogOpen(false);
    fetchProductData(code);
  };

  const fetchCoordinatesFromCep = async (cep) => {
    try {
      const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
      const { uf, localidade } = response.data;
      return {
        latitude: -25.54692, // Coordenadas fixas para simplificação
        longitude: -49.18058,
      };
    } catch (error) {
      console.error("Erro ao obter coordenadas:", error);
      return null;
    }
  };

  const fetchProductData = async (searchTerm) => {
    if (!cep) {
      setError("CEP não fornecido.");
      return;
    }

    try {
      const coordinates = await fetchCoordinatesFromCep(cep);
      if (!coordinates) {
        setError("Não foi possível obter as coordenadas.");
        return;
      }

      const { latitude, longitude } = coordinates;
      const response = await axios.get(
        "https://menorpreco.notaparana.pr.gov.br/api/v1/produtos",
        {
          params: {
            termo: searchTerm,
            local: `${latitude},${longitude}`,
            raio: 20,
          },
        }
      );

      const product = response.data.produtos.find(p => p.gtin === searchTerm || p.desc.toLowerCase().includes(searchTerm.toLowerCase()));
      if (product) {
        setProductData(product);
        setError(null);
      } else {
        setProductData(null);
        setError("Produto não encontrado.");
      }
    } catch (error) {
      console.error("Erro ao buscar o produto:", error);
      setProductData(null);
      setError("Erro ao buscar o produto.");
    }
  };

  const handleSave = async () => {
    if (!productData) {
      setError("Nenhum produto encontrado para salvar.");
      return;
    }
  
    // Defina a categoria fixamente como 4
    const data = {
      name: productData.desc,
      barcode: searchTerm,
      description: productData.desc,
      another_brand: anotherBrand,
      categories: [1] // Categoria fixada como 4
    };
  
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.post("https://savvy-api.belogic.com.br/api/products", data, {
        headers: {
          'Authorization': `Bearer 19|fOvn5kU8eYYn3OETTlIKrVarFrih56cW03LOVkaS93a28077`
        }
      });
      console.log('Produto salvo com sucesso:', response.data);

      // Emite um evento para notificar que um novo produto foi adicionado
      window.dispatchEvent(new CustomEvent('produtoAdicionado', { detail: response.data }));

      navigate('/areaLogada');
    } catch (error) {
      console.error("Erro ao salvar o produto:", error.response ? error.response.data : error.message);
      setError(error.response ? error.response.data.message : "Erro ao salvar o produto.");
    }
  };

  return (
    <div className="add-produto-container">
      <div className="add-produto-main">
        <div className="add-produto-nav">
          <div className="cart2">
            <img alt="" src={flecha} onClick={handleVoltar} />
          </div>
          <h3>Cadastro de produto</h3>
        </div>

        <div className="cadastro-container">
          <div className="cadastro-nome">
            <div className="nome-produto">
              <form>
                <label>Termo ou Código de barras</label>
                <input
                  type="text"
                  placeholder="Digite aqui"
                  name="nome"
                  value={searchTerm} // Alterado de 'code' para 'searchTerm'
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </form>
              <button type="button" onClick={() => fetchProductData(searchTerm)}>
                  Buscar Produto
              </button>
            </div>

            {/*<div className="camera-container" onClick={handleCameraClick}>
              <img className="tilt-in-tr" alt="" src={camera} />
              <p>
                Aponte a câmera do seu celular para o código
                de barras do produto
              </p>
            </div>*/}
          </div>

          <div className="campo-cep">
            <form>
              <label>CEP</label>
              <input
                type="text"
                placeholder="Digite o CEP"
                name="cep"
                value={cep}
                onChange={(e) => setCep(e.target.value)}
              />
            </form>
          </div>

          <div className="descricao-produto">
            <form>
              <label>Descrição do produto</label>
              <input
                type="text"
                placeholder="Digite aqui"
                name="nome"
                value={productData ? productData.desc : ""}
                readOnly
              />
            </form>
          </div>

          <div className="container-categorias">
            <h3>Categoria do produto</h3>
            <label className="custom-control custom-checkbox">
              <span>Bebidas</span>
              <input
                type="checkbox"
                id="check-btn"
                className="custom-control-input"
                disabled // Desativado porque a categoria é fixada como 4
              />
              <span className="custom-control-indicator"></span>
            </label>

            <label className="custom-control custom-checkbox">
              <span>Produtos de Higiene</span>
              <input
                type="checkbox"
                id="check-btn"
                className="custom-control-input"
                disabled // Desativado porque a categoria é fixada como 4
              />
              <span className="custom-control-indicator"></span>
            </label>

            <label className="custom-control custom-checkbox">
              <span>Frutas e Verduras</span>
              <input
                type="checkbox"
                id="check-btn"
                className="custom-control-input"
                disabled // Desativado porque a categoria é fixada como 4
              />
              <span className="custom-control-indicator"></span>
            </label>
            {/* Outras categorias */}
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
                checked={anotherBrand}
                onChange={() => setAnotherBrand(prev => !prev)}
              />
              <span className="custom-control-indicator"></span>
            </label>
          </div>

          <div className="cadastrar-produtos-botoes">
            <button className="btn-salvar" onClick={handleSave}>Salvar</button>
            <button className="btn-cancelar" onClick={handleVoltar}>Cancelar</button>
            <button className="btn-lixo">
              <img alt="" src={lixo} />
            </button>
          </div>

          {error && <p className="error-message">{error}</p>}
        </div>
      </div>

      {dialogOpen && (
        <BarcodeDialog onCodeDetected={handleCodeDetected} onClose={() => setDialogOpen(false)} />
      )}
    </div>
  );
}

export default AddProduto;
