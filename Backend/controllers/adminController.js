const db = require("../config/db");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

// ========== USUARIOS ==========
exports.getUsuarios = (req, res) => {
    db.query("SELECT * FROM usuario", (err, results) => {
        if (err) return res.status(500).json({ message: "Error al obtener usuarios", error: err });
        res.json(results);
    });
};

exports.createUsuario = async (req, res) => {
    const { nombres, apellidos, direccion, telefono, correo, contrasena, privilegio, imagen } = req.body;
    const hash = await bcrypt.hash(contrasena, 10);
    db.query(
        "INSERT INTO usuario (nombres, apellidos, direccion, telefono, correo, contrasena, requiere_cambio_contrasena, privilegio, imagen, estado) VALUES (?, ?, ?, ?, ?, ?, 1, ?, ?, 1)",
        [nombres, apellidos, direccion, telefono, correo, hash, privilegio, imagen],
        (err, result) => {
            if (err) return res.status(500).json({ message: "Error al crear usuario", error: err });
            res.json({ id_usuario: result.insertId });
        }
    );
};

exports.updateUsuario = (req, res) => {
    const { id_usuario } = req.params;
    const { nombres, apellidos, direccion, telefono, correo, privilegio, imagen, estado } = req.body;

    // Primero, obtener el estado actual del usuario
    db.query("SELECT estado, correo FROM usuario WHERE id_usuario=?", [id_usuario], (err, results) => {
        if (err) return res.status(500).json({ message: "Error al obtener usuario", error: err });
        if (results.length === 0) return res.status(404).json({ message: "Usuario no encontrado" });

        const estadoActual = results[0].estado;
        const correoUsuario = results[0].correo;

        // Actualizar usuario
        db.query(
            "UPDATE usuario SET nombres=?, apellidos=?, direccion=?, telefono=?, correo=?, privilegio=?, imagen=?, estado=? WHERE id_usuario=?",
            [nombres, apellidos, direccion, telefono, correo, privilegio, imagen, estado, id_usuario],
            (err) => {
                if (err) return res.status(500).json({ message: "Error al actualizar usuario", error: err });

                // Si el estado cambió de 0 a 1, enviar correo de reactivación
                if (parseInt(estadoActual) === 0 && parseInt(estado) === 1) {
                    const transporter = nodemailer.createTransport({
                        service: "gmail",
                        auth: {
                            user: process.env.GMAIL_USER,
                            pass: process.env.GMAIL_PASS
                        }
                    });

                    const mailOptions = {
                        from: 'aplicaciondediagnosticodetea@gmail.com',
                        to: correoUsuario,
                        subject: "Cuenta reactivada",
                        text:
                            `Hola ${nombres} ${apellidos},\n\n` +
                            "Tu cuenta ha sido reactivada exitosamente. Ya puedes ingresar nuevamente al sistema.\n\n" +
                            "Si tú no solicitaste la reactivación de tu cuenta, por favor ponte en contacto con soporte técnico o el administrador escribiendo a aplicaciondediagnosticodetea@gmail.com.\n\n" +
                            "Saludos,\nEquipo de Diagnóstico TEA"
                    };

                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            // No detenemos el flujo si falla el correo, solo avisamos
                            return res.json({ message: "Usuario actualizado, pero no se pudo enviar el correo de reactivación", error: error });
                        }
                        res.json({ message: "Usuario actualizado y correo de reactivación enviado" });
                    });
                } else {
                    res.json({ message: "Usuario actualizado" });
                }
            }
        );
    });
};

exports.deleteUsuario = (req, res) => {
    const { id_usuario } = req.params;
    db.query("DELETE FROM usuario WHERE id_usuario=?", [id_usuario], (err) => {
        if (err) return res.status(500).json({ message: "Error al eliminar usuario", error: err });
        res.json({ message: "Usuario eliminado" });
    });
};

// ========== PACIENTES ==========
exports.getPacientes = (req, res) => {
    db.query("SELECT * FROM paciente", (err, results) => {
        if (err) return res.status(500).json({ message: "Error al obtener pacientes", error: err });
        res.json(results);
    });
};

exports.createPaciente = (req, res) => {
    const { id_usuario, fecha_nacimiento, sexo } = req.body;
    db.query(
        "INSERT INTO paciente (id_usuario, fecha_nacimiento, sexo) VALUES (?, ?, ?)",
        [id_usuario, fecha_nacimiento, sexo],
        (err, result) => {
            if (err) return res.status(500).json({ message: "Error al crear paciente", error: err });
            res.json({ id_paciente: result.insertId });
        }
    );
};

