const express = require("express");
const {
    listarTestsPorPaciente,
    obtenerResumenEvaluacion,
    guardarDiagnostico,
    resumenUltimoTestPorPaciente
} = require("../controllers/adirController");
const authenticateToken = require("../middlewares/auth"); // Usa el mismo middleware que en pacienteRoutes.js

const router = express.Router();

// Aplica autenticación JWT a todas las rutas
router.get("/listar/:id_paciente", authenticateToken, listarTestsPorPaciente);
router.get("/resumen/:id_adir", authenticateToken, obtenerResumenEvaluacion);
router.put("/diagnostico/:id_adir", authenticateToken, guardarDiagnostico);
router.get("/resumen-ultimo/:id_paciente", authenticateToken, resumenUltimoTestPorPaciente);

module.exports = router;