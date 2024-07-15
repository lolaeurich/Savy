import { Route, Routes } from "react-router-dom";
import TelaInicial from "./Pages/TelaInicial/TelaInicial";
import Login from "./Pages/Login/Login";
import AreaLogada from "./Pages/AreaLogada/AreaLogada";

const App = () => {
  return (
    <Routes>
     <Route path="/" element={<TelaInicial />}/>
     <Route path="/login" element={<Login />}/>
     <Route path="/areaLogada" element={<AreaLogada />}/>
    </Routes>
  );
}

export default App 