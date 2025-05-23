import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import Navbar from '../components/Navbar_espe';
import Footer from '../components/Footer';

const COLOR_PRIMARY = "#457b9d";
const COLOR_DARK = "#1d3557";
const COLOR_ACCENT = "#f3859e";
const COLOR_BG = "#a8dadc";

function calcularEdad(fechaNacimiento) {
    if (!fechaNacimiento) return '';
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const m = hoy.getMonth() - nacimiento.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
        edad--;
    }
    return edad;
}

const ResumenADIR = () => {
    const { id_adir } = useParams();
    const [resumen, setResumen] = useState(null);
    const [diagnostico, setDiagnostico] = useState("");
    const [editando, setEditando] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        axios.get(
            `http://localhost:5000/api/adir/resumen/${id_adir}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
            .then(res => {
                setResumen(res.data);
                setDiagnostico(res.data.test.diagnostico || "");
            })
            .catch(() => {
                Swal.fire("Sin evaluaciones", "No se encontró el test ADIR.", "info");
            });
    }, [id_adir]);

    const guardarDiagnostico = async () => {
        try {
            const token = localStorage.getItem("token");
            await axios.put(
                `http://localhost:5000/api/adir/diagnostico/${id_adir}`,
                { diagnostico },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            Swal.fire("Diagnóstico guardado", "", "success");
            setEditando(false);
        } catch {
            Swal.fire("Error al guardar diagnóstico", "", "error");
        }
    };

    if (!resumen) return (
        <div className="d-flex flex-column min-vh-100" style={{ background: COLOR_BG }}>
            <Navbar />
            <div className="container py-5 flex-grow-1 text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
            </div>
            <Footer />
        </div>
    );

    const { nombres, apellidos, sexo, fecha_nacimiento } = resumen.test;

    return (
        <div className="d-flex flex-column min-vh-100" style={{ background: COLOR_BG }}>
            <Navbar />
            <div className="container py-4 flex-grow-1">
                <button
                    className="btn mb-3"
                    style={{
                        background: COLOR_DARK,
                        color: "#fff",
                        fontWeight: "bold"
                    }}
                    onClick={() => navigate(-1)}
                >
                    Volver
                </button>
                <div className="card shadow" style={{ borderRadius: 18 }}>
                    <div className="card-body">
                        <h2 className="text-center mb-3" style={{ color: COLOR_PRIMARY, fontWeight: "bold" }}>
                            Resumen Evaluación ADIR
                        </h2>
                        <div className="mb-4 text-center">
                            <span className="badge rounded-pill" style={{ background: COLOR_ACCENT, fontSize: "1rem" }}>
                                Paciente: <span style={{ fontWeight: "bold" }}>{nombres} {apellidos}</span>
                            </span>
                            <span className="mx-2"></span>
                            <span className="badge rounded-pill" style={{ background: COLOR_PRIMARY, color: "#fff", fontSize: "1rem" }}>
                                Sexo: {sexo}
                            </span>
                            <span className="mx-2"></span>
                            <span className="badge rounded-pill" style={{ background: COLOR_DARK, color: "#fff", fontSize: "1rem" }}>
                                Edad: {fecha_nacimiento ? calcularEdad(fecha_nacimiento) + ' años' : ''}
                            </span>
                        </div>
                        <div className="table-responsive mb-4">
                            <table className="table table-bordered align-middle text-center" style={{ borderRadius: 12, overflow: "hidden" }}>
                                <thead style={{ background: COLOR_PRIMARY, color: "#fff" }}>
                                    <tr>
                                        <th>Área</th>
                                        <th>Pregunta</th>
                                        <th>Calificación</th>
                                        <th>Observación</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {resumen.respuestas && resumen.respuestas.length > 0 ? (
                                        resumen.respuestas.map(r => (
                                            <tr key={r.id_pregunta}>
                                                <td style={{ fontWeight: "bold" }}>{r.area}</td>
                                                <td>{r.pregunta}</td>
                                                <td>{r.calificacion}</td>
                                                <td>{r.observacion}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="text-center">No hay respuestas para este test.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div className="mb-3">
                            <label className="form-label" style={{ fontWeight: "bold", color: COLOR_DARK }}>
                                Diagnóstico
                            </label>
                            <textarea
                                className="form-control"
                                value={diagnostico}
                                onChange={e => setDiagnostico(e.target.value)}
                                disabled={!editando}
                                rows={3}
                                style={{ borderColor: COLOR_ACCENT, borderWidth: 2, fontSize: "1.05rem" }}
                            />
                        </div>
                        <div className="d-flex flex-column flex-md-row gap-2">
                            {!editando ? (
                                <button
                                    className="btn btn-warning"
                                    style={{ fontWeight: "bold" }}
                                    onClick={() => setEditando(true)}
                                >
                                    {diagnostico ? "Editar Diagnóstico" : "Agregar Diagnóstico"}
                                </button>
                            ) : (
                                <button
                                    className="btn btn-primary"
                                    style={{ fontWeight: "bold", background: COLOR_PRIMARY }}
                                    onClick={guardarDiagnostico}
                                >
                                    Guardar Diagnóstico
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ResumenADIR;