import LoginForm from "../../components/LoginForm";

// import Logo from "../../assets/images/imgpng.png";

const LoginPage = () => {
    return (
        <div className="min-vh-100 p-5" style={{ background: "#000" }}>
            <section>
            </section>
            <h2 className="text-center text-light mb-3">APLICACIÓN PARA LA EVALUACIÓN DE PERSONAS CON TRASTORNO DEL
                ESPECTRO AUTISTA (TEA)
            </h2>
            <div className="text-light border-b-3">
                <LoginForm />
            </div>
        </div>
    );
};

export default LoginPage;
