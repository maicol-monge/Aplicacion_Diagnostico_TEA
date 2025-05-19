import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
                            localStorage.setItem("token", data.token);
                            navigate("/establecer-contra", {
                                state: {
                                    id_usuario: data.user.id_usuario,
                                    correo: data.user.correo
                                }
                            });
                        });
                        return;
                    }
                    // Login normal: guarda token y datos de usuario
                    const { id_usuario, nombres, apellidos, correo, privilegio, imagen } = data.user;
                    localStorage.setItem("user", JSON.stringify({ id_usuario, nombres, apellidos, correo, privilegio, imagen }));
                    localStorage.setItem("token", data.token); // Guarda el token para futuras peticiones

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
        <div className="container-fluid d-flex justify-content-center align-items-center px-2">
            <div className="w-100" style={{ maxWidth: 400 }}>
                <div className="text-center mb-3">
                    <p className="fw-bold" style={{ color: "#f3859e", fontSize: "1.2rem" }}>Iniciar sesión</p>
                </div>
                <div>
                    <input
                        className="form-control mb-3"
                        type="text"
                        placeholder="Correo electrónico"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="username"
                    />
                    <div className="input-group mb-4">
                        <input
                            type={showPassword ? "text" : "password"}
                            className="form-control"
                            placeholder="Contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="current-password"
                        />
                        <span
                            className="input-group-text"
                            onClick={() => setShowPassword(!showPassword)}
                            style={{ cursor: "pointer" }}
                        >
                            {showPassword ? (
                                <i className="bi bi-eye-slash-fill fs-5" style={{color: '#f3859e'}}></i>
                            ) : (
                                <i className="bi bi-eye-fill fs-5" style={{color: '#f3859e'}}></i>
                            )}
                        </span>
                    </div>
                    <button
                        type="button"
                        className="btn w-100"
                        style={{ background: "#457b9d", color: "#fff" }}
                        onClick={handleLogin}
                    >
                        Acceder
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
