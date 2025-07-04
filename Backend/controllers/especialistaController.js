const db = require("../config/db");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const JWT_SECRET = process.env.JWT_SECRET;

exports.buscarEspecialistaPorUsuario = (req, res) => {
    const { id_usuario } = req.params;

    if (!id_usuario) {
        return res.status(400).json({ message: "El id_usuario es requerido" });
    }

    const query = "SELECT * FROM especialista WHERE id_usuario = ?";
    db.query(query, [id_usuario], (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Error en el servidor", error: err });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: "Especialista no encontrado" });
        }

        const especialista = results[0];

        // Genera el token JWT para el especialista
        const payload = {
            id_especialista: especialista.id_especialista,
            id_usuario: especialista.id_usuario
        };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "2h" });

        return res.status(200).json({
            message: "Especialista encontrado exitosamente",
            token,
            especialista: {
                id_especialista: especialista.id_especialista,
                id_usuario: especialista.id_usuario,
                especialidad: especialista.especialidad,
                terminos_privacida: especialista.terminos_privacida
            }
        });
    });
};

exports.aceptarConsentimientoEspecialista = (req, res) => {
    const { id_usuario, correo, nombres, apellidos } = req.body;
    if (!id_usuario || !correo) {
        return res.status(400).json({ message: "Datos incompletos" });
    }

    // Actualiza el campo terminos_privacida en la tabla especialista
    const query = "UPDATE especialista SET terminos_privacida = 1 WHERE id_usuario = ?";
    db.query(query, [id_usuario], (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Error al actualizar consentimiento", error: err });
        }

        // Invoca la función para enviar el correo
        enviarCorreoConsentimientoEspecialista(correo, nombres, apellidos);

        return res.status(200).json({ message: "Consentimiento registrado y correo enviado" });
    });
};

// Función para enviar el correo de consentimiento informado profesional
function enviarCorreoConsentimientoEspecialista(destinatario, nombre, apellidos) {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS
        }
    });

    const consentimiento = `
Consentimiento y declaración de uso profesional del sistema de evaluación del Trastorno del Espectro Autista (TEA)

Estimado/a ${nombre} ${apellidos},

Usted ha aceptado los términos y condiciones profesionales para el uso de la plataforma TEA.
Fecha de aceptación: ${new Date().toLocaleString()}

Gracias por su compromiso profesional.
`;

    const mailOptions = {
        from: process.env.GMAIL_USER,
        to: destinatario,
        subject: "Consentimiento profesional aceptado - TEA Diagnóstico",
        text: consentimiento,
        attachments: [
            {
                filename: 'Consentimiento_Profesional_TEA.pdf',
                path: 'https://xbfnefyndfqlspnyexsh.supabase.co/storage/v1/object/public/tea//Consentimiento%20profesional.pdf' // Cambia esto por la URL pública de tu PDF
            }
        ]
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log('Error enviando correo de consentimiento profesional:', error);
        } else {
            console.log('Correo de consentimiento profesional enviado: ' + info.response);
        }
    });
}

// Obtener pacientes con tests ADI-R y/o ADOS-2 recientes
exports.pacientesConTests = (req, res) => {
    // Solo usuarios activos y pacientes activos
    const query = `
        SELECT 
            p.id_paciente, u.nombres, u.apellidos, u.imagen, p.fecha_nacimiento, p.sexo,
            (
                SELECT MAX(fecha) FROM test_adi_r WHERE id_paciente = p.id_paciente AND estado = 1
            ) AS fecha_ultimo_adir,
            (
                SELECT MAX(fecha) FROM test_ados_2 WHERE id_paciente = p.id_paciente AND estado = 0
            ) AS fecha_ultimo_ados
        FROM paciente p
        JOIN usuario u ON p.id_usuario = u.id_usuario
        WHERE u.estado = 1
        ORDER BY 
            GREATEST(
                IFNULL((SELECT MAX(fecha) FROM test_adi_r WHERE id_paciente = p.id_paciente AND estado = 1), '1970-01-01'),
                IFNULL((SELECT MAX(fecha) FROM test_ados_2 WHERE id_paciente = p.id_paciente AND estado = 0), '1970-01-01')
            ) DESC
    `;

    db.query(query, async (err, pacientes) => {
        if (err) return res.status(500).json({ message: "Error en el servidor", error: err });

        // Para cada paciente, obtener sus tests ADI-R y ADOS-2
        const pacientesConTests = await Promise.all(pacientes.map(async (paciente) => {
            // Tests ADI-R
            const adirPromise = new Promise((resolve) => {
                db.query(
                    "SELECT id_adir, fecha, algoritmo, diagnostico, estado FROM test_adi_r WHERE id_paciente = ? AND estado = 1 ORDER BY fecha DESC",
                    [paciente.id_paciente],
                    (err, adir) => resolve(adir || [])
                );
            });
            // Tests ADOS-2
            const adosPromise = new Promise((resolve) => {
                db.query(
                    "SELECT id_ados, fecha, modulo, diagnostico, clasificacion, total_punto, puntuacion_comparativa, estado FROM test_ados_2 WHERE id_paciente = ? AND estado = 0 ORDER BY fecha DESC",
                    [paciente.id_paciente],
                    (err, ados) => resolve(ados || [])
                );
            });

            const [tests_adir, tests_ados] = await Promise.all([adirPromise, adosPromise]);
            return { ...paciente, tests_adir, tests_ados };
        }));

        res.json(pacientesConTests);
    });
};


