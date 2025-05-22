import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import Navbar from '../components/Navbar_espe';
import Footer from '../components/Footer';
import { useNavigate, Link } from 'react-router-dom';

const Pacientes = () => {
    const [pacientes, setPacientes] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [filtroSexo, setFiltroSexo] = useState('');
    const [ordenFecha, setOrdenFecha] = useState('asc');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPacientes = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get('http://localhost:5000/api/users/pacientes', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setPacientes(response.data);
            } catch (err) {
                Swal.fire({
                    title: 'Error',
                    text: 'No se pudo cargar la lista de pacientes.',
                    icon: 'error',
                    confirmButtonText: 'Aceptar',
                });
            }
        };
        fetchPacientes();
    }, []);

    // Filtrado por nombre/apellido y sexo
    let pacientesFiltrados = pacientes.filter((p) => {
        const nombreCompleto = `${p.nombres} ${p.apellidos}`.toLowerCase();
        const coincideBusqueda = nombreCompleto.includes(busqueda.toLowerCase());
        const coincideSexo = filtroSexo ? p.sexo === filtroSexo : true;
        return coincideBusqueda && coincideSexo;
    });

    // Ordenar por fecha de nacimiento
    pacientesFiltrados = pacientesFiltrados.sort((a, b) => {
        const fechaA = new Date(a.fecha_nacimiento);
        const fechaB = new Date(b.fecha_nacimiento);
        return ordenFecha === 'asc' ? fechaA - fechaB : fechaB - fechaA;
    });

    return (
        <div>
            <Navbar />
            <div className="container mt-4">
                <button className="btn btn-secondary mb-3" onClick={() => navigate(-1)}>
                    Volver
                </button>
                <h2>Listado de Pacientes</h2>
                <div className="row mb-3">
                    <div className="col-md-4">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Buscar por nombre o apellido"
                            value={busqueda}
                            onChange={e => setBusqueda(e.target.value)}
                        />
                    </div>
                    <div className="col-md-3">
                        <select
                            className="form-control"
                            value={filtroSexo}
                            onChange={e => setFiltroSexo(e.target.value)}
                        >
                            <option value="">Todos los sexos</option>
                            <option value="M">Masculino</option>
                            <option value="F">Femenino</option>
                        </select>
                    </div>
                    <div className="col-md-3">
                        <select
                            className="form-control"
                            value={ordenFecha}
                            onChange={e => setOrdenFecha(e.target.value)}
                        >
                            <option value="asc">Fecha de nacimiento ascendente</option>
                            <option value="desc">Fecha de nacimiento descendente</option>
                        </select>
                    </div>
                </div>
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Sexo</th>
                            <th>Fecha de Nacimiento</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pacientesFiltrados.map((p) => (
                            <tr key={p.id_paciente}>
                                <td>{p.nombres} {p.apellidos}</td>
                                <td>{p.sexo}</td>
                                <td>{p.fecha_nacimiento ? new Date(p.fecha_nacimiento).toLocaleDateString() : ''}</td>
                                <td>
                                    <Link to={`/tests-paciente/${p.id_paciente}`} className="btn btn-primary btn-sm">
                                        Ver Tests ADIR
                                    </Link>
                                </td>
                            </tr>
                        ))}
                        {pacientesFiltrados.length === 0 && (
                            <tr>
                                <td colSpan={4} className="text-center">No se encontraron pacientes.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <Footer />
        </div>
    );
};

export default Pacientes;