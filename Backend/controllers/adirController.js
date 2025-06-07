const db = require("../config/db");

const nodemailer = require('nodemailer'); // <-- Asegúrate de requerir nodemailer

const { PDFDocument, rgb } = require('pdf-lib');
const dayjs = require('dayjs');
const fs = require('fs');
const path = require('path');

// Función para enviar correo de diagnóstico
function enviarCorreoDiagnostico(destinatario, nombre, apellidos, diagnostico) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS
        }
    });

    const mailOptions = {
        from: 'aplicaciondediagnosticodetea@gmail.com',
        to: destinatario,
        subject: 'Nuevo diagnóstico ADIR',
        text: `Hola ${nombre} ${apellidos},\n\nSe ha registrado un nuevo diagnóstico ADIR para ti:\n\nConsulta tu diagnostico en la sección de Resultados\n\nSi tienes dudas, contacta a tu especialista.\n\nSaludos.`
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log('Error enviando correo de diagnóstico:', error);
        } else {
            console.log('Correo de diagnóstico enviado: ' + info.response);
        }
    });
}

// Listar tests ADIR por paciente
exports.listarTestsPorPaciente = (req, res) => {
    const { id_paciente } = req.params;
    const query = `
        SELECT t.id_adir, t.fecha, t.diagnostico, t.estado
        FROM test_adi_r t
        WHERE t.id_paciente = ?
        ORDER BY t.fecha DESC
    `;
    db.query(query, [id_paciente], (err, results) => {
        if (err) return res.status(500).json({ message: "Error al obtener tests." });
        res.json(results);
    });
};

// Listar tests ADIR por paciente SOLO con diagnóstico
exports.listarTestsConDiagnosticoPorPaciente = (req, res) => {
    const { id_paciente } = req.params;
    const query = `
        SELECT t.id_adir, t.fecha, t.diagnostico
        FROM test_adi_r t
        WHERE t.id_paciente = ? AND t.diagnostico IS NOT NULL
        ORDER BY t.fecha DESC
    `;
    db.query(query, [id_paciente], (err, results) => {
        if (err) return res.status(500).json({ message: "Error al obtener tests." });
        res.json(results);
    });
};

// Obtener resumen de un test ADIR
exports.obtenerResumenEvaluacion = (req, res) => {
    const { id_adir } = req.params;
    const testQuery = `
        SELECT 
            t.id_adir, 
            t.fecha AS fecha_entrevista, 
            t.diagnostico, 
            t.algoritmo,
            t.tipo_sujeto,
            t.estado,
            t.id_especialista,
            p.id_paciente, 
            u.nombres, 
            u.apellidos, 
            p.sexo, 
            p.fecha_nacimiento,
            ue.nombres AS especialista_nombre,
            ue.apellidos AS especialista_apellidos
        FROM test_adi_r t
        JOIN paciente p ON t.id_paciente = p.id_paciente
        JOIN usuario u ON p.id_usuario = u.id_usuario
        LEFT JOIN especialista e ON t.id_especialista = e.id_especialista
        LEFT JOIN usuario ue ON e.id_usuario = ue.id_usuario
        WHERE t.id_adir = ?
    `;
    db.query(testQuery, [id_adir], (err, testResults) => {
        if (err || testResults.length === 0) {
            return res.status(404).json({ message: "Test no encontrado." });
        }
        const respuestasQuery = `
            SELECT r.id_pregunta, a.area, q.pregunta, r.codigo, r.observacion
            FROM respuesta_adi r
            JOIN pregunta_adi q ON r.id_pregunta = q.id_pregunta
            JOIN area a ON q.id_area = a.id_area
            WHERE r.id_adir = ?
        `;
        db.query(respuestasQuery, [id_adir], (err2, respuestas) => {
            if (err2) {
                return res.status(500).json({ message: "Error al obtener respuestas." });
            }
            // Unifica nombre del especialista si existe
            const test = testResults[0];
            test.especialista = test.especialista_nombre
                ? `${test.especialista_nombre} ${test.especialista_apellidos}`
                : "";
            delete test.especialista_nombre;
            delete test.especialista_apellidos;
            res.json({
                test,
                respuestas
            });
        });
    });
};

