import { BrowserRouter as Router, Route, Routes } from "react-router-dom";


import LoginPage from "./pages/Login/LoginPage";
import Home from "./pages/Home/home";
import Registrar from "./pages/Registrar/Registrar";


function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<LoginPage />} />
        <Route exact path="/home" element={<Home />} />
        <Route exact path="/registrar" element={<Registrar />} />
        
      </Routes>
    </Router>
  );
}

export default App
