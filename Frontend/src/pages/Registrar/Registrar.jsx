import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
// Instala supabase-js: npm install @supabase/supabase-js
import { createClient } from '@supabase/supabase-js';

// Configura tus credenciales de Supabase
const supabaseUrl = 'https://xbfnefyndfqlspnyexsh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhiZm5lZnluZGZxbHNwbnlleHNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM1MzI5OTQsImV4cCI6MjA1OTEwODk5NH0._NtmGEdvH-7EltxTvGJjWYWrX7gpJ_x469h2cv4TjBU';
const supabase = createClient(supabaseUrl, supabaseKey);

const Registrar = () => {
    const [formData, setFormData] = useState({
        nombres: '',
        apellidos: '',
        direccion: '',
        telefono: '',
        correo: '',
        contrasena: '',
        privilegio: '',
        imagen: ''
    });
    const [imagenFile, setImagenFile] = useState(null);

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && (file.type === 'image/png' || file.type === 'image/jpeg')) {
            setImagenFile(file);
        } else {
            setImagenFile(null);
            Swal.fire({
                title: 'Error',
                text: 'Solo se permiten archivos PNG o JPG.',
                icon: 'error',
                confirmButtonText: 'Aceptar',
            });
        }
    };

    const validatePassword = (password) => {
        const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return regex.test(password);
    };

    const validateEmail = (email) => {
        // Expresión regular simple para validar email
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const camposRequeridosLlenos = () => {
        return (
            formData.nombres.trim() !== '' &&
            formData.apellidos.trim() !== '' &&
            formData.direccion.trim() !== '' &&
            formData.telefono.trim() !== '' &&
            formData.correo.trim() !== '' &&
            validateEmail(formData.correo) &&
            formData.contrasena.trim() !== '' &&
            formData.privilegio !== ''
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateEmail(formData.correo)) {
            Swal.fire({
                title: 'Error',
                text: 'Por favor ingrese un correo electrónico válido.',
                icon: 'error',
                confirmButtonText: 'Aceptar',
            });
            return;
        }

        if (!validatePassword(formData.contrasena)) {
            Swal.fire({
                title: 'Error',
                text: 'La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un carácter especial.',
                icon: 'error',
                confirmButtonText: 'Aceptar',
            });
            return;
        }

        if (![0, 1].includes(Number(formData.privilegio))) {
            Swal.fire({
                title: 'Error',
                text: 'Privilegio no válido. Debe ser 0 (Estudiante) o 1 (Docente).',
                icon: 'error',
                confirmButtonText: 'Aceptar',
            });
            return;
        }

        let imagenUrl = '';
        if (imagenFile) {
            const fileExt = imagenFile.name.split('.').pop();
            const fileName = `${Date.now()}.${fileExt}`;
            const { data, error } = await supabase.storage
                .from('tea')
                .upload(fileName, imagenFile);

            if (error) {
                Swal.fire({
                    title: 'Error',
                    text: 'Error al subir la imagen a Supabase',
                    icon: 'error',
                    confirmButtonText: 'Aceptar',
                });
                return;
            }

            // Obtén la URL pública
            const { data: publicUrlData } = supabase
                .storage
                .from('tea')
                .getPublicUrl(fileName);

            imagenUrl = publicUrlData.publicUrl;
        }

        try {
            const response = await axios.post('http://localhost:5000/api/users/registrar', {
                ...formData,
                imagen: imagenUrl
            });
            Swal.fire({
                title: '¡Registro exitoso!',
                text: response.data.message,
                icon: 'success',
                confirmButtonText: 'Aceptar',
            }).then(() => {
                navigate('/');
            });
        } catch (err) {
            if (err.response) {
                Swal.fire({
                    title: 'Error',
                    text: err.response.data.message,
                    icon: 'error',
                    confirmButtonText: 'Aceptar',
                });
            } else {
                Swal.fire({
                    title: 'Error',
                    text: 'Error al conectar con el servidor',
                    icon: 'error',
                    confirmButtonText: 'Aceptar',
                });
            }
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card shadow">
                        <div className="card-header bg-primary text-white text-center">
                            <h3>Registrar Usuario</h3>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">Nombres:</label>
                                    <input
                                        type="text"
                                        name="nombres"
                                        className="form-control"
                                        value={formData.nombres}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Apellidos:</label>
                                    <input
                                        type="text"
                                        name="apellidos"
                                        className="form-control"
                                        value={formData.apellidos}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Dirección:</label>
                                    <input
                                        type="text"
                                        name="direccion"
                                        className="form-control"
                                        value={formData.direccion}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Teléfono:</label>
                                    <input
                                        type="text"
                                        name="telefono"
                                        className="form-control"
                                        value={formData.telefono}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Correo:</label>
                                    <input
                                        type="email"
                                        name="correo"
                                        className="form-control"
                                        value={formData.correo}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Privilegio:</label>
                                    <select
                                        name="privilegio"
                                        className="form-select"
                                        value={formData.privilegio}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Seleccione</option>
                                        <option value="0">Especialista</option>
                                        <option value="0">Paciente</option>
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Imagen (opcional):</label>
                                    <input
                                        type="file"
                                        accept="image/png, image/jpeg"
                                        className="form-control"
                                        onChange={handleFileChange}
                                    />
                                </div>
                                <div className="d-grid gap-2">
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={!camposRequeridosLlenos()}
                                    >
                                        Registrar
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => navigate('/')}
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Registrar;