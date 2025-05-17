import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const [userName, setUserName] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user) {
            setUserName(user.nombres);
        } else {
            navigate("/"); // Redirige al login si no hay usuario
        }
    }, [navigate]);

    return (
        <div className="container mt-5">
            <h1 className="text-center text-primary mb-4">
                APLICACIÓN PARA LA EVALUACIÓN DE PERSONAS CON TRASTORNO DEL 
                ESPECTRO AUTISTA (TEA)
            </h1>
            <h2>Especialista</h2>
            <h3 className="text-center text-secondary mb-5">
                ¡Bienvenido, {userName}!
            </h3>
            <div className="row g-4">
                
            </div>
        </div>
    );
};

export default Home;