import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar_paciente";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import DescargarAdiR from "./DescargarAdiR";

// Colores y estilos iguales al home
const COLOR_BG = "#a8dadc";
const COLOR_PRIMARY = "#457b9d";
const COLOR_DARK = "#1d3557";
const COLOR_ACCENT = "#f3859e";

const Resultados = () => {
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        const token = localStorage.getItem("token");
        if (!user || !token) {
            navigate("/");
            return;
        }
        axios.get(
            `http://localhost:5000/api/adir/listar-con-diagnostico/${user.id_paciente}`,
            { headers: { Authorization: `Bearer ${token}` } }
        )
            .then(res => {
                setTests(res.data);
                setLoading(false);
            })
            .catch(() => {
                setError("No se pudieron cargar los resultados.");
                setLoading(false);
            });
    }, [navigate]);

    return (
        <div className="d-flex flex-column min-vh-100" style={{ background: COLOR_BG }}>
            <Navbar />
            <div className="container py-5 flex-grow-1">
                <h2 className="text-center mb-4" style={{ color: COLOR_PRIMARY, fontWeight: "bold" }}>
                    Resultados de Evaluaciones ADI-R
                </h2>
                {loading ? (
                    <div className="text-center text-secondary">Cargando...</div>
                ) : error ? (
                    <div className="alert alert-danger text-center">{error}</div>
                ) : tests.length === 0 ? (
                    <div className="alert alert-info text-center">
                        No tienes resultados de evaluaciones ADI-R con diagnóstico.
                    </div>
                ) : (
                    <div className="row g-4 justify-content-center">
                        {tests.map(test => (
                            <div key={test.id_adir} className="col-12 col-md-6 col-lg-4">
                                <div className="card shadow h-100" style={{ borderTop: `6px solid ${COLOR_ACCENT}`, borderRadius: 18 }}>
                                    <div className="card-body d-flex flex-column justify-content-between">
                                        <h5 className="card-title" style={{ color: COLOR_ACCENT, fontWeight: "bold" }}>
                                            Evaluación ADI-R
                                        </h5>
                                        <p className="mb-2" style={{ color: COLOR_DARK }}>
                                            <strong>Fecha:</strong> {new Date(test.fecha).toLocaleDateString()}
                                        </p>
                                        <p className="mb-2" style={{ color: COLOR_DARK }}>
                                            <strong>Diagnóstico:</strong> {test.diagnostico}
                                        </p>
                                        <DescargarAdiR id_adir={test.id_adir} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                <div className="mt-5">
                    <button
                        className="btn btn-secondary"
                        style={{ borderRadius: 20, fontWeight: "bold" }}
                        onClick={() => navigate(-1)}
                    >
                        Volver
                    </button>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Resultados;