// Guardar diagnóstico
exports.guardarDiagnostico = (req, res) => {
    const { id_adir } = req.params;
    const { diagnostico, id_especialista } = req.body;
    const query = "UPDATE test_adi_r SET diagnostico = ?, id_especialista = ? WHERE id_adir = ?";
    db.query(query, [diagnostico, id_especialista, id_adir], (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Error al guardar el diagnóstico." });
        }

        // Buscar datos del paciente para enviar el correo
        const pacienteQuery = `
            SELECT u.correo, u.nombres, u.apellidos
            FROM test_adi_r t
            JOIN paciente p ON t.id_paciente = p.id_paciente
            JOIN usuario u ON p.id_usuario = u.id_usuario
            WHERE t.id_adir = ?
        `;
        db.query(pacienteQuery, [id_adir], (err2, results) => {
            if (!err2 && results.length > 0) {
                const { correo, nombres, apellidos } = results[0];
                enviarCorreoDiagnostico(correo, nombres, apellidos, diagnostico);
            }
            // No importa si falla el correo, igual respondemos OK
            res.json({ message: "Diagnóstico guardado correctamente." });
        });
    });
};

// Obtener preguntas y respuestas del último test ADIR de un paciente
exports.resumenUltimoTestPorPaciente = (req, res) => {
    const { id_paciente } = req.params;
    // 1. Buscar el último test ADIR de ese paciente
    const testQuery = `
        SELECT t.id_adir, t.fecha, t.diagnostico, p.id_paciente, u.nombres, u.apellidos, u.sexo, u.fecha_nacimiento
        FROM test_adi_r t
        JOIN paciente p ON t.id_paciente = p.id_paciente
        JOIN usuario u ON p.id_usuario = u.id_usuario
        WHERE t.id_paciente = ?
        ORDER BY t.fecha DESC
        LIMIT 1
    `;
    db.query(testQuery, [id_paciente], (err, testResults) => {
        if (err) return res.status(500).json({ message: "Error al buscar test." });
        if (testResults.length === 0) {
            return res.status(404).json({ message: "El paciente no tiene tests ADIR." });
        }
        const test = testResults[0];
        // 2. Buscar preguntas y respuestas de ese test
        const respuestasQuery = `
            SELECT r.id_pregunta, q.pregunta, r.calificacion, r.observacion
            FROM respuesta_adi r
            JOIN pregunta_adi q ON r.id_pregunta = q.id_pregunta
            WHERE r.id_adir = ?
        `;
        db.query(respuestasQuery, [test.id_adir], (err2, respuestas) => {
            if (err2) return res.status(500).json({ message: "Error al buscar respuestas." });
            res.json({
                test,
                respuestas
            });
        });
    });
};

