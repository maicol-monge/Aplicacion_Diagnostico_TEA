const express = require("express"); 

const {
  buscarEspecialistaPorUsuario,
  aceptarConsentimientoEspecialista,
  pacientesConTests, // <-- Agrega esto
} = require("../controllers/especialistaController");
const authenticateToken = require("../middlewares/auth"); // Importa el middleware

const router = express.Router(); 

// Rutas de paciente
router.get("/buscar-espe/:id_usuario", authenticateToken, buscarEspecialistaPorUsuario);
router.post("/aceptar-consentimiento", authenticateToken, aceptarConsentimientoEspecialista);

// Nueva ruta para reportes de pacientes con tests
router.get("/reportes/pacientes-con-tests", authenticateToken, pacientesConTests);

module.exports = router;