const db = require("../config/db");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const JWT_SECRET = process.env.JWT_SECRET;

exports.buscarPacientePorUsuario = (req, res) => {
    const { id_usuario } = req.params;

    if (!id_usuario) {
        return res.status(400).json({ message: "El id_usuario es requerido" });
    }

    const query = "SELECT * FROM paciente WHERE id_usuario = ?";
    db.query(query, [id_usuario], (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Error en el servidor", error: err });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: "Paciente no encontrado" });
        }

        const paciente = results[0];

        // Genera el token JWT para el paciente
        const payload = {
            id_paciente: paciente.id_paciente,
            id_usuario: paciente.id_usuario
        };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "2h" });

        return res.status(200).json({
            message: "Paciente encontrado exitosamente",
            token,
            paciente: {
                id_paciente: paciente.id_paciente,
                id_usuario: paciente.id_usuario,
                fecha_nacimiento: paciente.fecha_nacimiento,
                sexo: paciente.sexo,
                filtro_dsm_5: paciente.filtro_dsm_5,
                terminos_privacida: paciente.terminos_privacida
            }
        });
    });
};

exports.aceptarConsentimiento = (req, res) => {
    const { id_usuario, correo, nombres, apellidos } = req.body;
    if (!id_usuario || !correo) {
        return res.status(400).json({ message: "Datos incompletos" });
    }

    // Actualiza el campo terminos_privacida en la tabla paciente
    const query = "UPDATE paciente SET terminos_privacida = 1 WHERE id_usuario = ?";
    db.query(query, [id_usuario], (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Error al actualizar consentimiento", error: err });
        }

        // Invoca la función para enviar el correo
        enviarCorreoConsentimiento(correo, nombres, apellidos);

        return res.status(200).json({ message: "Consentimiento registrado y correo enviado" });
    });
};

// Función para enviar el correo de consentimiento informado
function enviarCorreoConsentimiento(destinatario, nombre, apellidos) {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS
        }
    });

    const consentimiento = `
Consentimiento informado para el uso de la aplicación de evaluación del Trastorno del Espectro Autista (TEA)

Estimado/a ${nombre} ${apellidos},

Usted ha aceptado los términos y condiciones para el uso de la aplicación TEA. 
Fecha de aceptación: ${new Date().toLocaleString()}

Gracias por su confianza.
`;

    const mailOptions = {
        from: 'aplicaciondediagnosticodetea@gmail.com',
        to: destinatario,
        subject: "Consentimiento informado aceptado - TEA Diagnóstico",
        text: consentimiento,
        attachments: [
            {
                filename: 'Consentimiento_TEA.pdf',
                path: 'https://xbfnefyndfqlspnyexsh.supabase.co/storage/v1/object/public/tea//Consentimiento%20informado%20(1).pdf' // URL pública del PDF
            }
        ]
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log('Error enviando correo de consentimiento:', error);
        } else {
            console.log('Correo de consentimiento enviado: ' + info.response);
        }
    });
}

exports.guardarDsm5 = (req, res) => {
    const { id_usuario, resultado } = req.body;
    if (!id_usuario) return res.status(400).json({ message: "Falta id_usuario" });

    // Guarda el resultado en el campo filtro_dsm_5 (1 = recomendado, 0 = no recomendado)
    const valor = resultado === "Se recomienda aplicar las pruebas ADOS-2 y ADI-R." ? 1 : 0;
    db.query(
        "UPDATE paciente SET filtro_dsm_5 = ? WHERE id_usuario = ?",
        [valor, id_usuario],
        (err) => {
            if (err) return res.status(500).json({ message: "Error al guardar resultado", error: err });
            return res.status(200).json({ message: "Resultado guardado", filtro_dsm_5: valor });
        }
    );
};

exports.validarTerminos = (req, res) => {
    const { id_usuario } = req.params;
    db.query(
        "SELECT terminos_privacida FROM paciente WHERE id_usuario = ?",
        [id_usuario],
        (err, results) => {
            if (err || results.length === 0) return res.json({ permitido: false });
            return res.json({ permitido: results[0].terminos_privacida === 1 });
        }
    );
};