// Generar PDF de resultados ADI-R
exports.generarPdfAdir = (req, res) => {
    const { id_adir } = req.params;
    // 1. Buscar test_adi_r
    db.query('SELECT * FROM test_adi_r WHERE id_adir = ?', [id_adir], (err, adirRows) => {
        if (err || adirRows.length === 0) return res.status(404).json({ message: "No existe el test." });
        const adir = adirRows[0];
        // 2. Buscar paciente
        db.query('SELECT * FROM paciente WHERE id_paciente = ?', [adir.id_paciente], (err2, pacienteRows) => {
            if (err2 || pacienteRows.length === 0) return res.status(404).json({ message: "Paciente no encontrado." });
            const paciente = pacienteRows[0];
            // 3. Buscar usuario del paciente
            db.query('SELECT * FROM usuario WHERE id_usuario = ?', [paciente.id_usuario], (err3, usuarioPacienteRows) => {
                if (err3 || usuarioPacienteRows.length === 0) return res.status(404).json({ message: "Usuario paciente no encontrado." });
                const usuarioPaciente = usuarioPacienteRows[0];
                // 4. Buscar especialista
                db.query('SELECT * FROM especialista WHERE id_especialista = ?', [adir.id_especialista], (err4, especialistaRows) => {
                    const especialista = especialistaRows && especialistaRows.length > 0 ? especialistaRows[0] : {};
                    // 5. Buscar usuario del especialista
                    db.query('SELECT * FROM usuario WHERE id_usuario = ?', [especialista.id_usuario], (err5, usuarioEspecialistaRows) => {
                        const usuarioEspecialista = usuarioEspecialistaRows && usuarioEspecialistaRows.length > 0 ? usuarioEspecialistaRows[0] : { nombres: "", apellidos: "" };
                        // 6. Buscar respuestas
                        db.query(`
                            SELECT r.*, p.pregunta FROM respuesta_adi r 
                            JOIN pregunta_adi p ON p.id_pregunta = r.id_pregunta
                            WHERE r.id_adir = ?
                        `, [id_adir], async (err6, respuestas) => {
                            if (err6) return res.status(500).json({ message: "Error generando PDF." });
                            try {
                                const { PDFDocument, rgb } = require('pdf-lib');
                                const dayjs = require('dayjs');
                                const fs = require('fs');
                                const path = require('path');

                                const pdfDoc = await PDFDocument.create();
                                let page = pdfDoc.addPage([595, 842]);
                                const { width, height } = page.getSize();

                                const drawText = (text, x, y, size = 12) => {
                                    page.drawText(text, {
                                        x, y, size,
                                        color: rgb(0, 0, 0)
                                    });
                                };

                                // Logo (opcional)
                                const logoPath = path.join(__dirname, '../public/TEAlogo.png');
                                if (fs.existsSync(logoPath)) {
                                    const logoBytes = fs.readFileSync(logoPath);
                                    const logoImage = await pdfDoc.embedPng(logoBytes);
                                    page.drawImage(logoImage, { x: 30, y: height - 80, width: 60, height: 60 });
                                }

                                drawText('APLICACIÓN PARA LA EVALUACIÓN DE PERSONAS CON TRASTORNO DEL ESPECTRO AUTISTA', 100, height - 50, 10);
                                drawText('ADI-R - Entrevista para el diagnóstico de Autismo - Revisada', 150, height - 70, 12);

                                drawText(`Nombre: ${usuarioPaciente.nombres} ${usuarioPaciente.apellidos}`, 30, height - 100);
                                drawText(`ID: ${paciente.id_paciente}`, 320, height - 100);
                                drawText(`Sexo: ${paciente.sexo === 'M' ? 'Masculino' : 'Femenino'}`, 30, height - 115);
                                drawText(`Fecha de nacimiento: ${dayjs(paciente.fecha_nacimiento).format('DD/MM/YYYY')}`, 180, height - 115);
                                drawText(`Edad cronológica: ${dayjs().diff(paciente.fecha_nacimiento, 'year')} años`, 400, height - 115);

                                drawText(`Especialista: ${usuarioEspecialista.nombres} ${usuarioEspecialista.apellidos}`, 30, height - 145);
                                drawText(`Centro: OPPTA`, 320, height - 145);
                                drawText(`Fecha de entrevista: ${dayjs(adir.fecha).format('DD/MM/YYYY')}`, 30, height - 160);

                                drawText(`Diagnóstico: ${adir.diagnostico || 'Pendiente'}`, 30, height - 190);

                                let y = height - 220;
                                for (const r of respuestas) {
                                    if (y < 60) {
                                        page = pdfDoc.addPage([595, 842]);
                                        y = height - 40;
                                    }
                                    drawText(`• ${r.pregunta}`, 30, y);
                                    drawText(`Calificación: ${r.calificacion}`, 450, y);
                                    y -= 18;
                                    drawText(`Obs.: ${r.observacion}`, 30, y, 10);
                                    y -= 20;
                                }

                                const pdfBytes = await pdfDoc.save();
                                res.setHeader('Content-Type', 'application/pdf');
                                res.send(pdfBytes);
                            } catch (e) {
                                res.status(500).json({ message: "Error generando PDF." });
                            }
                        });
                    });
                });
            });
        });
    });
};

