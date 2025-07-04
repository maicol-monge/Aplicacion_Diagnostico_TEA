const db = require("../config/db");
const nodemailer = require("nodemailer");

// Listar todos los pacientes con opción de ver sus tests ADOS-2
exports.listarPacientesConAdos = (req, res) => {
    const query = `
        SELECT p.id_paciente, u.nombres, u.apellidos, p.sexo, p.fecha_nacimiento
        FROM paciente p
        JOIN usuario u ON p.id_usuario = u.id_usuario
        ORDER BY u.apellidos, u.nombres
    `;
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Error al obtener pacientes." });
        }
        res.json(results);
    });
};

// Listar tests ADOS-2 por paciente
exports.listarTestsAdosPorPaciente = (req, res) => {
    const { id_paciente } = req.params;
    const query = `
        SELECT t.id_ados, t.fecha, t.modulo, t.diagnostico, t.total_punto, t.clasificacion, t.puntuacion_comparativa, t.estado, t.id_paciente
        FROM test_ados_2 t
        WHERE t.id_paciente = ?
        ORDER BY t.fecha DESC
    `;
    db.query(query, [id_paciente], (err, results) => {
        if (err) return res.status(500).json({ message: "Error al obtener tests ADOS-2." });
        res.json(results);
    });
};

// Listar actividades por módulo
exports.listarActividadesPorModulo = (req, res) => {
    const { modulo } = req.params;
    const query = `
        SELECT id_actividad, nombre_actividad, objetivo,
               CAST(materiales AS CHAR) AS materiales,
               CAST(intrucciones AS CHAR) AS intrucciones,
               CAST(aspectos_observar AS CHAR) AS aspectos_observar,
               CAST(info_complementaria AS CHAR) AS info_complementaria
        FROM actividad
        WHERE modulo = ?
        ORDER BY id_actividad
    `;
    db.query(query, [modulo], (err, results) => {
        if (err) return res.status(500).json({ message: "Error al obtener actividades." });
        res.json(results);
    });
};

// Crear un nuevo test ADOS-2
exports.crearTestAdos = (req, res) => {
    const { id_paciente, modulo, id_especialista } = req.body;
    const fecha = new Date();
    const query = `
        INSERT INTO test_ados_2 (id_paciente, fecha, modulo, id_especialista, estado)
        VALUES (?, ?, ?, ?, 1)
    `;
    db.query(query, [id_paciente, fecha, modulo, id_especialista], (err, result) => {
        if (err) {
            console.error("Error al crear test ADOS-2:", err);
            return res.status(500).json({ message: "Error al crear test ADOS-2." });
        }
        res.json({ id_ados: result.insertId });
    });
};

// ...al final del archivo, antes de module.exports o donde agrupas los exports...

exports.validarFiltrosPaciente = (req, res) => {
    const { id_paciente } = req.params;
    db.query(
        "SELECT terminos_privacida, filtro_dsm_5 FROM paciente WHERE id_paciente = ?",
        [id_paciente],
        (err, rows) => {
            if (err || rows.length === 0) {
                return res.status(404).json({ message: "Paciente no encontrado." });
            }
            const { terminos_privacida, filtro_dsm_5 } = rows[0];
            if (terminos_privacida !== 1 || filtro_dsm_5 !== 1) {
                return res.status(200).json({ permitido: false, message: "El paciente no ha aceptado los términos de privacidad o no cumple el filtro DSM-5." });
            }
            return res.status(200).json({ permitido: true });
        }
    );
};

exports.guardarActividadRealizada = (req, res) => {
    const { id_ados, id_actividad, observacion } = req.body;
    const query = `
        INSERT INTO actividad_realizada (id_ados, id_actividad, observacion)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE observacion = VALUES(observacion)
    `;
    db.query(query, [id_ados, id_actividad, observacion], (err) => {
        if (err) return res.status(500).json({ message: "Error al guardar observación." });
        res.json({ message: "Observación guardada." });
    });
};

// Obtener observaciones previas
exports.obtenerActividadesRealizadas = (req, res) => {
    const { id_ados } = req.params;
    const query = `
        SELECT id_actividad, observacion
        FROM actividad_realizada
        WHERE id_ados = ?
    `;
    db.query(query, [id_ados], (err, results) => {
        if (err) return res.status(500).json({ message: "Error al obtener observaciones." });
        res.json(results);
    });
};

