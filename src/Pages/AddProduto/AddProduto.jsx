import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import flecha from "../../Assets/flecha-esquerda.png";
import camera from "../../Assets/camera.png";
import lixo from "../../Assets/lixo.png";
import barcode from "../../Assets/barcode-icon.png";
import { BarcodeDialog } from "../../Components/BarcodeDialog";
import './style.css';

function AddProduto() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [code, setCode] = useState("");
  const [cep, setCep] = useState(""); 
  const [productData, setProductData] = useState([]);
  const [error, setError] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState(new Set());
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [anotherBrand, setAnotherBrand] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedCep = localStorage.getItem('userCep');
    if (storedCep) {
      setCep(storedCep);
    }

    const handleProductFound = (event) => {
      setCode(event.detail);
      fetchProductData(event.detail);
    };

    const handleProductNotFound = () => {
      setCode("");
      setProductData([]);
    };

    window.addEventListener('productFound', handleProductFound);
    window.addEventListener('productNotFound', handleProductNotFound);

    fetchAllProducts();

    return () => {
      window.removeEventListener('productFound', handleProductFound);
      window.removeEventListener('productNotFound', handleProductNotFound);
    };
  }, []);

  const fetchCoordinatesFromCep = async (cep) => {
    try {
      const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
      return {
        latitude: -25.54692,
        longitude: -49.18058,
      };
    } catch (error) {
      console.error("Erro ao obter coordenadas:", error);
      return null;
    }
  };

  const fetchProductData = async (term) => {
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
      const params = {
        local: `${latitude},${longitude}`,
        raio: 20,
      };

      if (term.length === 13 || term.length === 8) {
        params.gtin = term; 
      } else {
        params.termo = term; 
      }

      const response = await axios.get(
        "https://menorpreco.notaparana.pr.gov.br/api/v1/produtos",
        { params }
      );

      setProductData(response.data.produtos);
      setError(null);
    } catch (error) {
      console.error("Erro ao buscar o produto:", error);
      setProductData([]);
      setError("Erro ao buscar o produto.");
    }
  };

  const fetchAllProducts = async () => {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      console.error('Token de autenticação não encontrado.');
      return;
    }

    try {
      const response = await axios.get('https://savvy-api.belogic.com.br/api/products', {
        headers: {
          'Authorization': `Bearer 19|fOvn5kU8eYYn3OETTlIKrVarFrih56cW03LOVkaS93a28077`
        }
      });
      console.log("Todos os produtos:", response.data.data);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    }
  };

  const handleSave = async () => {
    if (!productData.length) {
      setError("Nenhum produto encontrado para salvar.");
      return;
    }

    const selectedProductData = productData.filter(product => selectedProducts.has(product.id));

    if (selectedProductData.length === 0) {
      setError("Nenhum produto selecionado para salvar.");
      return;
    }

    const data = selectedProductData.map(product => ({
      name: product.desc,
      barcode: code,
      description: product.desc,
      another_brand: anotherBrand,
      categories: selectedCategory.length > 0 ? selectedCategory : [1]
    }));

    try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        setError("Token de autenticação ausente.");
        return;
      }

      await Promise.all(data.map(item =>
        axios.post("https://savvy-api.belogic.com.br/api/products", item, {
          headers: {
            'Authorization': `Bearer 19|fOvn5kU8eYYn3OETTlIKrVarFrih56cW03LOVkaS93a28077`
          }
        })
      ));

      console.log("Produtos salvos com sucesso:", data);
      fetchAllProducts();
      navigate('/areaLogada');
    } catch (error) {
      console.error("Erro ao salvar o produto:", error);
      setError(error.response ? error.response.data.message : "Erro ao salvar o produto.");
    }
  };

  const handleVoltar = () => {
    navigate("/areaLogada");
  };

  const toggleSelectProduct = (productId) => {
    const newSelectedProducts = new Set(selectedProducts);
    if (newSelectedProducts.has(productId)) {
      newSelectedProducts.delete(productId);
    } else {
      newSelectedProducts.add(productId);
    }
    setSelectedProducts(newSelectedProducts);
  };

  return (
    <div className="add-produto-container">
      <div className="add-produto-main">
        <div className="login-savvy-logo2" style={{ justifyContent: "flex-end" }}>
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
                <label>Termo ou código de barras</label>
                <input
                  type="text"
                  placeholder="Digite aqui"
                  name="nome"
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value);
                    fetchProductData(e.target.value);
                  }}
                />
              </form>
              <img className="barcode" alt="" src={barcode} onClick={() => setDialogOpen(true)} />
            </div>
          </div>

          <div className="container-categorias" style={{ overflowY: "auto", maxHeight: "300px" }}>
            {productData.length > 0 ? (
              <div className="card-container">
                {productData.map((product) => (
                  <div 
                    key={product.id}
                    className={`card-item-encontrado ${selectedProducts.has(product.id) ? 'selected' : ''}`} 
                    onClick={() => toggleSelectProduct(product.id)}
                  >
                    <img src="https://via.placeholder.com/150" alt="Produto" />
                    <p>{product.desc}</p>
                    <button 
                      className={`btn-add ${selectedProducts.has(product.id) ? 'selected-btn' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSelectProduct(product.id);
                      }}
                    >
                      {selectedProducts.has(product.id) ? 'Desfazer' : 'Selecionar'}
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p>Nenhum produto pesquisado.</p>
            )}
          </div>

          <div className="procurar-outra-marca">
            <label className="custom-control custom-checkbox">
              <span style={{ width: "70%" }}>
                Caso não haja este item em todos os supermercados, podemos sugerir um substituto?
              </span>
              <input
                type="checkbox"
                id="check-btn"
                className="custom-control-input"
                checked={anotherBrand}
                onChange={() => setAnotherBrand(!anotherBrand)}
              />
              <span className="custom-control-indicator"></span>
            </label>
          </div>

          <div className="cadastrar-produtos-botoes">
            <button className="btn-salvar" onClick={handleSave}>Salvar</button>
            <button className="btn-cancelar" onClick={handleVoltar}>Cancelar</button>
          </div>
        </div>
      </div>

      <BarcodeDialog
        open={dialogOpen}
        setOpen={setDialogOpen}
        setCode={(code) => {
          setCode(code);
          setDialogOpen(false);
          fetchProductData(code);
        }}
      />
    </div>
  );
}

export default AddProduto;
