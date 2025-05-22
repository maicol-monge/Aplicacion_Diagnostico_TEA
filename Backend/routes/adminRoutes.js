const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const authenticateToken = require("../middlewares/auth");

// Todas las rutas requieren autenticación y privilegio 3 (admin)
router.use(authenticateToken, (req, res, next) => {
    if (req.user.privilegio !== 3) return res.status(403).json({ message: "No autorizado" });
    next();
});

// Usuarios
router.get("/usuarios", adminController.getUsuarios);
router.post("/usuarios", adminController.createUsuario);
router.put("/usuarios/:id_usuario", adminController.updateUsuario);
router.delete("/usuarios/:id_usuario", adminController.deleteUsuario);

// Pacientes
router.get("/pacientes", adminController.getPacientes);
router.post("/pacientes", adminController.createPaciente);
router.put("/pacientes/:id_paciente", adminController.updatePaciente);
router.delete("/pacientes/:id_paciente", adminController.deletePaciente);

// Especialistas
router.get("/especialistas", adminController.getEspecialistas);
router.post("/especialistas", adminController.createEspecialista);
router.put("/especialistas/:id_especialista", adminController.updateEspecialista);
router.delete("/especialistas/:id_especialista", adminController.deleteEspecialista);

// Áreas
router.get("/areas", adminController.getAreas);
router.post("/areas", adminController.createArea);
router.put("/areas/:id_area", adminController.updateArea);
router.delete("/areas/:id_area", adminController.deleteArea);

// Preguntas ADI
router.get("/preguntas", adminController.getPreguntas);
router.post("/preguntas", adminController.createPregunta);
router.put("/preguntas/:id_pregunta", adminController.updatePregunta);
router.delete("/preguntas/:id_pregunta", adminController.deletePregunta);

// Actividades ADOS
router.get("/actividades", adminController.getActividades);
router.post("/actividades", adminController.createActividad);
router.put("/actividades/:id_actividad", adminController.updateActividad);
router.delete("/actividades/:id_actividad", adminController.deleteActividad);

// Tests ADI-R
router.get("/tests-adir", adminController.getTestsAdiR);
router.put("/tests-adir/:id_adir", adminController.updateTestAdiR);
router.delete("/tests-adir/:id_adir", adminController.deleteTestAdiR);

// Tests ADOS-2
router.get("/tests-ados", adminController.getTestsAdos2);
router.put("/tests-ados/:id_ados", adminController.updateTestAdos2);
router.delete("/tests-ados/:id_ados", adminController.deleteTestAdos2);

module.exports = router;