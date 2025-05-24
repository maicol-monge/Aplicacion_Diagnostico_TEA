import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar_paciente";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const COLOR_PRIMARY = "#457b9d";

const EvaluacionAdir = () => {
    const [preguntas, setPreguntas] = useState([]);
    const [respuestas, setRespuestas] = useState({});
    const [observaciones, setObservaciones] = useState({});
    const [loading, setLoading] = useState(true);
    const [enviando, setEnviando] = useState(false);
    const [aceptaAdvertencia, setAceptaAdvertencia] = useState(false);
    const [edadValida, setEdadValida] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Obtener preguntas ADI-R
        axios.get("http://localhost:5000/api/adir/preguntas", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        })
            .then(res => {
                setPreguntas(res.data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    useEffect(() => {
        // Obtener edad del paciente
        const user = JSON.parse(localStorage.getItem("user"));
        if (user && user.fecha_nacimiento) {
            const nacimiento = new Date(user.fecha_nacimiento);
            const hoy = new Date();
            let edad = hoy.getFullYear() - nacimiento.getFullYear();
            const m = hoy.getMonth() - nacimiento.getMonth();
            if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
                edad--;
            }
            setEdadValida(edad >= 2);
        }
    }, []);

    const handleRespuesta = (id_pregunta, valor) => {
        setRespuestas({ ...respuestas, [id_pregunta]: valor });
    };

    const handleObservacion = (id_pregunta, texto) => {
        setObservaciones({ ...observaciones, [id_pregunta]: texto });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await Swal.fire({
            title: "¿Está seguro de finalizar la evaluación?",
            text: "Una vez finalizada no podrá modificar sus respuestas.",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Sí, finalizar",
            cancelButtonText: "No"
        });
        if (!result.isConfirmed) {
            setEnviando(false);
            return;
        }
        setEnviando(true);
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            // 1. Obtener id_paciente usando el método del controller
            const { data: pacienteData } = await axios.get(
                `http://localhost:5000/api/pacientes/buscar-paciente/${user.id_usuario}`,
                { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
            );
            const id_paciente = pacienteData.paciente.id_paciente;

            // 2. Crear test_adi_r
            const { data: test } = await axios.post(
                "http://localhost:5000/api/adir/crear-test",
                { id_paciente },
                { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
            );
            // 3. Guardar respuestas
            await axios.post(
                `http://localhost:5000/api/adir/guardar-respuestas/${test.id_adir}`,
                { respuestas, observaciones },
                { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
            );
            await Swal.fire({
                icon: "success",
                title: "¡Evaluación enviada correctamente!",
                confirmButtonText: "Ver resultados"
            });
            navigate("/home_paciente");
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Error al enviar la evaluación",
                text: "Por favor, inténtalo de nuevo más tarde."
            });
        }
        setEnviando(false);
    };

    // Opciones por rango de preguntas
    const opcionesPorRango = [
        // A. Comienzo de los síntomas
        {
            rango: [1, 4],
            opciones: [
                { value: 991, label: "Sin preocupaciones" },
                { value: 992, label: "Preocupación desde el nacimiento" },
                { value: 996, label: "No recuerda, pero antes de los 3 años" },
                { value: 997, label: "No recuerda, pero a los 3 años o más tarde" },
                { value: 998, label: "No recuerda" },
                { value: 999, label: "No se preguntó" }
            ]
        },
        // B. Desarrollo temprano y habilidades motoras
        {
            rango: [5, 5],
            opciones: [
                { value: 995, label: "Nunca caminó" },
                { value: 996, label: "No recuerda" },
                { value: 997, label: "No se preguntó" },
                { value: 998, label: "No aplica" },
                { value: 999, label: "No se preguntó" }
            ]
        },
        {
            rango: [6, 8],
            opciones: [
                { value: 993, label: "Recaída tras continencia" },
                { value: 994, label: "Nunca alcanzado" },
                { value: 995, label: "No recuerda" },
                { value: 996, label: "No se preguntó" },
                { value: 997, label: "No aplica" },
                { value: 998, label: "No se preguntó" },
                { value: 999, label: "No se preguntó" }
            ]
        },
        // C. Lenguaje y comunicación
        {
            rango: [9, 9],
            opciones: [
                { value: 993, label: "No recuerda" },
                { value: 994, label: "No se preguntó" },
                { value: 995, label: "No aplica" },
                { value: 996, label: "No se preguntó" },
                { value: 997, label: "No se preguntó" }
            ]
        },
        {
            rango: [10, 10],
            opciones: [
                { value: 993, label: "No recuerda" },
                { value: 994, label: "No se preguntó" },
                { value: 995, label: "No aplica" },
                { value: 996, label: "No se preguntó" },
                { value: 997, label: "No se preguntó" },
                { value: 998, label: "No se preguntó" },
                { value: 999, label: "No se preguntó" }
            ]
        },
        {
            rango: [11, 11],
            opciones: [
                { value: 0, label: "No" },
                { value: 1, label: "Sí" }
            ]
        },
        {
            rango: [12, 12],
            opciones: [
                { value: 0, label: "≥5 palabras diarias" },
                { value: 1, label: "≤5 palabras" },
                { value: 2, label: "Solo repetición a pedido" },
                { value: 3, label: "Imitación sin uso espontáneo" },
                { value: 8, label: "No hubo pérdida" },
                { value: 9, label: "No se preguntó" }
            ]
        },
        {
            rango: [13, 16],
            opciones: [
                { value: 0, label: "No hay pérdida" },
                { value: 1, label: "Posible pérdida" },
                { value: 2, label: "Pérdida clara" },
                { value: 8, label: "Insuficiente lenguaje" },
                { value: 9, label: "No se preguntó" }
            ]
        },
        {
            rango: [17, 17],
            opciones: [
                { value: 998, label: "No recuerda" },
                { value: 999, label: "No se preguntó" }
            ]
        },
        {
            rango: [18, 18],
            opciones: [
                { value: 0, label: "No asociación" },
                { value: 1, label: "Posible asociación" },
                { value: 2, label: "Asociación clara" },
                { value: 8, label: "No hubo pérdida" },
                { value: 9, label: "No se preguntó" }
            ]
        },
        {
            rango: [19, 19],
            opciones: [
                { value: 993, label: "Aún presente" },
                { value: 994, label: "Progresiva" },
                { value: 998, label: "No recuerda" },
                { value: 999, label: "No se preguntó" }
            ]
        },
        // D. Pérdida de otras habilidades
        {
            rango: [21, 25],
            opciones: [
                { value: 0, label: "No hubo pérdida" },
                { value: 1, label: "Posible pérdida" },
                { value: 2, label: "Pérdida clara" }
            ]
        },
        {
            rango: [26, 26],
            opciones: [
                { value: 998, label: "No recuerda" },
                { value: 999, label: "No se preguntó" }
            ]
        },
        {
            rango: [27, 27],
            opciones: [
                { value: 0, label: "No asociación" },
                { value: 1, label: "Posible asociación" },
                { value: 2, label: "Asociación clara" },
                { value: 8, label: "No hubo pérdida" },
                { value: 9, label: "No se preguntó" }
            ]
        },
        {
            rango: [28, 28],
            opciones: [
                { value: 993, label: "Aún presente" },
                { value: 994, label: "Progresiva" },
                { value: 998, label: "No recuerda" },
                { value: 999, label: "No se preguntó" }
            ]
        },
        // E. Comprensión y uso del lenguaje
        {
            rango: [29, 29],
            opciones: [
                { value: 0, label: "Entiende y actúa en nuevos contextos" },
                { value: 1, label: "Compresión leve" },
                { value: 2, label: "Compresión moderada" },
                { value: 3, label: "Compresión severa" },
                { value: 4, label: "Muy poca o ninguna comprensión" }
            ]
        },
        // F. Lenguaje verbal y social
        {
            rango: [34, 34],
            opciones: [
                { value: 0, label: "Charla social clara" },
                { value: 1, label: "Uso funcional reducido" },
                { value: 2, label: "Solo para necesidades" },
                { value: 8, label: "No aplica" },
                { value: 9, label: "No se preguntó" }
            ]
        },
        {
            rango: [35, 35],
            opciones: [
                { value: 0, label: "Fluidez y reciprocidad clara" },
                { value: 1, label: "Iniciativa reducida" },
                { value: 2, label: "Respuesta verbal reducida" },
                { value: 3, label: "Sin iniciativa ni respuesta" },
                { value: 8, label: "No aplica" },
                { value: 9, label: "No se preguntó" }
            ]
        },
        // G. Conductas de comunicación no verbal y social
        {
            rango: [42, 42],
            opciones: [
                { value: 0, label: "Normal" },
                { value: 1, label: "Leve alteración" },
                { value: 2, label: "Alteración clara" },
                { value: 8, label: "No aplica" },
                { value: 9, label: "No se preguntó" }
            ]
        },
        {
            rango: [45, 45],
            opciones: [
                { value: 0, label: "Normal" },
                { value: 1, label: "Leve alteración" },
                { value: 2, label: "Alteración clara" },
                { value: 3, label: "Ausente" },
                { value: 8, label: "No aplica" },
                { value: 9, label: "No se preguntó" }
            ]
        },
        {
            rango: [50, 50],
            opciones: [
                { value: 0, label: "Normal" },
                { value: 1, label: "Leve alteración" },
                { value: 2, label: "Alteración clara" },
                { value: 3, label: "Ausente" },
                { value: 8, label: "No aplica" },
                { value: 9, label: "No se preguntó" }
            ]
        },
        {
            rango: [54, 54],
            opciones: [
                { value: 0, label: "Normal" },
                { value: 1, label: "Leve alteración" },
                { value: 2, label: "Alteración clara" },
                { value: 8, label: "No aplica" },
                { value: 9, label: "No se preguntó" }
            ]
        },
        {
            rango: [55, 56],
            opciones: [
                { value: 0, label: "Normal" },
                { value: 1, label: "Leve alteración" },
                { value: 2, label: "Alteración clara" },
                { value: 3, label: "Ausente" },
                { value: 8, label: "No aplica" },
                { value: 9, label: "No se preguntó" }
            ]
        },
        {
            rango: [57, 57],
            opciones: [
                { value: 0, label: "Normal" },
                { value: 1, label: "Leve alteración" },
                { value: 2, label: "Alteración clara" },
                { value: 3, label: "Ausente" },
                { value: 8, label: "No aplica" },
                { value: 9, label: "No se preguntó" }
            ]
        },
        {
            rango: [60, 60],
            opciones: [
                { value: 0, label: "Normal" },
                { value: 1, label: "Leve alteración" },
                { value: 2, label: "Alteración clara" },
                { value: 3, label: "Ausente" },
                { value: 8, label: "No aplica" },
                { value: 9, label: "No se preguntó" }
            ]
        },
        {
            rango: [63, 63],
            opciones: [
                { value: 0, label: "Normal" },
                { value: 1, label: "Leve alteración" },
                { value: 2, label: "Alteración clara" },
                { value: 8, label: "No aplica" },
                { value: 9, label: "No se preguntó" }
            ]
        }
    ];

    // Opciones por defecto
    const opcionesDefault = [
        { value: 0, label: "0" },
        { value: 1, label: "1" },
        { value: 2, label: "2" },
        { value: 3, label: "3" }
    ];

    // Función para obtener las opciones según el id_pregunta
    function getOpciones(pregunta) {
        const texto = pregunta.toLowerCase();

        // A. Comienzo de los síntomas
        if (texto.includes("¿a qué edad se notaron por primera vez los síntomas?")) {
            return [
                { value: 991, label: "Sin preocupaciones" },
                { value: 992, label: "Preocupación desde el nacimiento" },
                { value: 996, label: "No recuerda, pero antes de los 3 años" },
                { value: 997, label: "No recuerda, pero a los 3 años o más tarde" },
                { value: 998, label: "No recuerda" },
                { value: 999, label: "No se preguntó" }
            ];
        }
        if (texto.includes("juicio del cuidador")) {
            return [
                { value: 0, label: "0 (Según rango de edad en que aparecieron los problemas)" },
                { value: 1, label: "1" },
                { value: 2, label: "2" },
                { value: 3, label: "3" },
                { value: 4, label: "4" },
                { value: 5, label: "5" },
                { value: 6, label: "6" },
                { value: 7, label: "7 (Siempre fue distinto, pero sin percibirse como anormal)" }
            ];
        }

        // B. Desarrollo temprano y habilidades motoras
        if (texto.includes("¿a qué edad caminó sin ayuda?")) {
            return [
                { value: 995, label: "Nunca caminó" },
                { value: 996, label: "No recuerda" },
                { value: 997, label: "No se preguntó" },
                { value: 998, label: "No aplica" },
                { value: 999, label: "No se preguntó" }
            ];
        }
        if (texto.includes("¿tuvo control de esfínteres durante el día?") || texto.includes("¿tuvo control de esfínteres durante la noche?")) {
            return [
                { value: 993, label: "Recaída tras continencia" },
                { value: 994, label: "Nunca alcanzado" },
                { value: 995, label: "No recuerda" },
                { value: 996, label: "No se preguntó" },
                { value: 997, label: "No aplica" },
                { value: 998, label: "No se preguntó" },
                { value: 999, label: "No se preguntó" }
            ];
        }

        // C. Lenguaje y comunicación
        if (texto.includes("¿edad de las primeras palabras?")) {
            return [
                { value: 993, label: "No recuerda" },
                { value: 994, label: "No se preguntó" },
                { value: 995, label: "No aplica" },
                { value: 996, label: "No se preguntó" },
                { value: 997, label: "No se preguntó" }
            ];
        }
        if (texto.includes("¿edad de las primeras frases?")) {
            return [
                { value: 993, label: "No recuerda" },
                { value: 994, label: "No se preguntó" },
                { value: 995, label: "No aplica" },
                { value: 996, label: "No se preguntó" },
                { value: 997, label: "No se preguntó" },
                { value: 998, label: "No se preguntó" },
                { value: 999, label: "No se preguntó" }
            ];
        }
        if (texto.includes("¿perdió el lenguaje alguna vez?")) {
            return [
                { value: 0, label: "No" },
                { value: 1, label: "Sí" }
            ];
        }
        if (texto.includes("¿nivel de lenguaje antes de la pérdida?")) {
            return [
                { value: 0, label: "≥5 palabras diarias" },
                { value: 1, label: "≤5 palabras" },
                { value: 2, label: "Solo repetición a pedido" },
                { value: 3, label: "Imitación sin uso espontáneo" },
                { value: 8, label: "No hubo pérdida" },
                { value: 9, label: "No se preguntó" }
            ];
        }
        if (texto.includes("¿qué habilidades lingüísticas se perdieron?")) {
            return [
                { value: 0, label: "No hay pérdida" },
                { value: 1, label: "Posible pérdida" },
                { value: 2, label: "Pérdida clara" },
                { value: 8, label: "Insuficiente lenguaje" },
                { value: 9, label: "No se preguntó" }
            ];
        }
        if (texto.includes("¿edad de la pérdida del lenguaje?")) {
            return [
                { value: 998, label: "No recuerda" },
                { value: 999, label: "No se preguntó" }
            ];
        }
        if (texto.includes("¿hubo una enfermedad asociada?")) {
            return [
                { value: 0, label: "No asociación" },
                { value: 1, label: "Posible asociación" },
                { value: 2, label: "Asociación clara" },
                { value: 8, label: "No hubo pérdida" },
                { value: 9, label: "No se preguntó" }
            ];
        }
        if (texto.includes("¿duración de la pérdida del lenguaje?")) {
            return [
                { value: 993, label: "Aún presente" },
                { value: 994, label: "Progresiva" },
                { value: 998, label: "No recuerda" },
                { value: 999, label: "No se preguntó" }
            ];
        }

        // D. Pérdida de otras habilidades
        if (texto.includes("¿perdió habilidades motoras como marcha o movimiento voluntario?")) {
            return [
                { value: 0, label: "No hubo pérdida" },
                { value: 1, label: "Posible pérdida" },
                { value: 2, label: "Pérdida clara" }
            ];
        }
        if (texto.includes("¿edad de la pérdida motora?")) {
            return [
                { value: 998, label: "No recuerda" },
                { value: 999, label: "No se preguntó" }
            ];
        }
        if (texto.includes("¿la pérdida motora estuvo asociada a enfermedad física?")) {
            return [
                { value: 0, label: "No asociación" },
                { value: 1, label: "Posible asociación" },
                { value: 2, label: "Asociación clara" },
                { value: 8, label: "No hubo pérdida" },
                { value: 9, label: "No se preguntó" }
            ];
        }
        if (texto.includes("¿duración de la pérdida motora?")) {
            return [
                { value: 993, label: "Aún presente" },
                { value: 994, label: "Progresiva" },
                { value: 998, label: "No recuerda" },
                { value: 999, label: "No se preguntó" }
            ];
        }

        // E. Comprensión y uso del lenguaje
        if (texto.includes("¿comprende órdenes verbales sin gestos?")) {
            return [
                { value: 0, label: "Entiende y actúa en nuevos contextos" },
                { value: 1, label: "Compresión leve" },
                { value: 2, label: "Compresión moderada" },
                { value: 3, label: "Compresión severa" },
                { value: 4, label: "Muy poca o ninguna comprensión" }
            ];
        }

        // F. Lenguaje verbal y social
        if (texto.includes("¿usa el lenguaje con fines sociales?")) {
            return [
                { value: 0, label: "Charla social clara" },
                { value: 1, label: "Uso funcional reducido" },
                { value: 2, label: "Solo para necesidades" },
                { value: 8, label: "No aplica" },
                { value: 9, label: "No se preguntó" }
            ];
        }
        if (texto.includes("¿participa en conversaciones recíprocas?")) {
            return [
                { value: 0, label: "Fluidez y reciprocidad clara" },
                { value: 1, label: "Iniciativa reducida" },
                { value: 2, label: "Respuesta verbal reducida" },
                { value: 3, label: "Sin iniciativa ni respuesta" },
                { value: 8, label: "No aplica" },
                { value: 9, label: "No se preguntó" }
            ];
        }

        // G. Conductas de comunicación no verbal y social
        if (texto.includes("¿señala para compartir interés?")) {
            return [
                { value: 0, label: "Normal" },
                { value: 1, label: "Leve alteración" },
                { value: 2, label: "Alteración clara" },
                { value: 8, label: "No aplica" },
                { value: 9, label: "No se preguntó" }
            ];
        }
        if (texto.includes("¿usa gestos comunes para comunicarse?") ||
            texto.includes("¿hace contacto visual directo?") ||
            texto.includes("¿ofrece consuelo a los demás?") ||
            texto.includes("¿cómo es la calidad de sus acercamientos sociales?") ||
            texto.includes("¿varía sus expresiones faciales?") ||
            texto.includes("¿inicia actividades adecuadas?")) {
            return [
                { value: 0, label: "Normal" },
                { value: 1, label: "Leve alteración" },
                { value: 2, label: "Alteración clara" },
                { value: 3, label: "Ausente" },
                { value: 8, label: "No aplica" },
                { value: 9, label: "No se preguntó" }
            ];
        }
        if (texto.includes("¿comparte emociones positivas?") ||
            texto.includes("¿responde a otros niños?")) {
            return [
                { value: 0, label: "Normal" },
                { value: 1, label: "Leve alteración" },
                { value: 2, label: "Alteración clara" },
                { value: 8, label: "No aplica" },
                { value: 9, label: "No se preguntó" }
            ];
        }

        // Por defecto
        return [
            { value: 0, label: "0" },
            { value: 1, label: "1" },
            { value: 2, label: "2" },
            { value: 3, label: "3" }
        ];
    }

    if (loading) return <div>Cargando preguntas...</div>;

    if (edadValida === false) {
        return (
            <div className="d-flex flex-column min-vh-100" style={{ background: "#f1faee" }}>
                <Navbar />
                <div className="container py-5 flex-grow-1">
                    <h2 className="mb-4" style={{ color: COLOR_PRIMARY, fontWeight: "bold" }}>
                        Evaluación ADI-R
                    </h2>
                    <div className="alert alert-danger">
                        Esta evaluación solo es válida para pacientes de 2 años o más.
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (!aceptaAdvertencia) {
        return (
            <div className="d-flex flex-column min-vh-100" style={{ background: "#f1faee" }}>
                <Navbar />
                <div className="container py-5 flex-grow-1">
                    <h2 className="mb-4" style={{ color: COLOR_PRIMARY, fontWeight: "bold" }}>
                        Evaluación ADI-R
                    </h2>
                    <div className="alert alert-warning">
                        <b>Advertencia:</b> Esta evaluación es una herramienta de apoyo y no reemplaza el diagnóstico profesional. Los resultados pueden variar según la información proporcionada y la interpretación clínica. Si tiene dudas, consulte a un especialista.
                    </div>
                    <button
                        className="btn btn-warning"
                        onClick={() => setAceptaAdvertencia(true)}
                    >
                        Entiendo y deseo continuar
                    </button>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="d-flex flex-column min-vh-100" style={{ background: "#f1faee" }}>
            <Navbar />
            <div className="container py-5 flex-grow-1">
                <h2 className="mb-4" style={{ color: COLOR_PRIMARY, fontWeight: "bold" }}>
                    Evaluación ADI-R
                </h2>
                <form onSubmit={handleSubmit}>
                    {preguntas.map(p => {
                        const opciones = getOpciones(p.pregunta); // <-- usa el texto, no el id
                        return (
                            <div key={p.id_pregunta} className="mb-4">
                                <div style={{ fontWeight: "bold" }}>{p.pregunta}</div>
                                <div className="mt-2">
                                    {opciones.map(opt => (
                                        <label key={opt.value} className="me-3">
                                            <input
                                                type="radio"
                                                name={`respuesta_${p.id_pregunta}`}
                                                value={opt.value}
                                                checked={respuestas[p.id_pregunta] === opt.value}
                                                onChange={() => handleRespuesta(p.id_pregunta, opt.value)}
                                                required
                                            />{" "}
                                            {opt.label}
                                        </label>
                                    ))}
                                </div>
                                <input
                                    type="text"
                                    className="form-control mt-2"
                                    placeholder="Observación (obligatoria)"
                                    value={observaciones[p.id_pregunta] || ""}
                                    onChange={e => handleObservacion(p.id_pregunta, e.target.value)}
                                    required
                                />
                            </div>
                        );
                    })}
                    <button
                        className="btn btn-primary"
                        type="submit"
                        disabled={enviando}
                        style={{ background: COLOR_PRIMARY, border: "none" }}
                    >
                        {enviando ? "Enviando..." : "Enviar evaluación"}
                    </button>
                    <button
                        className="btn btn-secondary ms-2"
                        type="button"
                        onClick={async () => {
                            const result = await Swal.fire({
                                title: "¿Está seguro de cancelar?",
                                text: "Se perderán las respuestas ingresadas.",
                                icon: "warning",
                                showCancelButton: true,
                                confirmButtonText: "Sí, cancelar",
                                cancelButtonText: "No"
                            });
                            if (result.isConfirmed) {
                                navigate("/home_paciente");
                            }
                        }}
                    >
                        Cancelar
                    </button>
                </form>
            </div>
            <Footer />
        </div>
    );
};

export default EvaluacionAdir;