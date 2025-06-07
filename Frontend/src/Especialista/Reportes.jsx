import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar_espe";
import Footer from "../components/Footer";

const COLOR_PRIMARY = "#457b9d";
const COLOR_ACCENT = "#f3859e";
const COLOR_DARK = "#1d3557";

const Reportes = () => {
    const [pacientes, setPacientes] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [tipoTest, setTipoTest] = useState("todos"); // "todos", "adir", "ados"
    const [pacienteActivo, setPacienteActivo] = useState(null);

    // Cargar pacientes con tests recientes
    useEffect(() => {
        const token = localStorage.getItem("token");
        axios.get("http://localhost:5000/api/especialistas/reportes/pacientes-con-tests", {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => setPacientes(res.data))
        .catch(() => setPacientes([]));
    }, []);

    // Filtrar pacientes por nombre o apellido
    const pacientesFiltrados = pacientes.filter(p =>
        (p.nombres + " " + p.apellidos).toLowerCase().includes(busqueda.toLowerCase())
    );

    // Mostrar tests filtrados por tipo
    const getTestsFiltrados = (paciente) => {
        let tests = [];
        if (tipoTest === "adir" || tipoTest === "todos") {
            tests = tests.concat((paciente.tests_adir || []).map(t => ({ ...t, tipo: "ADI-R" })));
        }
        if (tipoTest === "ados" || tipoTest === "todos") {
            tests = tests.concat((paciente.tests_ados || []).map(t => ({ ...t, tipo: "ADOS-2" })));
        }
        // Ordenar por fecha descendente
        return tests.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    };

    return (
        <div className="d-flex flex-column min-vh-100" style={{ background: "#f8f9fa" }}>
            <Navbar />
            <div className="container py-4 flex-grow-1">
                <h2 className="mb-4" style={{ color: COLOR_DARK, fontWeight: "bold" }}>Reportes de Pacientes</h2>
                <div className="row mb-3">
                    <div className="col-md-6 mb-2">
                        <input
                            className="form-control"
                            placeholder="Buscar paciente por nombre o apellido..."
                            value={busqueda}
                            onChange={e => setBusqueda(e.target.value)}
                        />
                    </div>
                    <div className="col-md-6 mb-2">
                        <select
                            className="form-select"
                            value={tipoTest}
                            onChange={e => setTipoTest(e.target.value)}
                        >
                            <option value="todos">Todos los tests</option>
                            <option value="adir">Solo ADI-R</option>
                            <option value="ados">Solo ADOS-2</option>
                        </select>
                    </div>
                </div>
                <div className="list-group">
                    {pacientesFiltrados.length === 0 && (
                        <div className="alert alert-info">No se encontraron pacientes.</div>
                    )}
                    {pacientesFiltrados.map(paciente => (
                        <div key={paciente.id_paciente} className="list-group-item mb-3 shadow-sm rounded">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <strong>{paciente.nombres} {paciente.apellidos}</strong>
                                    <span className="ms-2 badge bg-secondary">{paciente.sexo === "M" ? "Masculino" : "Femenino"}</span>
                                    <span className="ms-2 text-muted" style={{ fontSize: 14 }}>
                                        Nacimiento: {new Date(paciente.fecha_nacimiento).toLocaleDateString("es-ES")}
                                        {" | Edad: "}
                                        {(() => {
                                            const nacimiento = new Date(paciente.fecha_nacimiento);
                                            const hoy = new Date();
                                            let años = hoy.getFullYear() - nacimiento.getFullYear();
                                            let meses = hoy.getMonth() - nacimiento.getMonth();
                                            if (meses < 0 || (meses === 0 && hoy.getDate() < nacimiento.getDate())) {
                                                años--;
                                                meses += 12;
                                            }
                                            if (hoy.getDate() < nacimiento.getDate()) {
                                                meses--;
                                                if (meses < 0) {
                                                    años--;
                                                    meses += 12;
                                                }
                                            }
                                            return `${años} años${meses >= 0 ? ` y ${meses} meses` : ""}`;
                                        })()}
                                    </span>
                                </div>
                                <button
                                    className="btn btn-outline-primary"
                                    onClick={() => setPacienteActivo(pacienteActivo === paciente.id_paciente ? null : paciente.id_paciente)}
                                >
                                    {pacienteActivo === paciente.id_paciente ? "Ocultar tests" : "Ver tests"}
                                </button>
                            </div>
                            {pacienteActivo === paciente.id_paciente && (
                                <div className="mt-3">
                                    {getTestsFiltrados(paciente).length === 0 && (
                                        <div className="alert alert-warning">Este paciente no tiene tests registrados.</div>
                                    )}
                                    {getTestsFiltrados(paciente).map(test => (
                                        <div key={test.id_adir || test.id_ados} className="card mb-2">
                                            <div className="card-body d-flex flex-column flex-md-row justify-content-between align-items-md-center">
                                                <div>
                                                    <span className="badge bg-info me-2">{test.tipo}</span>
                                                    <span className="fw-bold">Fecha:</span> {new Date(test.fecha).toLocaleString()}
                                                    {test.tipo === "ADI-R" && (
                                                        <>
                                                            <span className="ms-3 fw-bold">Diagnóstico:</span> {test.diagnostico || "N/A"}
                                                            <span className="ms-3 fw-bold">Algoritmo:</span> {test.algoritmo}
                                                        </>
                                                    )}
                                                    {test.tipo === "ADOS-2" && (
                                                        <>
                                                            <span className="ms-3 fw-bold">Diagnóstico:</span> {test.diagnostico || "N/A"}
                                                            <span className="ms-3 fw-bold">Módulo:</span> {test.modulo}
                                                            <span className="ms-3 fw-bold">Clasificación:</span> {test.clasificacion}
                                                        </>
                                                    )}
                                                </div>
                                                <button
                                                    className="btn btn-sm btn-success mt-2 mt-md-0"
                                                    // Aquí luego implementarás la lógica de generación de reporte
                                                    onClick={() => alert("Funcionalidad de reporte pendiente")}
                                                >
                                                    Generar Reporte
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Reportes;