import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar_paciente";
import Footer from "../components/Footer";
import DescargarAdiR from "./DescargarAdiR";

const COLOR_BG = "#a8dadc";
const COLOR_PRIMARY = "#457b9d";
const COLOR_DARK = "#1d3557";
const COLOR_ACCENT = "#f3859e";

const GenerarReportes = () => {
    const [tests, setTests] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [fecha, setFecha] = useState("");

    useEffect(() => {
        const fetchTests = async () => {
            const user = JSON.parse(localStorage.getItem("user"));
            const token = localStorage.getItem("token");
            if (!user || !token) return;
            try {
                // 1. Obtener id_paciente usando el método del controller
                const { data: pacienteData } = await axios.get(
                    `http://localhost:5000/api/pacientes/buscar-paciente/${user.id_usuario}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                const id_paciente = pacienteData.paciente.id_paciente;

                // 2. Listar tests usando el id_paciente obtenido
                const res = await axios.get(
                    `http://localhost:5000/api/adir/listar/${id_paciente}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setTests(res.data);
                setFiltered(res.data);
                setLoading(false);
            } catch (err) {
                setError("No se pudieron cargar los tests.");
                setLoading(false);
            }
        };
        fetchTests();
    }, []);

    // Filtrar por fecha
    useEffect(() => {
        if (!fecha) {
            setFiltered(tests);
        } else {
            setFiltered(
                tests.filter(test =>
                    new Date(test.fecha).toLocaleDateString().includes(fecha)
                )
            );
        }
    }, [fecha, tests]);

    return (
        <div className="d-flex flex-column min-vh-100" style={{ background: COLOR_BG }}>
            <Navbar />
            <div className="container py-5 flex-grow-1">
                <h2 className="text-center mb-4" style={{ color: COLOR_PRIMARY, fontWeight: "bold" }}>
                    Generación de Reportes ADI-R
                </h2>
                <div className="mb-4 d-flex justify-content-center">
                    <input
                        type="text"
                        className="form-control w-auto"
                        placeholder="Buscar por fecha (dd/mm/aaaa)"
                        value={fecha}
                        onChange={e => setFecha(e.target.value)}
                        style={{ borderRadius: 20, minWidth: 220 }}
                    />
                </div>
                {loading ? (
                    <div className="text-center text-secondary">Cargando...</div>
                ) : error ? (
                    <div className="alert alert-danger text-center">{error}</div>
                ) : filtered.length === 0 ? (
                    <div className="alert alert-info text-center">
                        No se encontraron tests ADI-R para los criterios seleccionados.
                    </div>
                ) : (
                    <div className="row g-4 justify-content-center">
                        {filtered.map(test => (
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
                                            <strong>Diagnóstico:</strong> {test.diagnostico || "Pendiente"}
                                        </p>
                                        <DescargarAdiR id_adir={test.id_adir} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default GenerarReportes;