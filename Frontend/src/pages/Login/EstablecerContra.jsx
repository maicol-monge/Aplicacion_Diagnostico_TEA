import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate, useLocation } from 'react-router-dom';

const EstablecerContra = () => {
    const [nuevaContra, setNuevaContra] = useState('');
    const [confirmarContra, setConfirmarContra] = useState('');
    const [showNueva, setShowNueva] = useState(false);
    const [showConfirmar, setShowConfirmar] = useState(false);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const { id_usuario, correo } = location.state || {};

    const validatePassword = (password) => {
        // Al menos 8 caracteres, una mayúscula, un número y un carácter especial
        const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return regex.test(password);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validatePassword(nuevaContra)) {
            Swal.fire({
                title: 'Error',
                text: 'La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un carácter especial.',
                icon: 'error',
                confirmButtonText: 'Aceptar',
            });
            return;
        }
        if (nuevaContra !== confirmarContra) {
            Swal.fire({
                title: 'Error',
                text: 'Las contraseñas no coinciden.',
                icon: 'error',
                confirmButtonText: 'Aceptar',
            });
            return;
        }
        setLoading(true);
        try {
            await axios.post('http://localhost:5000/api/users/cambiar-contrasena', {
                id_usuario,
                nuevaContra
            });
            Swal.fire({
                title: '¡Contraseña actualizada!',
                text: 'Ahora puedes iniciar sesión con tu nueva contraseña.',
                icon: 'success',
                confirmButtonText: 'Ir al login',
            }).then(() => navigate('/'));
        } catch (err) {
            Swal.fire({
                title: 'Error',
                text: 'No se pudo actualizar la contraseña. Intenta de nuevo.',
                icon: 'error',
                confirmButtonText: 'Aceptar',
            });
        }
        setLoading(false);
    };

    if (!id_usuario || !correo) {
        return (
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-12 col-md-6">
                        <div className="alert alert-danger text-center">
                            Información de usuario no encontrada. Inicia sesión nuevamente.
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5">
                    <div className="card shadow">
                        <div className="card-header bg-primary text-white text-center">
                            <h4 className="mb-0">Establecer Nueva Contraseña</h4>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">Nueva contraseña</label>
                                    <div className="input-group">
                                        <input
                                            type={showNueva ? "text" : "password"}
                                            className="form-control"
                                            value={nuevaContra}
                                            onChange={e => setNuevaContra(e.target.value)}
                                            required
                                        />
                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary"
                                            tabIndex={-1}
                                            onClick={() => setShowNueva(!showNueva)}
                                        >
                                            {showNueva ? (
                                                <i className="bi bi-eye-slash-fill"></i>
                                            ) : (
                                                <i className="bi bi-eye-fill"></i>
                                            )}
                                        </button>
                                    </div>
                                    <div className="form-text">
                                        Mínimo 8 caracteres, una mayúscula, un número y un carácter especial.
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Confirmar contraseña</label>
                                    <div className="input-group">
                                        <input
                                            type={showConfirmar ? "text" : "password"}
                                            className="form-control"
                                            value={confirmarContra}
                                            onChange={e => setConfirmarContra(e.target.value)}
                                            required
                                        />
                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary"
                                            tabIndex={-1}
                                            onClick={() => setShowConfirmar(!showConfirmar)}
                                        >
                                            {showConfirmar ? (
                                                <i className="bi bi-eye-slash-fill"></i>
                                            ) : (
                                                <i className="bi bi-eye-fill"></i>
                                            )}
                                        </button>
                                    </div>
                                </div>
                                <div className="d-grid gap-2">
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={loading}
                                    >
                                        Guardar nueva contraseña
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => navigate('/')}
                                        disabled={loading}
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

export default EstablecerContra;