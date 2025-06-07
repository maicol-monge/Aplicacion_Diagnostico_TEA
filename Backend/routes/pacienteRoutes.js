const express = require("express"); 

const {
  buscarPacientePorUsuario,
  aceptarConsentimiento,
  guardarDsm5,
  validarTerminos,
  desactivarCuenta,
  listarResultadosPaciente // <-- Agrega esto
} = require("../controllers/pacienteController");
const authenticateToken = require("../middlewares/auth"); // Importa el middleware

const router = express.Router(); 

// Rutas de paciente
router.get("/buscar-paciente/:id_usuario",authenticateToken, buscarPacientePorUsuario);
router.post("/aceptar-consentimiento", authenticateToken, aceptarConsentimiento);
router.post("/guardar-dsm5", authenticateToken, guardarDsm5);
router.get("/validar-terminos/:id_usuario", authenticateToken, validarTerminos);
router.put('/desactivar/:id_usuario', authenticateToken, desactivarCuenta);

// Nueva ruta para listar resultados de ambos tests
router.get("/resultados/:id_paciente", authenticateToken, listarResultadosPaciente);

module.exports = router;