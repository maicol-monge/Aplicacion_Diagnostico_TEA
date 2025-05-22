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