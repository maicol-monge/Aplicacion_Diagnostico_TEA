import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import Navbar from '../components/Navbar_espe';
import Footer from '../components/Footer';

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
        axios.get(`http://localhost:5000/api/adir/${id_adir}`)
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
            await axios.put(`http://localhost:5000/api/adir/${id_adir}/diagnostico`, { diagnostico });
            Swal.fire("Diagnóstico guardado", "", "success");
            setEditando(false);
        } catch {
            Swal.fire("Error al guardar diagnóstico", "", "error");
        }
    };

    if (!resumen) return <div>Cargando...</div>;

    const { nombres, apellidos, sexo, fecha_nacimiento } = resumen.test;

    return (
        <div>
            <Navbar />
            <div className="container mt-4">
                <button className="btn btn-secondary mb-3" onClick={() => navigate(-1)}>
                    Volver
                </button>
                <h2>Resumen Evaluación ADIR</h2>
                <h4>
                    Paciente: {nombres} {apellidos} <br />
                    Sexo: {sexo} <br />
                    Edad: {fecha_nacimiento ? calcularEdad(fecha_nacimiento) + ' años' : ''}
                </h4>
                <table className="table">
                    <thead>
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
                                    <td>{r.area}</td>
                                    <td>{r.pregunta}</td>
                                    <td>{r.calificacion}</td>
                                    <td>{r.observacion}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4}>No hay respuestas para este test.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <div className="mb-3">
                    <label>Diagnóstico</label>
                    <textarea
                        className="form-control"
                        value={diagnostico}
                        onChange={e => setDiagnostico(e.target.value)}
                        disabled={!editando}
                    />
                </div>
                {!editando ? (
                    <button className="btn btn-warning" onClick={() => setEditando(true)}>
                        Agregar Diagnóstico
                    </button>
                ) : (
                    <button className="btn btn-primary" onClick={guardarDiagnostico}>
                        Guardar Diagnóstico
                    </button>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default ResumenADIR;