exports.desactivarCuenta = (req, res) => {
    const { id_usuario } = req.params;

    // Primero obtenemos el correo y nombre del usuario
    const queryUser = "SELECT correo, nombres, apellidos FROM usuario WHERE id_usuario = ?";
    db.query(queryUser, [id_usuario], (err, results) => {
        if (err || results.length === 0) {
            return res.status(500).json({ message: "Error al obtener datos del usuario", error: err });
        }
        const { correo, nombres, apellidos } = results[0];

        // Actualiza el estado de la cuenta a desactivado (0)
        const query = "UPDATE usuario SET estado = 0 WHERE id_usuario = ?";
        db.query(query, [id_usuario], (err, result) => {
            if (err) {
                return res.status(500).json({ message: "Error al desactivar cuenta", error: err });
            }

            // Envía el correo de notificación
            enviarCorreoDesactivacion(correo, nombres, apellidos);

            return res.status(200).json({ message: "Cuenta desactivada exitosamente" });
        });
    });
};

// Función para enviar el correo de desactivación
function enviarCorreoDesactivacion(destinatario, nombre, apellidos) {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS
        }
    });

    const mensaje = `
Hola ${nombre} ${apellidos},

Te informamos que tu cuenta en la aplicación de diagnóstico TEA ha sido desactivada exitosamente.

Si esto fue un error o necesitas reactivar tu cuenta, por favor contacta al administrador al correo aplicaciondediagnosticodetea@gmail.com.

Saludos,
Equipo TEA Diagnóstico
`;

    const mailOptions = {
        from: 'aplicaciondediagnosticodetea@gmail.com',
        to: destinatario,
        subject: "Cuenta desactivada - TEA Diagnóstico",
        text: mensaje
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log('Error enviando correo de desactivación:', error);
        } else {
            console.log('Correo de desactivación enviado: ' + info.response);
        }
    });
}

// ...existing code...

// Listar todos los tests (ADI-R y ADOS-2) de un paciente, con filtros opcionales
exports.listarResultadosPaciente = (req, res) => {
    const { id_paciente } = req.params;
    const { tipo, fecha_inicio, fecha_fin } = req.query;

    if (!id_paciente) {
        return res.status(400).json({ message: "El id_paciente es requerido" });
    }

    // Construir consultas según filtros
    let consultas = [];

    // Filtros de fechas
    let filtroFechaAdiR = "";
    let filtroFechaAdos = "";
    if (fecha_inicio) {
        filtroFechaAdiR += ` AND fecha >= '${fecha_inicio} 00:00:00'`;
        filtroFechaAdos += ` AND fecha >= '${fecha_inicio} 00:00:00'`;
    }
    if (fecha_fin) {
        filtroFechaAdiR += ` AND fecha <= '${fecha_fin} 23:59:59'`;
        filtroFechaAdos += ` AND fecha <= '${fecha_fin} 23:59:59'`;
    }

    // Si no hay filtro de tipo o es ambos
    if (!tipo || tipo === "todos") {
        consultas.push(new Promise((resolve) => {
            db.query(
                `SELECT id_adir as id, fecha, diagnostico, 'ADI-R' as tipo FROM test_adi_r WHERE id_paciente = ? AND estado = 1${filtroFechaAdiR}`,
                [id_paciente],
                (err, rows) => resolve(rows || [])
            );
        }));
        consultas.push(new Promise((resolve) => {
            db.query(
                `SELECT id_ados as id, fecha, diagnostico, clasificacion, modulo, 'ADOS-2' as tipo FROM test_ados_2 WHERE id_paciente = ? AND estado = 0${filtroFechaAdos}`,
                [id_paciente],
                (err, rows) => resolve(rows || [])
            );
        }));
    } else if (tipo === "adir") {
        consultas.push(new Promise((resolve) => {
            db.query(
                `SELECT id_adir as id, fecha, diagnostico, 'ADI-R' as tipo FROM test_adi_r WHERE id_paciente = ? AND estado = 1${filtroFechaAdiR}`,
                [id_paciente],
                (err, rows) => resolve(rows || [])
            );
        }));
    } else if (tipo === "ados") {
        consultas.push(new Promise((resolve) => {
            db.query(
                `SELECT id_ados as id, fecha, diagnostico, clasificacion, modulo, 'ADOS-2' as tipo FROM test_ados_2 WHERE id_paciente = ? AND estado = 0${filtroFechaAdos}`,
                [id_paciente],
                (err, rows) => resolve(rows || [])
            );
        }));
    }

    Promise.all(consultas).then(results => {
        // Unir y ordenar por fecha descendente
        let tests = [].concat(...results);
        tests.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
        res.json(tests);
    }).catch(() => {
        res.status(500).json({ message: "Error al obtener resultados" });
    });
};

// ...existing code...