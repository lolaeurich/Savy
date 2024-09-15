import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import flecha from "../../Assets/flecha-esquerda.png";
import camera from "../../Assets/camera.png";
import lixo from "../../Assets/lixo.png";
import barcode from "../../Assets/barcode-icon.png";
import QuantitySelector from "../../Components/SeletorQuantidade/SeletorQuantidade";
import { BarcodeScanner } from "../../Components/BarcodeDialog/BarcodeScanner" 
import './style.css';

function AddProduto() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [scannerOpen, setScannerOpen] = useState(false);
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

  const handleScannerOpen = () => {
    setScannerOpen(true);
  };

  const handleCodeDetected = (code) => {
    setSearchTerm(code);
    setScannerOpen(false);
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
      console.log("Produto salvo com sucesso:", response.data);
      alert("Produto salvo com sucesso!");
      navigate("/areaLogada");
    } catch (error) {
      console.error("Erro ao salvar o produto:", error);
      setError("Erro ao salvar o produto.");
    }
  };

  return (
    <div className="container">
      <div className="header">
        <img src={flecha} alt="Voltar" onClick={handleVoltar} />
        <h1>Adicionar Produto</h1>
      </div>
      <div className="content">
        <div className="search-section">
          <input
            type="text"
            placeholder="Termo ou código de barras"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={handleScannerOpen}>
            <img src={barcode} alt="Escanear Código de Barras" />
          </button>
          <button onClick={() => fetchProductData(searchTerm)}>
            Buscar Produto
          </button>
        </div>
        {productData && (
          <div className="product-info">
            <h2>{productData.desc}</h2>
            <p>Preço: {productData.preco}</p>
            <p>Marca: {productData.marca}</p>
            {/* Adicione outros detalhes do produto conforme necessário */}
          </div>
        )}
        <div className="additional-info">
          <label>
            Outra marca
            <input
              type="checkbox"
              checked={anotherBrand}
              onChange={(e) => setAnotherBrand(e.target.checked)}
            />
          </label>
        </div>
        <button onClick={handleSave}>Salvar Produto</button>
        {error && <div className="error-message">{error}</div>}
      </div>
      <BarcodeScanner setCode={handleCodeDetected} open={scannerOpen} setOpen={setScannerOpen} />
    </div>
  );
}

export default AddProduto;