exports.updatePaciente = (req, res) => {
    const { id_paciente } = req.params;
    const { fecha_nacimiento, sexo, filtro_dsm_5, terminos_privacida } = req.body;
    db.query(
        "UPDATE paciente SET fecha_nacimiento=?, sexo=?, filtro_dsm_5=?, terminos_privacida=? WHERE id_paciente=?",
        [fecha_nacimiento, sexo, filtro_dsm_5, terminos_privacida, id_paciente],
        (err) => {
            if (err) return res.status(500).json({ message: "Error al actualizar paciente", error: err });
            res.json({ message: "Paciente actualizado" });
        }
    );
};

exports.deletePaciente = (req, res) => {
    const { id_paciente } = req.params;
    db.query("DELETE FROM paciente WHERE id_paciente=?", [id_paciente], (err) => {
        if (err) return res.status(500).json({ message: "Error al eliminar paciente", error: err });
        res.json({ message: "Paciente eliminado" });
    });
};

// ========== ESPECIALISTAS ==========
exports.getEspecialistas = (req, res) => {
    db.query("SELECT * FROM especialista", (err, results) => {
        if (err) return res.status(500).json({ message: "Error al obtener especialistas", error: err });
        res.json(results);
    });
};

exports.createEspecialista = (req, res) => {
    const { id_usuario, especialidad } = req.body;
    db.query(
        "INSERT INTO especialista (id_usuario, especialidad) VALUES (?, ?)",
        [id_usuario, especialidad],
        (err, result) => {
            if (err) return res.status(500).json({ message: "Error al crear especialista", error: err });
            res.json({ id_especialista: result.insertId });
        }
    );
};

exports.updateEspecialista = (req, res) => {
    const { id_especialista } = req.params;
    const { especialidad, terminos_privacida } = req.body;
    db.query(
        "UPDATE especialista SET especialidad=?, terminos_privacida=? WHERE id_especialista=?",
        [especialidad, terminos_privacida, id_especialista],
        (err) => {
            if (err) return res.status(500).json({ message: "Error al actualizar especialista", error: err });
            res.json({ message: "Especialista actualizado" });
        }
    );
};

exports.deleteEspecialista = (req, res) => {
    const { id_especialista } = req.params;
    db.query("DELETE FROM especialista WHERE id_especialista=?", [id_especialista], (err) => {
        if (err) return res.status(500).json({ message: "Error al eliminar especialista", error: err });
        res.json({ message: "Especialista eliminado" });
    });
};

// ========== AREAS ==========
exports.getAreas = (req, res) => {
    db.query("SELECT * FROM area", (err, results) => {
        if (err) return res.status(500).json({ message: "Error al obtener áreas", error: err });
        res.json(results);
    });
};

exports.createArea = (req, res) => {
    const { area } = req.body;
    db.query(
        "INSERT INTO area (area) VALUES (?)",
        [area],
        (err, result) => {
            if (err) return res.status(500).json({ message: "Error al crear área", error: err });
            res.json({ id_area: result.insertId });
        }
    );
};

exports.updateArea = (req, res) => {
    const { id_area } = req.params;
    const { area } = req.body;
    db.query(
        "UPDATE area SET area=? WHERE id_area=?",
        [area, id_area],
        (err) => {
            if (err) return res.status(500).json({ message: "Error al actualizar área", error: err });
            res.json({ message: "Área actualizada" });
        }
    );
};

exports.deleteArea = (req, res) => {
    const { id_area } = req.params;
    db.query("DELETE FROM area WHERE id_area=?", [id_area], (err) => {
        if (err) return res.status(500).json({ message: "Error al eliminar área", error: err });
        res.json({ message: "Área eliminada" });
    });
};

// ========== PREGUNTAS ADI ==========
exports.getPreguntas = (req, res) => {
    db.query("SELECT * FROM pregunta_adi", (err, results) => {
        if (err) return res.status(500).json({ message: "Error al obtener preguntas", error: err });
        res.json(results);
    });
};

exports.createPregunta = (req, res) => {
    const { pregunta, id_area } = req.body;
    db.query(
        "INSERT INTO pregunta_adi (pregunta, id_area) VALUES (?, ?)",
        [pregunta, id_area],
        (err, result) => {
            if (err) return res.status(500).json({ message: "Error al crear pregunta", error: err });
            res.json({ id_pregunta: result.insertId });
        }
    );
};

exports.updatePregunta = (req, res) => {
    const { id_pregunta } = req.params;
    const { pregunta, id_area } = req.body;
    db.query(
        "UPDATE pregunta_adi SET pregunta=?, id_area=? WHERE id_pregunta=?",
        [pregunta, id_area, id_pregunta],
        (err) => {
            if (err) return res.status(500).json({ message: "Error al actualizar pregunta", error: err });
            res.json({ message: "Pregunta actualizada" });
        }
    );
};

