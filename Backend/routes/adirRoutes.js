const express = require('express');
const router = express.Router();
const {
    listarTestsPorPaciente,
    obtenerResumenEvaluacion,
    guardarDiagnostico,
    resumenUltimoTestPorPaciente
} = require('../controllers/adirController');

router.get('/paciente/:id_paciente', listarTestsPorPaciente);
router.get('/:id_adir', obtenerResumenEvaluacion);
router.put('/:id_adir/diagnostico', guardarDiagnostico);
router.get('/resumen-ultimo/:id_paciente', resumenUltimoTestPorPaciente);

module.exports = router;