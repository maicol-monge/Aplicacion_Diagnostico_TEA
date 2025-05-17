import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const LoginForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleLogin = () => {
        if (email && password) {
            axios
                .post("http://localhost:5000/api/users/login", { correo: email, contrasena: password })
                .then((response) => {
                    const data = response.data;
                    // Si requiere cambio de contraseña, redirige a establecer contraseña
                    if (data.requirePasswordChange) {
                        Swal.fire({
                            title: "¡Bienvenido!",
                            text: "Por seguridad, debes establecer una nueva contraseña.",
                            icon: "info",
                            confirmButtonText: "Continuar"
                        }).then(() => {
                            navigate("/establecer-contra", {
                                state: {
                                    id_usuario: data.user.id_usuario,
                                    correo: data.user.correo
                                }
                            });
                        });
                        return;
                    }
                    // Login normal
                    const { id_usuario, nombres, apellidos, correo, privilegio, imagen } = data.user;
                    localStorage.setItem("user", JSON.stringify({ id_usuario, nombres, apellidos, correo, privilegio, imagen }));
                    console.log("Usuario logueado:", data.user);
                    if (privilegio === 0) {
                        navigate("/home_espe");
                    } else if (privilegio === 1) {
                        navigate("/home_paciente");
                    }
                    else {
                        navigate("/");
                    }
                    
                })
                .catch((error) => {
                    Swal.fire({
                        title: "Error",
                        text: "Usuario o contraseña incorrectos",
                        icon: "error",
                        showConfirmButton: false,
                        timer: 1500
                    });
                });
        } else {
            Swal.fire({
                title: "Error",
                text: "Por favor, completa todos los campos.",
                icon: "error",
                showConfirmButton: false,
                timer: 1500
            });
        }
    };

    return (
        <div className="d-flex justify-content-center">
            <section className="w-50 mx-4">
                <p className="text-center text-danger fw-bold">Iniciar sesión</p>
                <div className="text-center">
                    <input
                        className="form-control mb-3"
                        type="text"
                        placeholder="Correo electrónico"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <div className="input-group mb-4">
                        <input
                            type={showPassword ? "text" : "password"}
                            className="form-control"
                            placeholder="Contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <span
                            className="input-group-text"
                            onClick={() => setShowPassword(!showPassword)}
                            style={{ cursor: "pointer" }}
                        >
                            {showPassword ? (
                                <i className="bi bi-eye-slash-fill fs-4 text-primary"></i>
                            ) : (
                                <i className="bi bi-eye-fill fs-4 text-primary"></i>
                            )}
                        </span>
                    </div>
                    <button
                        type="button"
                        className="btn btn-primary px-4 mb-2"
                        onClick={handleLogin}
                    >
                        Acceder
                    </button>
                </div>
            </section>
            <section
                className="text-center w-md-25 ps-md-5 border-start border-primary border-3 ms-3 mt-4"
                style={{ borderLeft: "red" }}
            >
                <p className="my-4">¿Aún no estás registrado?</p>
                <p className="mb-2">¡Registrate ahora!</p>
                <Link to="/registrar">
                    <button className="btn btn-warning text-light px-4 mb-3 mt-md-4">
                        Registrate
                    </button>
                </Link>
            </section>
        </div>
    );
};

export default LoginForm;
