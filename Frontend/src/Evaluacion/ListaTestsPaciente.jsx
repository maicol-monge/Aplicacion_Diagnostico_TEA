import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar_espe';
import Footer from '../components/Footer';

const ListaTestsPaciente = () => {
    const { id_paciente } = useParams();
    const [tests, setTests] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`http://localhost:5000/api/adir/paciente/${id_paciente}`)
            .then(res => setTests(res.data));
    }, [id_paciente]);

    return (
        <div>
            <Navbar />
            <div className="container mt-4">
                <button className="btn btn-secondary mb-3" onClick={() => navigate(-1)}>
                    Volver
                </button>
                <h2>Tests ADIR del Paciente</h2>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Diagnóstico</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tests.map(test => (
                            <tr key={test.id_adir}>
                                <td>{new Date(test.fecha).toLocaleString()}</td>
                                <td>{test.diagnostico || "Sin diagnóstico"}</td>
                                <td>
                                    <Link to={`/resumen-adir/${test.id_adir}`} className="btn btn-primary btn-sm">
                                        Ver Resumen
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Footer />
        </div>
    );
};

export default ListaTestsPaciente;