// Pausar o finalizar test (puedes modificar para aceptar estado finalizado)
exports.pausarTestAdos = (req, res) => {
    const { id_ados } = req.params;
    const { estado } = req.body;
    db.query(
        "UPDATE test_ados_2 SET estado = ? WHERE id_ados = ?",
        [estado, id_ados],
        (err) => {
            if (err) return res.status(500).json({ message: "Error al pausar test" });
            res.json({ message: "Test pausado" });
        }
    );
};

exports.buscarTestPausado = (req, res) => {
    const { id_paciente, modulo, id_especialista } = req.query;
    const query = `
        SELECT id_ados FROM test_ados_2
        WHERE id_paciente = ? AND modulo = ? AND id_especialista = ? AND estado = 1
        ORDER BY fecha DESC LIMIT 1
    `;
    db.query(query, [id_paciente, modulo, id_especialista], (err, results) => {
        if (err) return res.status(500).json({ message: "Error al buscar test pausado." });
        if (results.length > 0) {
            res.json({ id_ados: results[0].id_ados });
        } else {
            res.json({});
        }
    });
};

exports.responderItem = (req, res) => {
    const { id_ados, id_item, puntaje } = req.body;
    const query = `
        INSERT INTO puntuacion_aplicada (id_item, puntaje, id_ados)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE puntaje = VALUES(puntaje)
    `;
    db.query(query, [id_item, puntaje, id_ados], (err) => {
        if (err) return res.status(500).json({ message: "Error al guardar respuesta de ítem." });
        res.json({ message: "Respuesta guardada." });
    });
};

exports.responderCodificacion = (req, res) => {
    const { id_ados, id_puntuacion_codificacion } = req.body;
    // Obtener id_codificacion a partir de id_puntuacion_codificacion
    db.query(
        "SELECT id_codificacion FROM puntuacion_codificacion WHERE id_puntuacion_codificacion = ?",
        [id_puntuacion_codificacion],
        (err, results) => {
            if (err || results.length === 0) return res.status(400).json({ message: "Puntuación inválida" });
            const id_codificacion = results[0].id_codificacion;
            // Verifica si ya existe una respuesta para esta codificación y test
            db.query(
                `SELECT pa.id_puntuacion_aplicada
                 FROM puntuacion_aplicada pa
                 JOIN puntuacion_codificacion pc ON pa.id_puntuacion_codificacion = pc.id_puntuacion_codificacion
                 WHERE pa.id_ados = ? AND pc.id_codificacion = ?`,
                [id_ados, id_codificacion],
                (err2, rows) => {
                    if (err2) return res.status(500).json({ message: "Error al buscar respuesta" });
                    if (rows.length > 0) {
                        // Actualiza la respuesta existente
                        db.query(
                            "UPDATE puntuacion_aplicada SET id_puntuacion_codificacion = ? WHERE id_puntuacion_aplicada = ?",
                            [id_puntuacion_codificacion, rows[0].id_puntuacion_aplicada],
                            (err3) => {
                                if (err3) return res.status(500).json({ message: "Error al actualizar respuesta" });
                                res.json({ message: "Respuesta actualizada" });
                            }
                        );
                    } else {
                        // Inserta nueva respuesta
                        db.query(
                            "INSERT INTO puntuacion_aplicada (id_puntuacion_codificacion, id_ados) VALUES (?, ?)",
                            [id_puntuacion_codificacion, id_ados],
                            (err4) => {
                                if (err4) return res.status(500).json({ message: "Error al guardar respuesta" });
                                res.json({ message: "Respuesta guardada" });
                            }
                        );
                    }
                }
            );
        }
    );
};

exports.puntuacionesPorCodificacion = (req, res) => {
    const { id_codificacion } = req.params;
    db.query(
        "SELECT * FROM puntuacion_codificacion WHERE id_codificacion = ?",
        [id_codificacion],
        (err, results) => {
            if (err) return res.status(500).json({ message: "Error al obtener puntuaciones." });
            res.json(results);
        }
    );
};

exports.obtenerPacientePorId = (req, res) => {
    const { id_paciente } = req.params;
    db.query(
        "SELECT * FROM paciente WHERE id_paciente = ?",
        [id_paciente],
        (err, results) => {
            if (err) return res.status(500).json({ message: "Error al obtener paciente." });
            if (results.length === 0) return res.status(404).json({ message: "Paciente no encontrado." });
            res.json(results[0]);
        }
    );
};

