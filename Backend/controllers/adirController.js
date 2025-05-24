const db = require("../config/db");

// Listar tests ADIR por paciente
exports.listarTestsPorPaciente = (req, res) => {
    const { id_paciente } = req.params;
    const query = `
        SELECT t.id_adir, t.fecha, t.diagnostico
        FROM test_adi_r t
        WHERE t.id_paciente = ?
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
        SELECT t.id_adir, t.fecha, t.diagnostico, p.id_paciente, u.nombres, u.apellidos, p.sexo, p.fecha_nacimiento
        FROM test_adi_r t
        JOIN paciente p ON t.id_paciente = p.id_paciente
        JOIN usuario u ON p.id_usuario = u.id_usuario
        WHERE t.id_adir = ?
    `;
    db.query(testQuery, [id_adir], (err, testResults) => {
        if (err || testResults.length === 0) {
            return res.status(404).json({ message: "Test no encontrado." });
        }
        const respuestasQuery = `
            SELECT r.id_pregunta, a.area, q.pregunta, r.calificacion, r.observacion
            FROM respuesta_adi r
            JOIN pregunta_adi q ON r.id_pregunta = q.id_pregunta
            JOIN area a ON q.id_area = a.id_area
            WHERE r.id_adir = ?
        `;
        db.query(respuestasQuery, [id_adir], (err2, respuestas) => {
            if (err2) {
                return res.status(500).json({ message: "Error al obtener respuestas." });
            }
            res.json({
                test: testResults[0],
                respuestas
            });
        });
    });
};

// Guardar diagnóstico
exports.guardarDiagnostico = (req, res) => {
    const { id_adir } = req.params;
    const { diagnostico } = req.body;
    const query = "UPDATE test_adi_r SET diagnostico = ? WHERE id_adir = ?";
    db.query(query, [diagnostico, id_adir], (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Error al guardar el diagnóstico." });
        }
        res.json({ message: "Diagnóstico guardado correctamente." });
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

exports.obtenerPreguntasTestCompleto = (req, res) => {
    db.query(
        `SELECT p.id_pregunta, p.pregunta, p.id_area, a.area
         FROM pregunta_adi p
         INNER JOIN area a ON p.id_area = a.id_area
         ORDER BY p.id_area, p.id_pregunta`,
        (err, data) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ mensaje: "Error al obtener preguntas del test completo" });
            }
            res.json(data);
        }
    );
};

// Obtener preguntas por área
exports.getPreguntasConAreas = async (req, res) => {
    try {
        const [data] = await db.query(`
            SELECT p.id_pregunta, p.pregunta, p.id_area, a.area
            FROM pregunta_adi p
            JOIN area a ON p.id_area = a.id_area
            ORDER BY p.id_area, p.id_pregunta
        `);
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error al obtener preguntas con áreas" });
    }
};



exports.crearTestAdirConRespuestas = (req, res) => {
    const { id_paciente, respuestas } = req.body;

    // Ambos deben ser nulos
    const id_especialista = null;
    const diagnostico = null;

    if (!id_paciente || !Array.isArray(respuestas) || respuestas.length === 0) {
        return res.status(400).json({ mensaje: "Faltan datos requeridos o respuestas" });
    }

    const fecha = new Date();

    // 1. Crear el test ADIR
    db.query(
        `INSERT INTO test_adi_r (id_paciente, id_especialista, fecha, diagnostico) VALUES (?, ?, ?, ?)`,
        [id_paciente, id_especialista, fecha, diagnostico],
        (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: "Error al crear test" });
            }
            const id_adir = result.insertId;

            // 2. Guardar todas las respuestas asociadas a ese test
            let insertCount = 0;
            let errorOcurred = false;

            respuestas.forEach((r) => {
                const observacion = (typeof r.observacion === "string") ? r.observacion : "";
                db.query(
                    `INSERT INTO respuesta_adi (id_adir, id_pregunta, calificacion, observacion)
                     VALUES (?, ?, ?, ?)`,
                    [id_adir, r.id_pregunta, r.calificacion, observacion],
                    (err2) => {
                        if (errorOcurred) return;
                        if (err2) {
                            errorOcurred = true;
                            console.error("Error MySQL:", err2);
                            return res.status(500).json({ mensaje: "Error al guardar respuestas", error: err2 });
                        }
                        insertCount++;
                        if (insertCount === respuestas.length) {
                            res.status(200).json({ mensaje: "Test y respuestas guardadas correctamente", id_adir });
                        }
                    }
                );
            });
        }
    );
};


