import { Route, Routes } from "react-router-dom";
import TelaInicial from "./Pages/TelaInicial/TelaInicial";
import Login from "./Pages/Login/Login";

const App = () => {
  return (
    <Routes>
     <Route path="/" element={<TelaInicial />}/>
     <Route path="/login" element={<Login />}/>
    </Routes>
  );
}

export default App 