exports.codificacionPorId = (req, res) => {
    const { id_codificacion } = req.params;
    db.query(
        "SELECT * FROM codificacion WHERE id_codificacion = ?",
        [id_codificacion],
        (err, results) => {
            if (err) return res.status(500).json({ message: "Error al obtener codificación." });
            if (results.length === 0) return res.status(404).json({ message: "Codificación no encontrada." });
            res.json(results[0]);
        }
    );
};

// GET /api/ados/codificaciones-algoritmo/:id_algoritmo
exports.codificacionesPorAlgoritmo = (req, res) => {
    const { id_algoritmo } = req.params;
    db.query(
        `SELECT c.*
         FROM item_algoritmo ia
         JOIN item i ON ia.id_item = i.id_item
         JOIN codificacion c ON i.id_codificacion = c.id_codificacion
         WHERE ia.id_algoritmo = ?`,
        [id_algoritmo],
        (err, results) => {
            if (err) {
                console.log("Error SQL:", err);
                return res.status(500).json({ message: "Error al obtener codificaciones." });
            }
            res.json(results);
        }
    );
};

exports.obtenerAlgoritmoPorId = (req, res) => {
    const { id_algoritmo } = req.params;
    db.query(
        "SELECT * FROM algoritmo WHERE id_algoritmo = ?",
        [id_algoritmo],
        (err, results) => {
            if (err) return res.status(500).json({ message: "Error al obtener algoritmo." });
            if (results.length === 0) return res.status(404).json({ message: "Algoritmo no encontrado." });
            res.json(results[0]);
        }
    );
};

exports.respuestasAlgoritmo = (req, res) => {
    const { id_ados } = req.params;
    db.query(
        `SELECT pc.id_codificacion, pa.id_puntuacion_codificacion
         FROM puntuacion_aplicada pa
         JOIN puntuacion_codificacion pc ON pa.id_puntuacion_codificacion = pc.id_puntuacion_codificacion
         WHERE pa.id_ados = ?`,
        [id_ados],
        (err, results) => {
            if (err) return res.status(500).json({ message: "Error al obtener respuestas" });
            res.json(results);
        }
    );
};

exports.obtenerTestPorId = (req, res) => {
    const { id_ados } = req.params;
    db.query(
        "SELECT * FROM test_ados_2 WHERE id_ados = ?",
        [id_ados],
        (err, results) => {
            if (err) return res.status(500).json({ message: "Error al obtener test" });
            if (results.length === 0) return res.status(404).json({ message: "Test no encontrado" });
            res.json(results[0]);
        }
    );
};

exports.obtenerAlgoritmoPorTest = (req, res) => {
    const { id_ados } = req.params;
    // Trae módulo, fecha_nacimiento y fecha del test
    db.query(
        `SELECT t.modulo, p.fecha_nacimiento, t.fecha
         FROM test_ados_2 t
         JOIN paciente p ON t.id_paciente = p.id_paciente
         WHERE t.id_ados = ?`,
        [id_ados],
        (err, results) => {
            if (err || results.length === 0) return res.status(404).json({ message: "Test no encontrado" });
            const { modulo, fecha_nacimiento, fecha } = results[0];

            // Lógica igual que en el frontend:
            let id_algoritmo = null;

            if (modulo === "1") {
                // Debes buscar la última respuesta de la codificación 1 para este test
                db.query(
                    `SELECT pc.puntaje
                     FROM puntuacion_aplicada pa
                     JOIN puntuacion_codificacion pc ON pa.id_puntuacion_codificacion = pc.id_puntuacion_codificacion
                     WHERE pa.id_ados = ? AND pc.id_codificacion = 1
                     ORDER BY pa.id_puntuacion_aplicada DESC LIMIT 1`,
                    [id_ados],
                    (err2, res2) => {
                        if (err2 || res2.length === 0) return res.status(404).json({ message: "No se encontró respuesta para selección de algoritmo" });
                        const puntaje = res2[0].puntaje;
                        id_algoritmo = (puntaje === 3 || puntaje === 4) ? 1 : 2;
                        return res.json({ id_algoritmo });
                    }
                );
            } else if (modulo === "2") {
                // Edad en años
                const nacimiento = new Date(fecha_nacimiento);
                const testDate = new Date(fecha);
                let edad = testDate.getFullYear() - nacimiento.getFullYear();
                const m = testDate.getMonth() - nacimiento.getMonth();
                if (m < 0 || (m === 0 && testDate.getDate() < nacimiento.getDate())) {
                    edad--;
                }
                if (edad < 5) id_algoritmo = 3;
                else if (edad >= 5) id_algoritmo = 4;
                return res.json({ id_algoritmo });
            } else if (modulo === "3") {
                id_algoritmo = 5;
                return res.json({ id_algoritmo });
            } else if (modulo === "4") {
                id_algoritmo = 6;
                return res.json({ id_algoritmo });
            } else if (modulo === "T") {
                // Edad en meses
                const nacimiento = new Date(fecha_nacimiento);
                const testDate = new Date(fecha);
                let meses = (testDate.getFullYear() - nacimiento.getFullYear()) * 12;
                meses += testDate.getMonth() - nacimiento.getMonth();
                if (testDate.getDate() < nacimiento.getDate()) {
                    meses--;
                }
                if (meses >= 12 && meses <= 20) id_algoritmo = 7;
                else if (meses >= 21 && meses <= 30) id_algoritmo = 8;
                return res.json({ id_algoritmo });
            } else {
                return res.status(400).json({ message: "No se puede deducir el algoritmo para este módulo" });
            }
        }
    );
};