// Obtener todas las preguntas ADI-R
exports.obtenerPreguntasAdir = (req, res) => {
    db.query("SELECT id_pregunta, pregunta FROM pregunta_adi ORDER BY id_pregunta", (err, results) => {
        if (err) return res.status(500).json({ message: "Error al obtener preguntas." });
        res.json(results);
    });
};

// Crear un nuevo test_adi_r
exports.crearTestAdir = (req, res) => {
    const { id_paciente } = req.body;
    const fecha = new Date();
    db.query(
        "INSERT INTO test_adi_r (id_paciente, fecha) VALUES (?, ?)",
        [id_paciente, fecha],
        (err, result) => {
            if (err) return res.status(500).json({ message: "Error al crear test." });
            res.json({ id_adir: result.insertId });
        }
    );
};

// Crear un nuevo test_adi_r SOLO si el paciente cumple condiciones
exports.crearTestAdir = (req, res) => {
    const { id_paciente, id_especialista, algoritmo, tipo_sujeto, edad_mental_confirmada } = req.body;

    if (!id_paciente || !id_especialista || !edad_mental_confirmada) {
        return res.status(400).json({ message: "Faltan datos obligatorios." });
    }
    if (!edad_mental_confirmada) {
        return res.status(400).json({ message: "Debe confirmar que el paciente tiene al menos 2 años de edad mental." });
    }

    // Validar términos y filtro DSM-5
    db.query(
        "SELECT terminos_privacida, filtro_dsm_5 FROM paciente WHERE id_paciente = ?",
        [id_paciente],
        (err, rows) => {
            if (err || rows.length === 0) {
                return res.status(404).json({ message: "Paciente no encontrado." });
            }
            const { terminos_privacida, filtro_dsm_5 } = rows[0];
            if (terminos_privacida !== 1 || filtro_dsm_5 !== 1) {
                return res.status(403).json({ message: "El paciente debe aceptar los términos de privacidad y cumplir el filtro DSM-5 para realizar la evaluación." });
            }

            db.query(
                "SELECT * FROM especialista WHERE id_especialista = ?",
                [id_especialista],
                (err2, rows2) => {
                    if (err2 || rows2.length === 0) {
                        return res.status(403).json({ message: "Especialista no válido." });
                    }
                    const fecha = new Date();
                    db.query(
                        `INSERT INTO test_adi_r (id_paciente, id_especialista, fecha, algoritmo, tipo_sujeto, estado)
                         VALUES (?, ?, ?, ?, ?, 0)`,
                        [id_paciente, id_especialista, fecha, algoritmo || 0, tipo_sujeto || ""],
                        (err3, result) => {
                            if (err3) return res.status(500).json({ message: "Error al crear test." });
                            res.json({ id_adir: result.insertId });
                        }
                    );
                }
            );
        }
    );
};

// Guardar respuestas ADI-R
exports.guardarRespuestasAdir = (req, res) => {
    const { id_adir } = req.params;
    const { respuestas, observaciones } = req.body;
    const values = Object.keys(respuestas).map(id_pregunta => [
        id_adir,
        id_pregunta,
        respuestas[id_pregunta],
        observaciones[id_pregunta] || ""
    ]);
    db.query(
        "INSERT INTO respuesta_adi (id_adir, id_pregunta, calificacion, observacion) VALUES ?",
        [values],
        (err) => {
            if (err) return res.status(500).json({ message: "Error al guardar respuestas." });

            // Buscar datos del paciente para enviar el correo
            const pacienteQuery = `
                SELECT u.correo, u.nombres, u.apellidos
                FROM test_adi_r t
                JOIN paciente p ON t.id_paciente = p.id_paciente
                JOIN usuario u ON p.id_usuario = u.id_usuario
                WHERE t.id_adir = ?
            `;
            db.query(pacienteQuery, [id_adir], (err2, results) => {
                if (!err2 && results.length > 0) {
                    const { correo, nombres, apellidos } = results[0];
                    enviarCorreoEvaluacionEnviada(correo, nombres, apellidos);
                }
                // No importa si falla el correo, igual respondemos OK
                res.json({ message: "Respuestas guardadas correctamente." });
            });
        }
    );
};

