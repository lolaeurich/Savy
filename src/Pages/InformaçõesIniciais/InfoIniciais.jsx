import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
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
                <input
                    type="text"
                    value={novoCep}
                    onChange={e => setNovoCep(e.target.value)}
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
    const [novoCep, setNovoCep] = useState('');
    const [cep, setCep] = useState('');
    const [cidade, setCidade] = useState('Lorem Ipsun');
    const [selectedOption, setSelectedOption] = useState('cadastrado'); // Define a opção inicial como 'cadastrado'
    const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controle do modal
    const [produtos, setProdutos] = useState([]);
    const [selectedProductsCount, setSelectedProductsCount] = useState(0); // Contador de produtos selecionados
    const navigate = useNavigate();

    useEffect(() => {
        const storedCep = localStorage.getItem('userCep');
        if (storedCep) {
            setCep(storedCep);
            fetchCidade(storedCep);
        }

        // Carregar produtos do localStorage
        const produtosStored = localStorage.getItem('produtos');
        if (produtosStored) {
            setProdutos(JSON.parse(produtosStored));
        }
    }, []);

    useEffect(() => {
        // Atualiza a contagem de produtos selecionados sempre que a lista de produtos mudar
        const count = produtos.filter(produto => produto.isChecked).length;
        setSelectedProductsCount(count);
    }, [produtos]);

    const fetchCidade = async (cep) => {
        try {
            const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
            setCidade(response.data.localidade || 'Cidade não encontrada');
        } catch (error) {
            console.error('Erro ao buscar a cidade:', error);
            setCidade('Cidade não encontrada');
        }
    };

    const handleEditCep = () => {
        setIsModalOpen(true);
        setNovoCep(cep);
    };

    const handleSaveCep = async () => {
        if (novoCep === cep) {
            setIsModalOpen(false);
            return;
        }

        try {
            await fetchCidade(novoCep);
            setCep(novoCep);
            localStorage.setItem('userCep', novoCep);
            setIsModalOpen(false);
        } catch (error) {
            console.error('Erro ao salvar o novo CEP:', error);
        }
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

        if (selected === 'proximo') {
            // Lógica para "Próximo a mim", se necessário
        } else if (selected === 'editar') {
            handleEditCep();
        }
    };

    return (
        <div className="tela-inicial-container">
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
                        <h1>0</h1>
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
                                    checked={selectedOption === 'cadastrado'}
                                    onChange={handleOptionChange}
                                />
                                Cadastrado ({cep})
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    value="proximo"
                                    checked={selectedOption === 'proximo'}
                                    onChange={handleOptionChange}
                                />
                                Próximo a mim
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    value="editar"
                                    checked={selectedOption === 'editar'}
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
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveCep}
                novoCep={novoCep}
                setNovoCep={setNovoCep}
            />
        </div>
    );
}

export default InfoIniciais;