exports.puntuacionesAplicadasPorTest = (req, res) => {
    const { id_ados } = req.params;
    db.query(
        `SELECT pa.id_puntuacion_aplicada, pc.puntaje, pc.id_codificacion
         FROM puntuacion_aplicada pa
         JOIN puntuacion_codificacion pc ON pa.id_puntuacion_codificacion = pc.id_puntuacion_codificacion
         WHERE pa.id_ados = ?`,
        [id_ados],
        (err, results) => {
            if (err) return res.status(500).json({ message: "Error al obtener puntuaciones" });
            res.json(results);
        }
    );
};

exports.actualizarClasificacion = (req, res) => {
    const { id_ados } = req.params;
    const { clasificacion, total_punto } = req.body;
    db.query(
        "UPDATE test_ados_2 SET clasificacion = ?, total_punto = ? WHERE id_ados = ?",
        [clasificacion, total_punto, id_ados],
        (err) => {
            if (err) return res.status(500).json({ message: "Error al actualizar clasificación" });
            res.json({ message: "Clasificación actualizada" });
        }
    );
};

// Nueva función para actualizar la puntuación comparativa
exports.actualizarPuntuacionComparativa = (req, res) => {
    const { id_ados } = req.params;
    const { puntuacion_comparativa } = req.body;
    db.query(
        "UPDATE test_ados_2 SET puntuacion_comparativa = ? WHERE id_ados = ?",
        [puntuacion_comparativa, id_ados],
        (err) => {
            if (err) return res.status(500).json({ message: "Error al actualizar puntuación comparativa" });
            res.json({ message: "Puntuación comparativa actualizada" });
        }
    );
};

// Actualizar diagnóstico
// ...existing code...

// Actualizar diagnóstico y notificar al paciente por correo
exports.actualizarDiagnostico = (req, res) => {
    const { id_ados } = req.params;
    const { diagnostico } = req.body;

    // Primero, actualiza el diagnóstico
    db.query(
        "UPDATE test_ados_2 SET diagnostico = ? WHERE id_ados = ?",
        [diagnostico, id_ados],
        (err, result) => {
            if (err) return res.status(500).json({ message: "Error al actualizar diagnóstico" });

            // Luego, busca el paciente y su correo
            const query = `
                SELECT u.correo, u.nombres, u.apellidos
                FROM test_ados_2 t
                JOIN paciente p ON t.id_paciente = p.id_paciente
                JOIN usuario u ON p.id_usuario = u.id_usuario
                WHERE t.id_ados = ?
            `;
            db.query(query, [id_ados], (err2, results) => {
                if (err2 || results.length === 0) {
                    // Si no se puede enviar el correo, igual responde OK
                    return res.json({ message: "Diagnóstico actualizado, pero no se pudo notificar al paciente" });
                }
                const { correo, nombres, apellidos } = results[0];
                enviarCorreoDiagnosticoADOS(correo, nombres, apellidos);
                res.json({ message: "Diagnóstico actualizado y paciente notificado" });
            });
        }
    );
};

