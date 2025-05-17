import { useContext, useState } from "react";
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
                    console.log("Respuesta del backend:", response.data); // Verifica la respuesta aquí
                    const { id_usuario, nombre, correo } = response.data.user;
                    localStorage.setItem("user", JSON.stringify({ id_usuario, nombre, correo })); // Guardar en localStorage
                    navigate("/home");
                })
                .catch((error) => {
                    console.error("Error al iniciar sesión:", error);
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
