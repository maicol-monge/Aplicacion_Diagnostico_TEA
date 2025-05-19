const express = require("express"); 
const {
  login,
  registrar,
  cambiarContrasena,
} = require("../controllers/userController");
const authenticateToken = require("../middlewares/auth"); // Importa el middleware

const router = express.Router(); 

// Rutas de usuario
router.post("/login", login);
router.post("/registrar",authenticateToken, registrar);
router.post("/cambiar-contrasena", authenticateToken, cambiarContrasena);

module.exports = router;