// Función para enviar el correo de notificación de diagnóstico ADOS-2
function enviarCorreoDiagnosticoADOS(destinatario, nombre, apellidos) {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS
        }
    });

    const mensaje = `
Hola ${nombre} ${apellidos},

Te informamos que el diagnóstico de tu test ADOS-2 ha sido actualizado por el especialista.

Ya puedes consultar el resultado desde la sección de "Resultados" en el sistema TEA Diagnóstico.

Saludos,
Equipo TEA Diagnóstico
`;

    const mailOptions = {
        from: 'aplicaciondediagnosticodetea@gmail.com',
        to: destinatario,
        subject: "Diagnóstico actualizado - Test ADOS-2",
        text: mensaje
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log('Error enviando correo de diagnóstico ADOS-2:', error);
        } else {
            console.log('Correo de diagnóstico ADOS-2 enviado: ' + info.response);
        }
    });
}

// ...existing code...

exports.obtenerActividadesPorTest = (req, res) => {
    const { id_ados } = req.params;
    console.log("Llamada a obtenerActividadesPorTest con id_ados:", id_ados);
    const sql = `
        SELECT 
            ar.id_actividad_realizada,
            ar.id_actividad,
            a.nombre_actividad,
            ar.observacion
        FROM actividad_realizada ar
        JOIN actividad a ON ar.id_actividad = a.id_actividad
        WHERE ar.id_ados = ?
        ORDER BY ar.id_actividad_realizada
    `;
    db.query(sql, [id_ados], (err, results) => {
        if (err) {
            console.log("Error SQL:", err);
            return res.status(500).json({ message: "Error al obtener actividades" });
        }
        console.log("Resultados actividades:", results);
        res.json(results);
    });
};

exports.obtenerGrupoPorCodificacion = (req, res) => {
    const { id_codificacion } = req.params;
    const sql = `
        SELECT i.grupo
        FROM item i
        JOIN codificacion c ON c.id_codificacion = i.id_codificacion
        WHERE c.id_codificacion = ?
        LIMIT 1
    `;
    db.query(sql, [id_codificacion], (err, results) => {
        if (err) {
            console.log("Error SQL:", err);
            return res.status(500).json({ message: "Error al obtener grupo" });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: "No se encontró grupo para ese id_codificacion" });
        }
        res.json({ grupo: results[0].grupo });
    });
};

// Obtener datos completos para el reporte del Módulo T
exports.obtenerDatosReporteModuloT = (req, res) => {
    const { id_ados } = req.params;

    // 1. Datos del test, paciente y especialista, y fecha_nacimiento para calcular edad
    const sql = `
        SELECT 
            t.id_ados, t.fecha, t.modulo, t.diagnostico, t.clasificacion, t.total_punto, t.puntuacion_comparativa,
            u.nombres AS nombres, u.apellidos AS apellidos, u.telefono, 
            e.id_especialista, ue.nombres AS especialista_nombres, ue.apellidos AS especialista_apellidos,
            p.fecha_nacimiento
        FROM test_ados_2 t
        JOIN paciente p ON t.id_paciente = p.id_paciente
        JOIN usuario u ON p.id_usuario = u.id_usuario
        LEFT JOIN especialista e ON t.id_especialista = e.id_especialista
        LEFT JOIN usuario ue ON e.id_usuario = ue.id_usuario
        WHERE t.id_ados = ?
    `;
    db.query(sql, [id_ados], (err, results) => {
        if (err || results.length === 0) {
            return res.status(500).json({ message: "No se pudo obtener datos del test" });
        }
        const datos = results[0];

        // 2. Puntuaciones aplicadas (AS y CRR)
        db.query(
            `SELECT pc.puntaje, pc.id_codificacion, c.codigo
             FROM puntuacion_aplicada pa
             JOIN puntuacion_codificacion pc ON pa.id_puntuacion_codificacion = pc.id_puntuacion_codificacion
             JOIN codificacion c ON pc.id_codificacion = c.id_codificacion
             WHERE pa.id_ados = ?`,
            [id_ados],
            (err2, puntuaciones) => {
                if (err2) return res.status(500).json({ message: "No se pudo obtener puntuaciones" });

                // Buscar el puntaje del ítem "Nivel general de lenguaje oral no ecolálico"
                // Ajusta el código "A1" si tu codificación es diferente
                const puntajeA1 = puntuaciones.find(p => p.codigo === "A1")?.puntaje;

                // Calcular edad en meses
                const nacimiento = new Date(datos.fecha_nacimiento);
                const fechaTest = new Date(datos.fecha);
                let edadMeses = (fechaTest.getFullYear() - nacimiento.getFullYear()) * 12;
                edadMeses += fechaTest.getMonth() - nacimiento.getMonth();
                if (fechaTest.getDate() < nacimiento.getDate()) {
                    edadMeses--;
                }

                // Determinar algoritmo
                let id_algoritmo = null;
                if (
                    (edadMeses >= 12 && edadMeses <= 20) ||
                    (edadMeses >= 21 && edadMeses <= 30 && (puntajeA1 === 3 || puntajeA1 === 4))
                ) {
                    id_algoritmo = 7;
                } else if (
                    (edadMeses >= 21 && edadMeses <= 30 && (puntajeA1 === 0 || puntajeA1 === 1 || puntajeA1 === 2))
                ) {
                    id_algoritmo = 8;
                }

                // 3. Observaciones finales
                db.query(
                    `SELECT ar.observacion, a.nombre_actividad
                     FROM actividad_realizada ar
                     JOIN actividad a ON ar.id_actividad = a.id_actividad
                     WHERE ar.id_ados = ?`,
                    [id_ados],
                    (err3, observaciones) => {
                        if (err3) return res.status(500).json({ message: "No se pudo obtener observaciones" });

                        res.json({
                            ...datos,
                            puntuaciones,
                            observaciones,
                            id_algoritmo // <-- lo agregas aquí
                        });
                    }
                );
            }
        );
    });
};

