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
import Pacientes from './Especialista/Pacientes';
import ListaTestsPaciente from './Evaluacion/ListaTestsPaciente';
import ResumenADIR from './Evaluacion/ResumenADIR';
import DesactivarCuenta from './Paciente/DesactivarCuenta';
import HomeAdmin from "./Admin/HomeAdmin";
import CrudUsuarios from "./Admin/CrudUsuarios";
import CrudPacientes from "./Admin/CrudPacientes";
import CrudEspecialistas from "./Admin/CrudEspecialistas";
import CrudAreas from "./Admin/CrudAreas";
import CrudPreguntas from "./Admin/CrudPreguntas";
import CrudActividades from "./Admin/CrudActividades";
import CrudTestsAdiR from "./Admin/CrudTestsAdiR";
import CrudTestsAdos2 from "./Admin/CrudTestsAdos2";
import PerfilEspecialista from "./Especialista/PerfilEspecialista";
import PerfilPaciente from "./Paciente/PerfilPaciente";
import Resultados from "./Paciente/Resultados";
import GenerarReportes from "./Paciente/GenerarReportes";

import PacientesADOS from './Especialista/PacientesADOS';
import TestsADOSPaciente from './Especialista/TestsADOSPaciente';
import ActividadesADOS from './Especialista/ActividadesADOS';
import ResponderItemsAlgoritmo from "./Especialista/ResponderItemsAlgoritmo";
import ActividadesConsulta from "./Especialista/ActividadesConsulta";

import EvaluacionAdir from "./Paciente/EvaluacionAdir";


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
          <Route path="/pacientes" element={<Pacientes />} />
          <Route path="/tests-paciente/:id_paciente" element={<ListaTestsPaciente />} />
          <Route path="/resumen-adir/:id_adir" element={<ResumenADIR />} />
          <Route path="/perfil-especialista" element={<PerfilEspecialista />} />
          <Route path="/pacientesados" element={<PacientesADOS />} />
          <Route path="/tests/:id_paciente" element={<TestsADOSPaciente />} />
          <Route path="/ados/actividades/:modulo/:id_paciente" element={<ActividadesADOS />} />
          <Route path="/ados/responder-items/:id_ados/:id_algoritmo" element={<ResponderItemsAlgoritmo />} />
          <Route path="/ados/tests/:id_paciente" element={<TestsADOSPaciente />} />
          <Route path="/ados/actividades-consulta/:id_ados" element={<ActividadesConsulta />} />
        </Route>
        {/* Solo pacientes (privilegio 1) */}
        <Route element={<ProtectedRoute allowedPrivileges={[1]} />}>
          <Route path="/home_paciente" element={<Home_Paciente />} />
          <Route path="/consentimiento-informado" element={<ConsentimientoInformado />} />
          <Route path="/desactivar-cuenta" element={<DesactivarCuenta />} />
          <Route path="/perfil-paciente" element={<PerfilPaciente />} />
          <Route path="/resultados" element={<Resultados />} />
          <Route path="/reportes" element={<GenerarReportes />} />
          <Route path="/evaluacion-adir" element={<EvaluacionAdir />} />
        </Route>
        {/* Solo admin (privilegio 3) */}
        <Route element={<ProtectedRoute allowedPrivileges={[3]} />}>
          <Route path="/admin/home" element={<HomeAdmin />} />
          <Route path="/admin/usuarios" element={<CrudUsuarios />} />
          <Route path="/admin/pacientes" element={<CrudPacientes />} />
          <Route path="/admin/especialistas" element={<CrudEspecialistas />} />
          <Route path="/admin/areas" element={<CrudAreas />} />
          <Route path="/admin/preguntas" element={<CrudPreguntas />} />
          <Route path="/admin/actividades" element={<CrudActividades />} />
          <Route path="/admin/tests-adir" element={<CrudTestsAdiR />} />
          <Route path="/admin/tests-ados" element={<CrudTestsAdos2 />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
