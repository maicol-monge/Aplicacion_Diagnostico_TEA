const express = require("express"); 

const {
  buscarEspecialistaPorUsuario,
  aceptarConsentimientoEspecialista,
} = require("../controllers/especialistaController");
const authenticateToken = require("../middlewares/auth"); // Importa el middleware

const router = express.Router(); 

// Rutas de paciente
router.get("/buscar-espe/:id_usuario",authenticateToken, buscarEspecialistaPorUsuario);
router.post("/aceptar-consentimiento", authenticateToken, aceptarConsentimientoEspecialista);

module.exports = router;