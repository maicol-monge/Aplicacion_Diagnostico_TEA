const db = require("../config/db");

const { enviarCorreoDiagnostico } = require('./userController'); // Importa la función

const { PDFDocument, rgb } = require('pdf-lib');
const dayjs = require('dayjs');
const fs = require('fs');
const path = require('path');


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
exports.generarPdfAdir = async (req, res) => {
    const { id_adir } = req.params;
    try {
        const [adir] = await db.query('SELECT * FROM test_adi_r WHERE id_adir = ?', [id_adir]);
        if (!adir) return res.status(404).json({ message: "No existe el test." });
        const [paciente] = await db.query('SELECT * FROM paciente WHERE id_paciente = ?', [adir.id_paciente]);
        const [usuarioPaciente] = await db.query('SELECT * FROM usuario WHERE id_usuario = ?', [paciente.id_usuario]);
        const [especialista] = await db.query('SELECT * FROM especialista WHERE id_especialista = ?', [adir.id_especialista]);
        const [usuarioEspecialista] = await db.query('SELECT * FROM usuario WHERE id_usuario = ?', [especialista.id_usuario]);
        const respuestas = await db.query(`
            SELECT r.*, p.pregunta FROM respuesta_adi r 
            JOIN pregunta_adi p ON p.id_pregunta = r.id_pregunta
            WHERE r.id_adir = ?
        `, [id_adir]);

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

        drawText(`Entrevistador: ${usuarioEspecialista.nombres} ${usuarioEspecialista.apellidos}`, 30, height - 145);
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
};