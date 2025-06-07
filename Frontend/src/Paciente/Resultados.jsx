import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar_paciente";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

const COLOR_BG = "#a8dadc";
const COLOR_PRIMARY = "#457b9d";
const COLOR_DARK = "#1d3557";
const COLOR_ACCENT = "#f3859e";

const Resultados = () => {
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [tipo, setTipo] = useState("todos");
    const [fechaInicio, setFechaInicio] = useState("");
    const [fechaFin, setFechaFin] = useState("");
    const navigate = useNavigate();

    const fetchResultados = async (id_paciente, token, tipo, fechaInicio, fechaFin) => {
        setLoading(true);
        setError("");
        try {
            let params = [];
            if (tipo) params.push(`tipo=${tipo}`);
            if (fechaInicio) params.push(`fecha_inicio=${fechaInicio}`);
            if (fechaFin) params.push(`fecha_fin=${fechaFin}`);
            const query = params.length ? "?" + params.join("&") : "";
            const res = await axios.get(
                `http://localhost:5000/api/pacientes/resultados/${id_paciente}${query}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setTests(res.data);
        } catch (err) {
            setError("No se pudieron cargar los resultados.");
        }
        setLoading(false);
    };

    useEffect(() => {
        const cargar = async () => {
            const user = JSON.parse(localStorage.getItem("user"));
            const token = localStorage.getItem("token");
            if (!user || !token) {
                navigate("/");
                return;
            }
            // Obtener id_paciente
            const { data: pacienteData } = await axios.get(
                `http://localhost:5000/api/pacientes/buscar-paciente/${user.id_usuario}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const id_paciente = pacienteData.paciente.id_paciente;
            fetchResultados(id_paciente, token, tipo, fechaInicio, fechaFin);
        };
        cargar();
        // eslint-disable-next-line
    }, [tipo, fechaInicio, fechaFin, navigate]);

    return (
        <div className="d-flex flex-column min-vh-100" style={{ background: COLOR_BG }}>
            <Navbar />
            <div className="container py-5 flex-grow-1">
                <h2 className="text-center mb-4" style={{ color: COLOR_PRIMARY, fontWeight: "bold" }}>
                    Resultados de Evaluaciones
                </h2>
                <div className="row mb-4">
                    <div className="col-md-4 mb-2">
                        <select className="form-select" value={tipo} onChange={e => setTipo(e.target.value)}>
                            <option value="todos">Todos los tests</option>
                            <option value="adir">Solo ADI-R</option>
                            <option value="ados">Solo ADOS-2</option>
                        </select>
                    </div>
                    <div className="col-md-3 mb-2">
                        <input
                            type="date"
                            className="form-control"
                            value={fechaInicio}
                            onChange={e => setFechaInicio(e.target.value)}
                            placeholder="Fecha inicio"
                        />
                    </div>
                    <div className="col-md-3 mb-2">
                        <input
                            type="date"
                            className="form-control"
                            value={fechaFin}
                            onChange={e => setFechaFin(e.target.value)}
                            placeholder="Fecha fin"
                        />
                    </div>
                </div>
                {loading ? (
                    <div className="text-center text-secondary">Cargando...</div>
                ) : error ? (
                    <div className="alert alert-danger text-center">{error}</div>
                ) : tests.length === 0 ? (
                    <div className="alert alert-info text-center">
                        No tienes resultados de evaluaciones en el rango seleccionado.
                    </div>
                ) : (
                    <div className="row g-4 justify-content-center">
                        {tests.map(test => (
                            <div key={test.id + test.tipo} className="col-12 col-md-6 col-lg-4">
                                <div className="card shadow h-100" style={{ borderTop: `6px solid ${COLOR_ACCENT}`, borderRadius: 18 }}>
                                    <div className="card-body d-flex flex-column justify-content-between">
                                        <h5 className="card-title" style={{ color: COLOR_ACCENT, fontWeight: "bold" }}>
                                            Evaluación {test.tipo}
                                        </h5>
                                        <p className="mb-2" style={{ color: COLOR_DARK }}>
                                            <strong>Fecha:</strong> {new Date(test.fecha).toLocaleDateString()}
                                        </p>
                                        <p className="mb-2" style={{ color: COLOR_DARK }}>
                                            <strong>Diagnóstico:</strong> {test.diagnostico}
                                        </p>
                                        {test.tipo === "ADOS-2" && (
                                            <p className="mb-2" style={{ color: COLOR_DARK }}>
                                                <strong>Módulo:</strong> {test.modulo} <br />
                                                <strong>Clasificación:</strong> {test.clasificacion}
                                            </p>
                                        )}
                                        {/* Aquí puedes agregar botones de descarga si lo deseas */}
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