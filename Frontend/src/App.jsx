import { BrowserRouter as Router, Route, Routes } from "react-router-dom";


import LoginPage from "./pages/Login/LoginPage";
import Home_Espe from "./Especialista/home_espe";
import Home_Paciente from "./Paciente/home_paciente";
import Registrar from "./Especialista/Registrar"
import EstablecerContra from "./pages/Login/EstablecerContra";


function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<LoginPage />} />
        <Route exact path="/home_espe" element={<Home_Espe />} />
        <Route exact path="/home_paciente" element={<Home_Paciente />} />
        <Route exact path="/registrar" element={<Registrar />} />
        <Route exact path="/establecer-contra" element={<EstablecerContra />} />
        
      </Routes>
    </Router>
  );
}

export default App
