const express = require("express"); 
const {
  login,
  registrar,
  cambiarContrasena,
  listarPacientes, 
  cambiarPasswordConActual, 
  recuperarContrasena
} = require("../controllers/userController");
const authenticateToken = require("../middlewares/auth"); // Importa el middleware

const router = express.Router(); 

// Rutas de usuario
router.post("/login", login);
router.post("/registrar",authenticateToken, registrar);
router.post("/cambiar-contrasena", authenticateToken, cambiarContrasena);
router.get('/pacientes',authenticateToken, listarPacientes);
router.put('/cambiar-password',authenticateToken, cambiarPasswordConActual);
router.post("/recuperar-contrasena", recuperarContrasena);

module.exports = router;
