import React, { useState, useEffect } from "react";
import IMaskInput from 'react-input-mask';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./style.css";
import here from "../../Assets/here.png";
import logo from "../../Assets/logo1.png";
import lista1 from "../../Assets/lista1.png";

// Componente Modal
const Modal = ({ isOpen, onClose, onSave, novoCep, setNovoCep }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>Editar CEP:</h3>
                <IMaskInput
                    mask="99999-999"
                    value={novoCep}
                    onChange={(e) => setNovoCep(e.target.value)}
                    placeholder="Digite o novo CEP"
                />
                <div className="modal-buttons">
                    <button onClick={onSave}>Salvar</button>
                    <button onClick={onClose}>Cancelar</button>
                </div>
            </div>
        </div>
    );
};

function InfoIniciais() {
    const [isEditing, setIsEditing] = useState(false);
    const [novoCep, setNovoCep] = useState("");
    const [cep, setCep] = useState("");
    const [cidade, setCidade] = useState("");
    const [valorEconomizado, setValorEconomizado] = useState(0);
    const [selectedOption, setSelectedOption] = useState("cadastrado");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [produtos, setProdutos] = useState([]);
    const [selectedProductsCount, setSelectedProductsCount] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        fetchUserData();

        const produtosStored = localStorage.getItem("produtos");
        if (produtosStored) {
            const produtosParsed = JSON.parse(produtosStored);
            setProdutos(produtosParsed);
        }
    }, []);

    useEffect(() => {
        const count = produtos.filter((produto) => produto).length;
        setSelectedProductsCount(count);
    }, [produtos]);

    const fetchUserData = async () => {
        const token = localStorage.getItem("authToken");
        if (!token) {
            console.error("Token não encontrado. Verifique se o usuário está logado.");
            return;
        }

        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/user`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const { cep, valor_economizado } = response.data;
            setCep(cep);
            setNovoCep(cep);
            setValorEconomizado(valor_economizado);
        } catch (error) {
            console.error("Erro ao buscar dados do usuário:", error);
        }
    };

    const fetchCidade = async (cep) => {
        try {
            const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
            setCidade(response.data.localidade || "Cidade não encontrada");
        } catch (error) {
            console.error("Erro ao buscar a cidade:", error);
            setCidade("Cidade não encontrada");
        }
    };

    const handleEditCep = () => {
        setIsModalOpen(true);
        setNovoCep(cep);
    };

    const handleSaveCep = async () => {
        const token = localStorage.getItem("authToken");
        if (!token) {
            console.error("Token não encontrado.");
            return;
        }

        try {
            await axios.post(
                `${process.env.REACT_APP_API_URL}/user/update-cep`,
                { cep: novoCep },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setCep(novoCep);
            localStorage.setItem("userCep", novoCep);
            setIsModalOpen(false);
            fetchCidade(novoCep);
        } catch (error) {
            console.error("Erro ao salvar o novo CEP:", error);
        }
    };

    const handleProximoCep = async () => {
        if (!navigator.geolocation) {
            console.error("Geolocalização não é suportada pelo navegador.");
            return;
        }

        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;

            try {
                const response = await axios.get(
                    `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
                );

                const address = response.data.address;

                if (address && address.postcode) {
                    const fetchedCep = address.postcode;

                    const token = localStorage.getItem("authToken");
                    if (!token) {
                        console.error("Token não encontrado.");
                        return;
                    }

                    await axios.post(
                        `${process.env.REACT_APP_API_URL}/user/update-cep`,
                        { cep: fetchedCep },
                        { headers: { Authorization: `Bearer ${token}` } }
                    );

                    setCep(fetchedCep);
                    setNovoCep(fetchedCep);
                    localStorage.setItem("userCep", fetchedCep);
                    fetchCidade(fetchedCep);
                } else {
                    console.error("CEP não encontrado na resposta do Nominatim.");
                }
            } catch (error) {
                console.error("Erro ao buscar endereço no Nominatim:", error);
            }
        }, (error) => {
            console.error("Erro ao obter a localização do usuário:", error);
        });
    };

    const handleCancelEdit = () => {
        setIsModalOpen(false);
        setNovoCep(cep);
    };

    const handleValidacao = () => {
        navigate("/areaLogada");
    };

    const handleOptionChange = (event) => {
        const selected = event.target.value;
        setSelectedOption(selected);

        if (selected === "editar") {
            handleEditCep();
        } else if (selected === "proximo") {
            handleProximoCep();
        }
    };

    return (
        <div className="tela-inicial-container" style={{height: "110vh"}}>
            <div className="tela-inicial-main">
                <div className="savvy-logo">
                    <img alt="" src={logo} />
                </div>
                <div className="savvy-text">
                    <h3 className="conheca-missao">Sua melhor maneira de comprar</h3>
                </div>

                <div className="primeira-sessao">
                    <div className="content">
                        <h3 className="voce-so-precisa">Você é SAVVY</h3>
                        <p className="voce-so-precisa-p">Total dos valores economizados</p>
                    </div>
                    <div className="reais-economizados1">
                        <h1>R$ {valorEconomizado.toFixed(2)}</h1>
                        <p>Reais economizados</p>
                    </div>
                </div>

                <div className="container-precisa2">
                    <div className="cadastro-cep">
                        <img alt="" src={here} />
                        <p>CEP</p>
                    </div>
                    <div className="areaLogada-dados">
                        <div className="cep-options">
                            <label>
                                <input
                                    type="radio"
                                    value="cadastrado"
                                    checked={selectedOption === "cadastrado"}
                                    onChange={handleOptionChange}
                                />
                                Cadastrado ({cep})
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    value="proximo"
                                    checked={selectedOption === "proximo"}
                                    onChange={handleOptionChange}
                                />
                                Próximo a mim
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    value="editar"
                                    checked={selectedOption === "editar"}
                                    onChange={handleOptionChange}
                                />
                                Editar
                            </label>
                        </div>
                    </div>
                </div>

                <div className="container-entregamos">
                    <div className="cadastro-cep2">
                        <img alt="" src={lista1} onClick={handleValidacao} />
                        <p>Lista de compras</p>
                    </div>

                    <div className="prod-cadastrados">
                        <h1>{selectedProductsCount}</h1>
                        <p>Produtos selecionados</p>
                    </div>
                </div>
            </div>

            <button
                className="slide-button"
                onClick={handleValidacao}
            >Escolher quantidade e produtos</button>

            <Modal
                isOpen={isModalOpen}
                onClose={handleCancelEdit}
                onSave={handleSaveCep}
                novoCep={novoCep}
                setNovoCep={setNovoCep}
            />
        </div>
    );
}

export default InfoIniciais;
