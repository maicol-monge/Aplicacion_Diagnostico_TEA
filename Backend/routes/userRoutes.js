const express = require("express"); //Crear el server para dar rutas

const {
  login,
  registrar,
} = require("../controllers/userController");

const router = express.Router(); // Crear un enrutador y para definir las rutas

// Rutas de usuario
router.post("/login", login);
router.post("/registrar", registrar);
module.exports = router;
