import React from "react";
import { Route, Routes } from "react-router-dom";
import TelaInicial from "./Pages/TelaInicial/TelaInicial";
import Login from "./Pages/Login/Login";
import AreaLogada from "./Pages/AreaLogada/AreaLogada";
import AddProduto from "./Pages/AddProduto/AddProduto";
import Comparativo from "./Pages/Comparativo/Comparativo";
import ListaMercados from "./Pages/ListaMercados/ListaMercados";
import CompraUnica from "./Pages/CompraUnica/CompraUnica";
import ListaCompras from "./Pages/ListaCompras/ListaCompras";
import Sobre from "./Pages/Sobre/Sobre";
import Pesquisa from "./Pages/Pesquisa/Pesquisa";
import Validacao from "./Pages/Validacao/Validacao";
import Recuperar from "./Pages/Recuperar/Recuperar";
import InfoIniciais from "./Pages/InformaçõesIniciais/InfoIniciais";
import { CartProvider } from "./Context/CartContext";
import Upload from "./Pages/Upload/Upload";
import { ComparativoProvider } from "../src/Context/ComparativoContext";
import Admin from "./Pages/Admin/Admin";
import AdminHome from "./Pages/Admin_home/AdminHome";
import AlterarProdutos from "./Pages/AlterarProdutos/AlterarProdutos";
import AdminNovosProdutos from "./Pages/AdminNovosProdutos/AdminNovosProdutos";
import EditarProdutos from "./Pages/EditarProdutos/EditarProdutos";
import ListarProdutos from "./Pages/ListarProdutos/ListarProdutos";

const App = () => {
  return (
    <ComparativoProvider>
      <Routes>
        <Route path="/" element={<TelaInicial />} />
        <Route path="/login" element={<Login />} />
        <Route path="/infoIniciais" element={<InfoIniciais />} />
        <Route path="/areaLogada" element={<AreaLogada />} />
        <Route path="/addProduto" element={<AddProduto />} />
        <Route path="/comparativo" element={<Comparativo />} />
        <Route path="/listaMercados" element={<ListaMercados />} />
        <Route path="/compraUnica" element={<CompraUnica />} />
        <Route path="/listaCompras" element={<ListaCompras />} />
        <Route path="/sobreASavvy" element={<Sobre />} />
        <Route path="/pesquisa" element={<Pesquisa />} />
        <Route path="/validacao" element={<Validacao />} />
        <Route path="/recuperar" element={<Recuperar />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/adminHome" element={<AdminHome />} />
        <Route path="/alterarProdutos" element={<AlterarProdutos />} />
        <Route path="/adicionarProdutos" element={<AdminNovosProdutos />} />
        <Route path="/editarProdutos" element={<EditarProdutos />} />
        <Route path="/listarProdutos" element={<ListarProdutos />} />
      </Routes>
    </ComparativoProvider>
  );
}

export default App;