function enviarCorreoEvaluacionEnviada(destinatario, nombre, apellidos) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS
        }
    });

    const mailOptions = {
        from: 'aplicaciondediagnosticodetea@gmail.com',
        to: destinatario,
        subject: 'Evaluación ADI-R enviada',
        text: `Hola ${nombre} ${apellidos},\n\nTu evaluación ADI-R ha sido enviada correctamente. Por favor, mantente pendiente de tus resultados. Un especialista revisará tu caso y pronto recibirás un diagnóstico.\n\nGracias por tu confianza.\n\nSaludos`
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log('Error enviando correo de evaluación enviada:', error);
        } else {
            console.log('Correo de evaluación enviada: ' + info.response);
        }
    });
}


// Listar preguntas ADI-R con área
exports.obtenerPreguntasConAreas = (req, res) => {
    db.query(
        `SELECT p.id_pregunta, p.pregunta, p.id_area, a.area
         FROM pregunta_adi p
         JOIN area a ON p.id_area = a.id_area
         ORDER BY a.id_area, p.id_pregunta`,
        (err, results) => {
            if (err) return res.status(500).json({ message: "Error al obtener preguntas." });
            res.json(results);
        }
    );
};

// Devuelve los códigos válidos para cada pregunta
exports.obtenerCodigosPorPregunta = (req, res) => {
    db.query(
        `SELECT c.id_codigo, c.codigo, c.id_pregunta
         FROM codigo c`,
        (err, results) => {
            if (err) return res.status(500).json({ message: "Error al obtener códigos." });
            // Agrupa por id_pregunta
            const codigosPorPregunta = {};
            results.forEach(row => {
                if (!codigosPorPregunta[row.id_pregunta]) codigosPorPregunta[row.id_pregunta] = [];
                codigosPorPregunta[row.id_pregunta].push({ id_codigo: row.id_codigo, codigo: row.codigo });
            });
            res.json(codigosPorPregunta);
        }
    );
};

// Listar preguntas y respuestas previas para un test
exports.obtenerPreguntasConRespuestas = (req, res) => {
    const { id_adir } = req.params;
    db.query(
        `SELECT p.id_pregunta, p.pregunta, p.id_area, a.area,
                r.codigo as codigo_respuesta, r.observacion
         FROM pregunta_adi p
         JOIN area a ON p.id_area = a.id_area
         LEFT JOIN respuesta_adi r ON r.id_pregunta = p.id_pregunta AND r.id_adir = ?
         ORDER BY a.id_area, p.id_pregunta`,
        [id_adir],
        (err, results) => {
            if (err) return res.status(500).json({ message: "Error al obtener preguntas y respuestas." });
            // Agrupa por área y arma estructura
            const preguntas = [];
            const respuestas = {};
            results.forEach(row => {
                preguntas.push(row);
                if (row.codigo_respuesta !== null) {
                    respuestas[row.id_pregunta] = {
                        codigo: row.codigo_respuesta,
                        observacion: row.observacion
                    };
                }
            });

            // --- NUEVO: obtener datos del paciente ---
            db.query(
                `SELECT p.id_paciente, u.nombres, u.apellidos, p.sexo, p.fecha_nacimiento
                 FROM test_adi_r t
                 JOIN paciente p ON t.id_paciente = p.id_paciente
                 JOIN usuario u ON p.id_usuario = u.id_usuario
                 WHERE t.id_adir = ?`,
                [id_adir],
                (err2, pacienteRows) => {
                    if (err2 || pacienteRows.length === 0) {
                        // Si falla, igual responde preguntas y respuestas
                        return res.json({ preguntas, respuestas });
                    }
                    res.json({
                        preguntas,
                        respuestas,
                        paciente: pacienteRows[0]
                    });
                }
            );
        }
    );
};

