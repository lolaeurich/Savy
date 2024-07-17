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

const App = () => {
  return (
    <Routes>
     <Route path="/" element={<TelaInicial />}/>
     <Route path="/login" element={<Login />}/>
     <Route path="/areaLogada" element={<AreaLogada />}/>
     <Route path="/addProduto" element={<AddProduto />}/>
     <Route path="/comparativo" element={<Comparativo />}/>
     <Route path="/listaMercados" element={<ListaMercados />}/>
     <Route path="/compraUnica" element={<CompraUnica />}/>
     <Route path="/listaCompras" element={<ListaCompras />}/>
     <Route path="/sobreASavvy" element={<Sobre />}/>
     <Route path="/pesquisa" element={<Pesquisa />}/>
    </Routes>
  );
}

export default App 