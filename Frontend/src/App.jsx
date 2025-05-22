import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import LoginPage from "./pages/Login/LoginPage";
import Home_Espe from "./Especialista/home_espe";
import Home_Paciente from "./Paciente/home_paciente";
import Registrar from "./Especialista/Registrar";
import EstablecerContra from "./pages/Login/EstablecerContra";
import ProtectedRoute from "./ProtectedRoute";
import ConsentimientoInformado from "./Paciente/Consetimiento";
import ConsentimientoProfesional from "./Especialista/ConsentimientoEspecialista";


function App() {
  useEffect(() => {
    let timeout;
    const INACTIVITY_LIMIT = 120 * 60 * 1000; // 60 minutos

    const resetTimer = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        localStorage.removeItem("user");
        window.location.href = "/"; 
      }, INACTIVITY_LIMIT);
    };

    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);
    window.addEventListener("click", resetTimer);

    resetTimer();

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      window.removeEventListener("click", resetTimer);
    };
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/establecer-contra" element={<EstablecerContra />} />
        {/* Solo especialistas (privilegio 0) */}
        <Route element={<ProtectedRoute allowedPrivileges={[0]} />}>
          <Route path="/home_espe" element={<Home_Espe />} />
          <Route path="/registrar" element={<Registrar />} />
          <Route path="/consentimiento-especialista" element={<ConsentimientoProfesional />} />
        </Route>
        {/* Solo pacientes (privilegio 1) */}
        <Route element={<ProtectedRoute allowedPrivileges={[1]} />}>
          <Route path="/home_paciente" element={<Home_Paciente />} />
          <Route path="/consentimiento-informado" element={<ConsentimientoInformado />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
