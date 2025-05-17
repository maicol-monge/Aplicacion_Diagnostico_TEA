import React from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/TEA Logo.png"; // Ajusta la ruta si es necesario

const COLOR_PRIMARY = "#457b9d";
const COLOR_ACCENT = "#f3859e";
const COLOR_DARK = "#1d3557";

const Navbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        import("sweetalert2").then(Swal => {
            Swal.default.fire({
                title: "¿Cerrar sesión?",
                text: "¿Estás seguro que deseas cerrar sesión?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: COLOR_ACCENT,
                cancelButtonColor: COLOR_DARK,
                confirmButtonText: "Sí, salir",
                cancelButtonText: "Cancelar"
            }).then((result) => {
                if (result.isConfirmed) {
                    localStorage.removeItem("user");
                    navigate("/");
                }
            });
        });
    };

    return (
        <nav
            className="navbar navbar-expand-lg"
            style={{
                background: COLOR_PRIMARY,
                borderBottom: `4px solid ${COLOR_ACCENT}`,
                minHeight: 60,
            }}
        >
            <div className="container-fluid">
                <span
                    className="navbar-brand d-flex align-items-center"
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate("/")}
                >
                    <img
                        src={Logo}
                        alt="Logo"
                        width="40"
                        height="40"
                        className="d-inline-block align-top me-2"
                        style={{
                            background: "#fff",
                            borderRadius: "50%",
                            border: `2px solid ${COLOR_ACCENT}`,
                            objectFit: "contain"
                        }}
                    />
                    <span style={{ color: "#fff", fontWeight: "bold", fontSize: 20, marginRight: 12 }}>
                        TEA Diagnóstico
                    </span>
                    <button
                        className="btn btn-sm"
                        style={{
                            background: COLOR_DARK,
                            color: "#fff",
                            fontWeight: "bold",
                            marginLeft: 8
                        }}
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate("/home_espe");
                        }}
                    >
                        Home
                    </button>
                </span>
                <div className="d-flex">
                    <button
                        className="btn"
                        style={{
                            background: COLOR_ACCENT,
                            color: "#fff",
                            fontWeight: "bold"
                        }}
                        onClick={handleLogout}
                    >
                        Cerrar sesión
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;