// Guardar o actualizar respuesta
exports.guardarRespuestaAdir = (req, res) => {
    const { id_adir, id_pregunta, codigo, observacion } = req.body;
    // Si ya existe, actualiza. Si no, inserta.
    db.query(
        "SELECT id_respuesta FROM respuesta_adi WHERE id_adir = ? AND id_pregunta = ?",
        [id_adir, id_pregunta],
        (err, rows) => {
            if (err) return res.status(500).json({ message: "Error al buscar respuesta." });
            if (rows.length > 0) {
                // Actualizar
                db.query(
                    "UPDATE respuesta_adi SET codigo = ?, observacion = ? WHERE id_adir = ? AND id_pregunta = ?",
                    [codigo, observacion, id_adir, id_pregunta],
                    (err2) => {
                        if (err2) return res.status(500).json({ message: "Error al actualizar respuesta." });
                        res.json({ message: "Respuesta actualizada." });
                    }
                );
            } else {
                // Insertar
                db.query(
                    "INSERT INTO respuesta_adi (id_adir, id_pregunta, codigo, observacion) VALUES (?, ?, ?, ?)",
                    [id_adir, id_pregunta, codigo, observacion],
                    (err2) => {
                        if (err2) return res.status(500).json({ message: "Error al guardar respuesta." });
                        res.json({ message: "Respuesta guardada." });
                    }
                );
            }
        }
    );
};

// Obtener solo el id_paciente a partir de un id_adir
exports.obtenerIdPacientePorAdir = (req, res) => {
    const { id_adir } = req.params;
    db.query(
        "SELECT id_paciente FROM test_adi_r WHERE id_adir = ?",
        [id_adir],
        (err, results) => {
            if (err) return res.status(500).json({ message: "Error al obtener id_paciente." });
            if (results.length === 0) return res.status(404).json({ message: "Test no encontrado." });
            res.json({ id_paciente: results[0].id_paciente });
        }
    );
};

// Determinar y actualizar tipo de sujeto en test_adi_r
exports.determinarYActualizarTipoSujeto = (req, res) => {
    const { id_adir } = req.params;
    // Obtener el código de la pregunta 30 para este test
    db.query(
        `SELECT codigo FROM respuesta_adi WHERE id_adir = ? AND id_pregunta = 30 LIMIT 1`,
        [id_adir],
        (err, rows) => {
            if (err) return res.status(500).json({ message: "Error al consultar código de pregunta 30." });
            if (!rows.length) return res.status(404).json({ message: "No existe respuesta para la pregunta 30." });

            // Conversión algorítmica
            let tipo_sujeto = "no-verbal";
            const codigo = Number(rows[0].codigo);
            if (codigo === 0) tipo_sujeto = "verbal";
            else if (codigo === 1 || codigo === 2) tipo_sujeto = "no-verbal";

            // Actualizar el campo tipo_sujeto en test_adi_r
            db.query(
                `UPDATE test_adi_r SET tipo_sujeto = ? WHERE id_adir = ?`,
                [tipo_sujeto, id_adir],
                (err2) => {
                    if (err2) return res.status(500).json({ message: "Error al actualizar tipo de sujeto." });
                    res.json({ tipo_sujeto });
                }
            );
        }
    );
};

// Obtener la fecha de la entrevista (fecha del test) por id_adir
exports.obtenerFechaEntrevistaPorAdir = (req, res) => {
    const { id_adir } = req.params;
    db.query(
        "SELECT fecha FROM test_adi_r WHERE id_adir = ?",
        [id_adir],
        (err, results) => {
            if (err) return res.status(500).json({ message: "Error al obtener la fecha de la entrevista." });
            if (results.length === 0) return res.status(404).json({ message: "Test no encontrado." });
            res.json({ fecha_entrevista: results[0].fecha });
        }
    );
};