exports.obtenerDatosReporteModulo1 = (req, res) => {
    const { id_ados } = req.params;

    // 1. Datos del test, paciente y especialista, y fecha_nacimiento para calcular edad
    const sql = `
        SELECT 
            t.id_ados, t.fecha, t.modulo, t.diagnostico, t.clasificacion, t.total_punto, t.puntuacion_comparativa,
            u.nombres AS nombres, u.apellidos AS apellidos, u.telefono, 
            e.id_especialista, ue.nombres AS especialista_nombres, ue.apellidos AS especialista_apellidos,
            p.fecha_nacimiento
        FROM test_ados_2 t
        JOIN paciente p ON t.id_paciente = p.id_paciente
        JOIN usuario u ON p.id_usuario = u.id_usuario
        LEFT JOIN especialista e ON t.id_especialista = e.id_especialista
        LEFT JOIN usuario ue ON e.id_usuario = ue.id_usuario
        WHERE t.id_ados = ?
    `;
    db.query(sql, [id_ados], (err, results) => {
        if (err || results.length === 0) {
            return res.status(500).json({ message: "No se pudo obtener datos del test" });
        }
        const datos = results[0];

        // 2. Puntuaciones aplicadas (AS y CRR)
        db.query(
            `SELECT pc.puntaje, pc.id_codificacion, c.codigo
             FROM puntuacion_aplicada pa
             JOIN puntuacion_codificacion pc ON pa.id_puntuacion_codificacion = pc.id_puntuacion_codificacion
             JOIN codificacion c ON pc.id_codificacion = c.id_codificacion
             WHERE pa.id_ados = ?`,
            [id_ados],
            (err2, puntuaciones) => {
                if (err2) return res.status(500).json({ message: "No se pudo obtener puntuaciones" });

                // Buscar el puntaje del ítem "Nivel general de lenguaje oral no ecolálico"
                // Ajusta el código "A1" si tu codificación es diferente
                const puntajeA1 = puntuaciones.find(p => p.codigo === "A1")?.puntaje;

                // Calcular edad en meses
                const nacimiento = new Date(datos.fecha_nacimiento);
                const fechaTest = new Date(datos.fecha);
                let edadMeses = (fechaTest.getFullYear() - nacimiento.getFullYear()) * 12;
                edadMeses += fechaTest.getMonth() - nacimiento.getMonth();
                if (fechaTest.getDate() < nacimiento.getDate()) {
                    edadMeses--;
                }

                // Determinar algoritmo
                let id_algoritmo = null;
                if (
                    (edadMeses >= 12 && edadMeses <= 20) ||
                    (edadMeses >= 21 && edadMeses <= 30 && (puntajeA1 === 3 || puntajeA1 === 4))
                ) {
                    id_algoritmo = 1;
                } else if (
                    (edadMeses >= 21 && edadMeses <= 30 && (puntajeA1 === 0 || puntajeA1 === 1 || puntajeA1 === 2))
                ) {
                    id_algoritmo = 2;
                }

                // 3. Observaciones finales
                db.query(
                    `SELECT ar.observacion, a.nombre_actividad
                     FROM actividad_realizada ar
                     JOIN actividad a ON ar.id_actividad = a.id_actividad
                     WHERE ar.id_ados = ?`,
                    [id_ados],
                    (err3, observaciones) => {
                        if (err3) return res.status(500).json({ message: "No se pudo obtener observaciones" });

                        res.json({
                            ...datos,
                            puntuaciones,
                            observaciones,
                            id_algoritmo // <-- lo agregas aquí
                        });
                    }
                );
            }
        );
    });
};



