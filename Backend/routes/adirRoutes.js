const express = require("express");
const {
    listarTestsPorPaciente,
    obtenerResumenEvaluacion,
    guardarDiagnostico,
    resumenUltimoTestPorPaciente,
    obtenerPreguntasTestCompleto,
    crearTestAdirConRespuestas // <-- Agrega esto
} = require("../controllers/adirController");
const authenticateToken = require("../middlewares/auth"); // Usa el mismo middleware que en pacienteRoutes.js

const router = express.Router();

// Aplica autenticación JWT a todas las rutas
router.get("/listar/:id_paciente", authenticateToken, listarTestsPorPaciente);
router.get("/resumen/:id_adir", authenticateToken, obtenerResumenEvaluacion);
router.put("/diagnostico/:id_adir", authenticateToken, guardarDiagnostico);
router.get("/resumen-ultimo/:id_paciente", authenticateToken, resumenUltimoTestPorPaciente);
router.get("/preguntas-test", authenticateToken, obtenerPreguntasTestCompleto);
router.post("/crear-con-respuestas", authenticateToken, crearTestAdirConRespuestas); // <-- Nueva ruta para crear test ADIR con respuestas

module.exports = router;