// Guardar o actualizar algoritmo, diagnóstico y estado del test_adi_r
exports.guardarDiagnosticoFinal = (req, res) => {
    const { id_adir } = req.params;
    const { algoritmo, diagnostico, estado } = req.body;
    const query = "UPDATE test_adi_r SET algoritmo = ?, diagnostico = ?, estado = ? WHERE id_adir = ?";
    db.query(query, [algoritmo, diagnostico, estado, id_adir], (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Error al guardar el diagnóstico final." });
        }

        // Buscar datos del paciente para enviar el correo
        const pacienteQuery = `
            SELECT u.correo, u.nombres, u.apellidos
            FROM test_adi_r t
            JOIN paciente p ON t.id_paciente = p.id_paciente
            JOIN usuario u ON p.id_usuario = u.id_usuario
            WHERE t.id_adir = ?
        `;
        db.query(pacienteQuery, [id_adir], (err2, results) => {
            if (!err2 && results.length > 0) {
                const { correo, nombres, apellidos } = results[0];
                enviarCorreoDiagnosticoFinalADI(correo, nombres, apellidos);
            }
            // No importa si falla el correo, igual respondemos OK
            res.json({ message: "Diagnóstico final guardado correctamente." });
        });
    });
};

// Nueva función para enviar el correo de notificación de diagnóstico ADI-R final
function enviarCorreoDiagnosticoFinalADI(destinatario, nombre, apellidos) {
    const transporter = require("nodemailer").createTransport({
        service: "gmail",
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS
        }
    });

    const mensaje = `
Hola ${nombre} ${apellidos},

Te informamos que el diagnóstico de tu test ADI-R ha sido actualizado por el especialista.

Ya puedes consultar el resultado desde la sección de "Resultados" en el sistema TEA Diagnóstico.

Saludos,
Equipo TEA Diagnóstico
`;

    const mailOptions = {
        from: 'aplicaciondediagnosticodetea@gmail.com',
        to: destinatario,
        subject: "Diagnóstico actualizado - Test ADI-R",
        text: mensaje
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log('Error enviando correo de diagnóstico ADI-R:', error);
        } else {
            console.log('Correo de diagnóstico ADI-R enviado: ' + info.response);
        }
    });
}

// Obtener resumen paciente ADI-R
exports.obtenerResumenPacienteAdir = (req, res) => {
    const { id_adir } = req.params;
    // 1. Datos personales y diagnóstico
    const sql = `
        SELECT 
            t.id_adir, t.fecha AS fecha_entrevista, t.diagnostico, t.algoritmo, t.tipo_sujeto, t.estado,
            u.nombres, u.apellidos, 
            ue.nombres AS especialista_nombre, ue.apellidos AS especialista_apellidos
        FROM test_adi_r t
        JOIN paciente p ON t.id_paciente = p.id_paciente
        JOIN usuario u ON p.id_usuario = u.id_usuario
        LEFT JOIN especialista e ON t.id_especialista = e.id_especialista
        LEFT JOIN usuario ue ON e.id_usuario = ue.id_usuario
        WHERE t.id_adir = ?
    `;
    db.query(sql, [id_adir], (err, results) => {
        if (err || results.length === 0) {
            return res.status(404).json({ message: "No se encontró el test." });
        }
        const datos = results[0];

        // 2. Recupera todas las respuestas de ese test
        db.query(
            `SELECT 
                a.area,
                q.id_pregunta, 
                q.pregunta, 
                r.codigo, 
                r.observacion
             FROM respuesta_adi r
             JOIN pregunta_adi q ON r.id_pregunta = q.id_pregunta
             JOIN area a ON q.id_area = a.id_area
             WHERE r.id_adir = ?
             ORDER BY a.id_area, q.id_pregunta`,
            [id_adir],
            (err2, respuestas) => {
                if (err2) return res.status(500).json({ message: "No se pudieron obtener las respuestas." });

                res.json({
                    nombres: datos.nombres,
                    apellidos: datos.apellidos,
                    fecha: datos.fecha_entrevista,
                    especialista: datos.especialista_nombre
                        ? `${datos.especialista_nombre} ${datos.especialista_apellidos}` : "",
                    diagnostico: datos.diagnostico || "Aquí aparecerá el resumen de tu diagnóstico.",
                    algoritmo: datos.algoritmo || "No disponible",
                    tipo_sujeto: datos.tipo_sujeto || "No disponible",
                    respuestas // <-- todas las respuestas con área, pregunta, calificación y observación
                });
            }
        );
    });
};