exports.obtenerDatosReporteModulo3 = (req, res) => {
    const { id_ados } = req.params;

    // 1. Datos del test, paciente y especialista, y fecha_nacimiento para calcular edad
    const sql = `
        SELECT 
            t.id_ados, t.fecha, t.modulo, t.diagnostico, t.clasificacion, t.total_punto, t.puntuacion_comparativa,
            u.nombres AS nombres, u.apellidos AS apellidos, u.telefono, 
            e.id_especialista, ue.nombres AS especialista_nombres, ue.apellidos AS especialista_apellidos,
            p.fecha_nacimiento
        FROM test_ados_2 t
        JOIN paciente p ON t.id_paciente = p.id_paciente
        JOIN usuario u ON p.id_usuario = u.id_usuario
        LEFT JOIN especialista e ON t.id_especialista = e.id_especialista
        LEFT JOIN usuario ue ON e.id_usuario = ue.id_usuario
        WHERE t.id_ados = ?
    `;
    db.query(sql, [id_ados], (err, results) => {
        if (err || results.length === 0) {
            return res.status(500).json({ message: "No se pudo obtener datos del test" });
        }
        const datos = results[0];

        // 2. Puntuaciones aplicadas (AS y CRR)
        db.query(
            `SELECT pc.puntaje, pc.id_codificacion, c.codigo
             FROM puntuacion_aplicada pa
             JOIN puntuacion_codificacion pc ON pa.id_puntuacion_codificacion = pc.id_puntuacion_codificacion
             JOIN codificacion c ON pc.id_codificacion = c.id_codificacion
             WHERE pa.id_ados = ?`,
            [id_ados],
            (err2, puntuaciones) => {
                if (err2) return res.status(500).json({ message: "No se pudo obtener puntuaciones" });

                // Calcular edad en años
                const nacimiento = new Date(datos.fecha_nacimiento);
                const fechaTest = new Date(datos.fecha);
                let edad = fechaTest.getFullYear() - nacimiento.getFullYear();
                const m = fechaTest.getMonth() - nacimiento.getMonth();
                if (m < 0 || (m === 0 && fechaTest.getDate() < nacimiento.getDate())) {
                    edad--;
                }

                // Determinar algoritmo (para módulo 3 es fijo)
                const id_algoritmo = 5;

                // 3. Observaciones finales
                db.query(
                    `SELECT ar.observacion, a.nombre_actividad
                     FROM actividad_realizada ar
                     JOIN actividad a ON ar.id_actividad = a.id_actividad
                     WHERE ar.id_ados = ?`,
                    [id_ados],
                    (err3, observaciones) => {
                        if (err3) return res.status(500).json({ message: "No se pudo obtener observaciones" });

                        res.json({
                            ...datos,
                            puntuaciones,
                            observaciones,
                            id_algoritmo // <-- lo agregas aquí
                        });
                    }
                );
            }
        );
    });
};

