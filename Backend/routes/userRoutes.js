const express = require("express"); 

const {
  login,
  registrar,
  cambiarContrasena,
} = require("../controllers/userController");

const router = express.Router(); 

// Rutas de usuario
router.post("/login", login);
router.post("/registrar", registrar);
router.post("/cambiar-contrasena", cambiarContrasena);
module.exports = router;
