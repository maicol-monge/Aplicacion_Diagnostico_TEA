const express = require("express");
const {
    listarTestsPorPaciente,
    obtenerResumenEvaluacion,
    guardarDiagnostico,
    resumenUltimoTestPorPaciente,
    listarTestsConDiagnosticoPorPaciente,
    generarPdfAdir,
    obtenerPreguntasAdir,
    crearTestAdir,
    obtenerPreguntasConRespuestas,
    obtenerCodigosPorPregunta,
    guardarRespuestaAdir, // <--- usa la función singular
    obtenerIdPacientePorAdir,
    determinarYActualizarTipoSujeto,
    obtenerFechaEntrevistaPorAdir, // <-- nueva función para obtener la fecha de la entrevista
    guardarDiagnosticoFinal

} = require("../controllers/adirController");
const authenticateToken = require("../middlewares/auth"); // Usa el mismo middleware que en pacienteRoutes.js

const router = express.Router();

// Aplica autenticación JWT a todas las rutas
router.get("/listar/:id_paciente", authenticateToken, listarTestsPorPaciente);
router.get("/resumen/:id_adir", authenticateToken, obtenerResumenEvaluacion);
router.put("/diagnostico/:id_adir", authenticateToken, guardarDiagnostico);
router.get("/resumen-ultimo/:id_paciente", authenticateToken, resumenUltimoTestPorPaciente);
router.get("/listar-con-diagnostico/:id_paciente", authenticateToken, listarTestsConDiagnosticoPorPaciente);
router.get("/pdf/:id_adir", authenticateToken, generarPdfAdir); // <-- nueva ruta para generar PDF
router.get("/preguntas", authenticateToken, obtenerPreguntasAdir);
router.post("/crear-test", authenticateToken, crearTestAdir);
router.get("/preguntas-con-respuestas/:id_adir", authenticateToken, obtenerPreguntasConRespuestas);
router.get("/codigos-por-pregunta", authenticateToken, obtenerCodigosPorPregunta);
router.post("/guardar-respuesta", authenticateToken, guardarRespuestaAdir);
router.get("/id-paciente/:id_adir", authenticateToken, obtenerIdPacientePorAdir);
router.put("/determinar-tipo-sujeto/:id_adir", authenticateToken, determinarYActualizarTipoSujeto);
router.get("/fecha-entrevista/:id_adir", authenticateToken, obtenerFechaEntrevistaPorAdir); // <-- nueva ruta para obtener la fecha de la entrevista
router.put("/guardar-diagnostico-final/:id_adir", authenticateToken, guardarDiagnosticoFinal);


module.exports = router;