exports.obtenerDatosReporteModulo2 = (req, res) => {
    const { id_ados } = req.params;

    // 1. Datos del test, paciente y especialista, y fecha_nacimiento para calcular edad
    const sql = `
        SELECT 
            t.id_ados, t.fecha, t.modulo, t.diagnostico, t.clasificacion, t.total_punto, t.puntuacion_comparativa,
            u.nombres AS nombres, u.apellidos AS apellidos, u.telefono, 
            e.id_especialista, ue.nombres AS especialista_nombres, ue.apellidos AS especialista_apellidos,
            p.fecha_nacimiento
        FROM test_ados_2 t
        JOIN paciente p ON t.id_paciente = p.id_paciente
        JOIN usuario u ON p.id_usuario = u.id_usuario
        LEFT JOIN especialista e ON t.id_especialista = e.id_especialista
        LEFT JOIN usuario ue ON e.id_usuario = ue.id_usuario
        WHERE t.id_ados = ?
    `;
    db.query(sql, [id_ados], (err, results) => {
        if (err || results.length === 0) {
            return res.status(500).json({ message: "No se pudo obtener datos del test" });
        }
        const datos = results[0];

        // 2. Puntuaciones aplicadas (AS y CRR)
        db.query(
            `SELECT pc.puntaje, pc.id_codificacion, c.codigo
             FROM puntuacion_aplicada pa
             JOIN puntuacion_codificacion pc ON pa.id_puntuacion_codificacion = pc.id_puntuacion_codificacion
             JOIN codificacion c ON pc.id_codificacion = c.id_codificacion
             WHERE pa.id_ados = ?`,
            [id_ados],
            (err2, puntuaciones) => {
                if (err2) return res.status(500).json({ message: "No se pudo obtener puntuaciones" });

                // Calcular edad en años
                const nacimiento = new Date(datos.fecha_nacimiento);
                const fechaTest = new Date(datos.fecha);
                let edad = fechaTest.getFullYear() - nacimiento.getFullYear();
                const m = fechaTest.getMonth() - nacimiento.getMonth();
                if (m < 0 || (m === 0 && fechaTest.getDate() < nacimiento.getDate())) {
                    edad--;
                }

                // Determinar algoritmo para módulo 2
                let id_algoritmo = null;
                if (edad < 5) id_algoritmo = 3;
                else if (edad >= 5) id_algoritmo = 4;

                // 3. Observaciones finales
                db.query(
                    `SELECT ar.observacion, a.nombre_actividad
                     FROM actividad_realizada ar
                     JOIN actividad a ON ar.id_actividad = a.id_actividad
                     WHERE ar.id_ados = ?`,
                    [id_ados],
                    (err3, observaciones) => {
                        if (err3) return res.status(500).json({ message: "No se pudo obtener observaciones" });

                        res.json({
                            ...datos,
                            puntuaciones,
                            observaciones,
                            id_algoritmo // <-- lo agregas aquí
                        });
                    }
                );
            }
        );
    });
};

exports.obtenerDatosReporteModulo4 = (req, res) => {
    const { id_ados } = req.params;

    // 1. Datos del test, paciente y especialista, y fecha_nacimiento para calcular edad
    const sql = `
        SELECT 
            t.id_ados, t.fecha, t.modulo, t.diagnostico, t.clasificacion, t.total_punto, t.puntuacion_comparativa,
            u.nombres AS nombres, u.apellidos AS apellidos, u.telefono, 
            e.id_especialista, ue.nombres AS especialista_nombres, ue.apellidos AS especialista_apellidos,
            p.fecha_nacimiento
        FROM test_ados_2 t
        JOIN paciente p ON t.id_paciente = p.id_paciente
        JOIN usuario u ON p.id_usuario = u.id_usuario
        LEFT JOIN especialista e ON t.id_especialista = e.id_especialista
        LEFT JOIN usuario ue ON e.id_usuario = ue.id_usuario
        WHERE t.id_ados = ?
    `;
    db.query(sql, [id_ados], (err, results) => {
        if (err || results.length === 0) {
            return res.status(500).json({ message: "No se pudo obtener datos del test" });
        }
        const datos = results[0];

        // 2. Puntuaciones aplicadas
        db.query(
            `SELECT pc.puntaje, pc.id_codificacion, c.codigo
             FROM puntuacion_aplicada pa
             JOIN puntuacion_codificacion pc ON pa.id_puntuacion_codificacion = pc.id_puntuacion_codificacion
             JOIN codificacion c ON pc.id_codificacion = c.id_codificacion
             WHERE pa.id_ados = ?`,
            [id_ados],
            (err2, puntuaciones) => {
                if (err2) return res.status(500).json({ message: "No se pudo obtener puntuaciones" });

                // Algoritmo para módulo 4 es fijo
                const id_algoritmo = 6;

                // 3. Observaciones finales
                db.query(
                    `SELECT ar.observacion, a.nombre_actividad
                     FROM actividad_realizada ar
                     JOIN actividad a ON ar.id_actividad = a.id_actividad
                     WHERE ar.id_ados = ?`,
                    [id_ados],
                    (err3, observaciones) => {
                        if (err3) return res.status(500).json({ message: "No se pudo obtener observaciones" });

                        res.json({
                            ...datos,
                            puntuaciones,
                            observaciones,
                            id_algoritmo
                        });
                    }
                );
            }
        );
    });
};