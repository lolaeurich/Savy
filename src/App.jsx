import { Route, Routes } from "react-router-dom";
import TelaInicial from "./Pages/TelaInicial/TelaInicial";

const App = () => {
  return (
    <Routes>
     <Route path="/" element={<TelaInicial />}/>
    </Routes>
  );
}

export default App 