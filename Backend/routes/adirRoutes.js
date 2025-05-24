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
    guardarRespuestasAdir

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
router.post("/guardar-respuestas/:id_adir", authenticateToken, guardarRespuestasAdir);


module.exports = router;