const express = require("express");
const { 
    listarPacientesConAdos, 
    listarTestsAdosPorPaciente, 
    listarActividadesPorModulo,
    crearTestAdos,
    guardarActividadRealizada,
    pausarTestAdos,
    buscarTestPausado,
    obtenerActividadesRealizadas,
    responderItem,
    codificacionesPorAlgoritmo,
    puntuacionesPorCodificacion,
    responderCodificacion,
    obtenerPacientePorId,
    codificacionPorId,
    obtenerAlgoritmoPorId,
    respuestasAlgoritmo,
    obtenerTestPorId,
    obtenerAlgoritmoPorTest,
    puntuacionesAplicadasPorTest,
    actualizarClasificacion,
    actualizarPuntuacionComparativa,
    actualizarDiagnostico,
    obtenerActividadesPorTest,
    obtenerGrupoPorCodificacion,
    obtenerDatosReporteModuloT,
    obtenerDatosReporteModulo1,
    obtenerDatosReporteModulo3,
    obtenerDatosReporteModulo2,
    obtenerDatosReporteModulo4,
    validarFiltrosPaciente
} = require("../controllers/adosController");
const authenticateToken = require("../middlewares/auth");

const router = express.Router();

router.get("/pacientes", authenticateToken, listarPacientesConAdos);
router.get("/tests/:id_paciente", authenticateToken, listarTestsAdosPorPaciente);
router.get("/actividades/:modulo", authenticateToken, listarActividadesPorModulo);
router.post("/crear", authenticateToken, crearTestAdos);
router.post("/actividad-realizada", authenticateToken, guardarActividadRealizada);
router.put("/pausar/:id_ados", authenticateToken, pausarTestAdos);
router.get("/test-pausado", authenticateToken, buscarTestPausado);
router.get("/actividades-realizadas/:id_ados", authenticateToken, obtenerActividadesRealizadas);
router.post("/responder-item", authenticateToken, responderItem);
router.get("/codificaciones-algoritmo/:id_algoritmo", authenticateToken, codificacionesPorAlgoritmo);
router.get("/puntuaciones-codificacion/:id_codificacion", authenticateToken, puntuacionesPorCodificacion);
router.post("/responder-codificacion", authenticateToken, responderCodificacion);
router.get("/paciente/:id_paciente", authenticateToken, obtenerPacientePorId);
router.get("/codificacion/:id_codificacion", authenticateToken, codificacionPorId);
router.get("/algoritmo/:id_algoritmo", authenticateToken, obtenerAlgoritmoPorId);
router.get("/respuestas-algoritmo/:id_ados", authenticateToken, respuestasAlgoritmo);
router.get("/test/:id_ados", authenticateToken, obtenerTestPorId);
router.get("/algoritmo-por-test/:id_ados", authenticateToken, obtenerAlgoritmoPorTest);
router.get("/puntuaciones-aplicadas/:id_ados", authenticateToken, puntuacionesAplicadasPorTest);
router.put("/clasificacion/:id_ados", authenticateToken, actualizarClasificacion);
router.put("/puntuacion-comparativa/:id_ados", authenticateToken, actualizarPuntuacionComparativa);
router.put("/diagnostico/:id_ados", authenticateToken, actualizarDiagnostico);
router.get("/actividades-por-test/:id_ados", authenticateToken, obtenerActividadesPorTest);
router.get("/grupo-codificacion/:id_codificacion", authenticateToken, obtenerGrupoPorCodificacion);
router.get("/reporte-modulo-t/:id_ados", authenticateToken, obtenerDatosReporteModuloT);
router.get("/reporte-modulo-1/:id_ados", authenticateToken, obtenerDatosReporteModulo1);
router.get("/reporte-modulo-3/:id_ados", authenticateToken, obtenerDatosReporteModulo3);
router.get("/reporte-modulo-2/:id_ados", authenticateToken, obtenerDatosReporteModulo2);
router.get("/reporte-modulo-4/:id_ados", authenticateToken, obtenerDatosReporteModulo4);
router.get("/validar-filtros/:id_paciente", authenticateToken, validarFiltrosPaciente);

module.exports = router;