exports.deletePregunta = (req, res) => {
    const { id_pregunta } = req.params;
    db.query("DELETE FROM pregunta_adi WHERE id_pregunta=?", [id_pregunta], (err) => {
        if (err) return res.status(500).json({ message: "Error al eliminar pregunta", error: err });
        res.json({ message: "Pregunta eliminada" });
    });
};

// ========== ACTIVIDADES ADOS ==========
exports.getActividades = (req, res) => {
    db.query("SELECT * FROM actividad", (err, results) => {
        if (err) return res.status(500).json({ message: "Error al obtener actividades", error: err });
        res.json(results);
    });
};

exports.createActividad = (req, res) => {
    const { id_ados, nombre_actividad, observacion, puntuacion } = req.body;
    db.query(
        "INSERT INTO actividad (id_ados, nombre_actividad, observacion, puntuacion) VALUES (?, ?, ?, ?)",
        [id_ados, nombre_actividad, observacion, puntuacion],
        (err, result) => {
            if (err) return res.status(500).json({ message: "Error al crear actividad", error: err });
            res.json({ id_actividad: result.insertId });
        }
    );
};

exports.updateActividad = (req, res) => {
    const { id_actividad } = req.params;
    const { id_ados, nombre_actividad, observacion, puntuacion } = req.body;
    db.query(
        "UPDATE actividad SET id_ados=?, nombre_actividad=?, observacion=?, puntuacion=? WHERE id_actividad=?",
        [id_ados, nombre_actividad, observacion, puntuacion, id_actividad],
        (err) => {
            if (err) return res.status(500).json({ message: "Error al actualizar actividad", error: err });
            res.json({ message: "Actividad actualizada" });
        }
    );
};

exports.deleteActividad = (req, res) => {
    const { id_actividad } = req.params;
    db.query("DELETE FROM actividad WHERE id_actividad=?", [id_actividad], (err) => {
        if (err) return res.status(500).json({ message: "Error al eliminar actividad", error: err });
        res.json({ message: "Actividad eliminada" });
    });
};

// ========== TESTS ADI-R ==========
exports.getTestsAdiR = (req, res) => {
    db.query("SELECT * FROM test_adi_r", (err, results) => {
        if (err) return res.status(500).json({ message: "Error al obtener tests ADI-R", error: err });
        res.json(results);
    });
};

exports.updateTestAdiR = (req, res) => {
    const { id_adir } = req.params;
    const { id_paciente, id_especialista, fecha, diagnostico } = req.body;
    db.query(
        "UPDATE test_adi_r SET id_paciente=?, id_especialista=?, fecha=?, diagnostico=? WHERE id_adir=?",
        [id_paciente, id_especialista, fecha, diagnostico, id_adir],
        (err) => {
            if (err) return res.status(500).json({ message: "Error al actualizar test ADI-R", error: err });
            res.json({ message: "Test ADI-R actualizado" });
        }
    );
};

exports.deleteTestAdiR = (req, res) => {
    const { id_adir } = req.params;
    db.query("DELETE FROM test_adi_r WHERE id_adir=?", [id_adir], (err) => {
        if (err) return res.status(500).json({ message: "Error al eliminar test ADI-R", error: err });
        res.json({ message: "Test ADI-R eliminado" });
    });
};

// ========== TESTS ADOS-2 ==========
exports.getTestsAdos2 = (req, res) => {
    db.query("SELECT * FROM test_ados_2", (err, results) => {
        if (err) return res.status(500).json({ message: "Error al obtener tests ADOS-2", error: err });
        res.json(results);
    });
};

exports.updateTestAdos2 = (req, res) => {
    const { id_ados } = req.params;
    const { id_paciente, fecha, modulo, id_especialista, diagnostico, total_punto } = req.body;
    db.query(
        "UPDATE test_ados_2 SET id_paciente=?, fecha=?, modulo=?, id_especialista=?, diagnostico=?, total_punto=? WHERE id_ados=?",
        [id_paciente, fecha, modulo, id_especialista, diagnostico, total_punto, id_ados],
        (err) => {
            if (err) return res.status(500).json({ message: "Error al actualizar test ADOS-2", error: err });
            res.json({ message: "Test ADOS-2 actualizado" });
        }
    );
};

exports.deleteTestAdos2 = (req, res) => {
    const { id_ados } = req.params;
    db.query("DELETE FROM test_ados_2 WHERE id_ados=?", [id_ados], (err) => {
        if (err) return res.status(500).json({ message: "Error al eliminar test ADOS-2", error: err });
        res.json({ message: "Test ADOS-2 eliminado" });
    });
};