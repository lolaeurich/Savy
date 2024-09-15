import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import flecha from "../../Assets/flecha-esquerda.png";
import camera from "../../Assets/camera.png";
import lixo from "../../Assets/lixo.png";
import barcode from "../../Assets/barcode-icon.png";
import QuantitySelector from "../../Components/SeletorQuantidade/SeletorQuantidade";
import { BarcodeDialog } from "../../Components/BarcodeDialog";
import { BarcodeScanner } from "../../Components/BarcodeDialog/BarcodeScanner";
import './style.css';

function AddProduto() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [scannerOpen, setScannerOpen] = useState(false); // Estado para controlar o BarcodeScanner
  const [searchTerm, setSearchTerm] = useState("");
  const [cep, setCep] = useState(""); 
  const [productData, setProductData] = useState(null);
  const [error, setError] = useState(null);
  const [anotherBrand, setAnotherBrand] = useState(false);
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

  const handleScannerOpen = () => {
    setScannerOpen(true); // Abre o BarcodeScanner
  };

  const handleCodeDetected = (code) => {
    setSearchTerm(code);
    setScannerOpen(false); // Fecha o BarcodeScanner
    fetchProductData(code);
  };

  const fetchCoordinatesFromCep = async (cep) => {
    try {
      const response = await axios.get(`https://cep.awesomeapi.com.br/json/${cep}`);
      console.log("Resposta da API AwesomeAPI:", response.data);
      
      const { lat, lng } = response.data;
      
      if (lat && lng) {
        console.log(`Coordenadas obtidas: Latitude ${lat}, Longitude ${lng}`);
        return {
          latitude: lat,
          longitude: lng,
        };
      } else {
        console.error("Coordenadas não encontradas na resposta.");
        return null;
      }
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
  
    const data = {
      name: productData.desc,
      barcode: searchTerm,
      description: productData.desc,
      another_brand: anotherBrand,
      categories: [1]
    };
  
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.post("https://savvy-api.belogic.com.br/api/products", data, {
        headers: {
          'Authorization': `Bearer 19|fOvn5kU8eYYn3OETTlIKrVarFrih56cW03LOVkaS93a28077`
        }
      });
      console.log('Produto salvo com sucesso:', response.data);

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
        <div className="login-savvy-logo3">
          <h1>SAVVY</h1>
        </div>
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
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </form>
              <img 
                className="barcode" 
                alt="" 
                src={barcode} 
                onClick={handleScannerOpen} // Abre o BarcodeScanner
              />
            </div>
          </div>

          <div className="container-categorias">
            <h3>Nenhum produto pesquisado</h3>
            {/* Comentários sobre categorias */}
          </div>

          <div className="procurar-outra-marca">
            <label className="custom-control custom-checkbox">
              <span style={{ width: "70%" }}>Caso este item não exista em todos os supermercados, podemos sugerir um substituto?</span>
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

      {scannerOpen && (
        <BarcodeScanner setCode={handleCodeDetected} open={scannerOpen} setOpen={setScannerOpen} />
      )}
    </div>
  );
}

export default AddProduto;
