import { Route, Routes } from "react-router-dom";
import TelaInicial from "./Pages/TelaInicial/TelaInicial";
import Login from "./Pages/Login/Login";
import AreaLogada from "./Pages/AreaLogada/AreaLogada";
import AddProduto from "./Pages/AddProduto/AddProduto";

const App = () => {
  return (
    <Routes>
     <Route path="/" element={<TelaInicial />}/>
     <Route path="/login" element={<Login />}/>
     <Route path="/areaLogada" element={<AreaLogada />}/>
     <Route path="/addProduto" element={<AddProduto />}/>
    </Routes>
  );
}

export default App 