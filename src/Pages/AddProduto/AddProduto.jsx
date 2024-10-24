import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import flecha from "../../Assets/flecha-esquerda.png";
import barcode from "../../Assets/barcode-icon.png";
import { BarcodeDialog } from "../../Components/BarcodeDialog";
import './style.css';

function AddProduto() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [code, setCode] = useState("");
  const [productData, setProductData] = useState([]);
  const [error, setError] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState(new Set());
  const [anotherBrand, setAnotherBrand] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const getAuthToken = () => {
    return localStorage.getItem('authToken');
  };

  const fetchProductData = async (term) => {
    if (!term) {
      setProductData([]);
      return;
    }

    const token = getAuthToken();
    if (!token) {
      setError("Token de autenticação não encontrado.");
      return;
    }

    const url = "https://savvy-api.belogic.com.br/api/shopping/find";
    const params = /^\d+$/.test(term) ? { gtin: term } : { nome: term };

    try {
      const response = await axios.get(url, {
        headers: { 'Authorization': `Bearer ${token}` },
        params,
      });

      const products = response.data.data || [];
      if (products.length === 0) {
        setError("Nenhum produto encontrado.");
        return;
      }

      const productsWithImages = products.map(product => ({
          id: product.id,
                nome: product.nome,
                gtin: product.gtin,
                desc: product.desc,
                imagem: product.imagem || "https://img.icons8.com/?size=100&id=89619&format=png&color=3A7C22",
      }));

      setProductData(productsWithImages);
      setError(null);
    } catch (error) {
      console.error("Erro ao buscar o produto:", error);
      setError("Erro ao buscar o produto: " + (error.response?.data.message || error.message));
    }
  };

  const fetchAllProducts = async () => {
    const token = getAuthToken();
    if (!token) {
      setError("Token de autenticação não encontrado.");
      return;
    }

    try {
      const response = await axios.get('https://savvy-api.belogic.com.br/api/shopping', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      console.log("Todos os produtos:", response.data.data);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error.response ? error.response.data : error);
      setError("Erro ao buscar produtos: " + (error.response?.data.message || error.message));
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
      description: product.desc,
      barcode: product.gtin,
    }));

    const token = getAuthToken();
    if (!token) {
      setError("Token de autenticação não encontrado.");
      return;
    }

    try {
      const response = await axios.post("https://savvy-api.belogic.com.br/api/shopping", data, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      console.log("Produtos adicionados ao carrinho:", response.data);
      fetchAllProducts();
      navigate('/areaLogada');
    } catch (error) {
      console.error("Erro ao adicionar produtos:", error);
      setError("Erro ao adicionar produtos: " + (error.response?.data.message || error.message));
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
            {error && <p className="error-message">{error}</p>}
            {productData.length > 0 ? (
              <div className="card-container">
                {productData.map((product) => (
                  <div 
                    key={product.id}
                    className={`card-item-encontrado ${selectedProducts.has(product.id) ? 'selected' : ''}`} 
                    onClick={() => toggleSelectProduct(product.id)}
                  >
                    <img src={product.imagem} alt={product.desc} />
                    <p>{product.desc}</p>
                    <p>{product.gtin}</p>
                    <p>{product.barcode}</p>
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
