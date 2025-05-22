const nodemailer = require('nodemailer');
const db = require("../config/db");
const bcrypt = require("bcryptjs");
const generatePassword = require('generate-password');
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

exports.login = (req, res) => {
    const { correo, contrasena } = req.body;

    if (!correo || !contrasena) {
        return res.status(400).json({ message: "Correo y contraseña son requeridos" });
    }

    const query = "SELECT * FROM usuario WHERE correo = ?";
    db.query(query, [correo], (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Error en el servidor", error: err });
        }

        if (results.length === 0) {
            return res.status(401).json({ message: "Correo o contraseña incorrectos" });
        }

        const user = results[0];

        bcrypt.compare(contrasena, user.contrasena, (err, isMatch) => {
            if (err) {
                return res.status(500).json({ message: "Error al verificar la contraseña", error: err });
            }

            if (!isMatch) {
                return res.status(401).json({ message: "Correo o contraseña incorrectos" });
            }

            // Si requiere cambio de contraseña
            if (user.requiere_cambio_contrasena === 1) {
                const payload = {
                    id_usuario: user.id_usuario,
                    correo: user.correo,
                    privilegio: user.privilegio
                };
                const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "2h" });


                return res.status(200).json({
                    message: "Contraseña genérica detectada, debe cambiarla",
                    requirePasswordChange: true,
                    token, // <-- aquí va el JWT
                    user: {
                        id_usuario: user.id_usuario,
                        correo: user.correo
                    }
                });
            }

            // Login normal: genera el token
            const payload = {
                id_usuario: user.id_usuario,
                correo: user.correo,
                privilegio: user.privilegio
            };
            const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "2h" });

            return res.status(200).json({
                message: "Inicio de sesión exitoso",
                requirePasswordChange: false,
                token, // <-- aquí va el JWT
                user: {
                    id_usuario: user.id_usuario,
                    nombres: user.nombres,
                    apellidos: user.apellidos,
                    correo: user.correo,
                    privilegio: user.privilegio,
                    imagen: user.imagen,
                    estado: user.estado
                }
            });
        });
    });
};

exports.registrar = (req, res) => {
    const { nombres, apellidos, direccion, telefono, correo, privilegio, imagen, fecha_nacimiento, sexo, especialidad } = req.body;

    if (!nombres || !apellidos || !direccion || !telefono || !correo || privilegio === undefined) {
        return res.status(400).json({ message: "Todos los campos requeridos deben ser enviados" });
    }

    if (![0, 1].includes(Number(privilegio))) {
        return res.status(400).json({ message: "Privilegio no válido" });
    }

    // Validaciones adicionales según privilegio
    if (Number(privilegio) === 1) {
        if (!fecha_nacimiento || !sexo) {
            return res.status(400).json({ message: "Fecha de nacimiento y sexo son requeridos para paciente." });
        }
        if (!['M', 'F'].includes(sexo)) {
            return res.status(400).json({ message: "Sexo debe ser 'M' o 'F'." });
        }
    }
    if (Number(privilegio) === 0) {
        if (!especialidad) {
            return res.status(400).json({ message: "Especialidad es requerida para especialista." });
        }
    }

    // Generar contraseña genérica aleatoria y segura
    const contrasenaGenerica = generatePassword.generate({
        length: 15,
        numbers: true,
        symbols: true,
        uppercase: true,
        lowercase: true,
        strict: true
    });

    bcrypt.hash(contrasenaGenerica, 10, (err, hashedContrasenaGenerica) => {
        if (err) {
            return res.status(500).json({ message: "Error al encriptar la contraseña", error: err });
        }

        const query = "INSERT INTO usuario (nombres, apellidos, direccion, telefono, correo, contrasena, privilegio, imagen, estado, requiere_cambio_contrasena) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        db.query(query, [nombres, apellidos, direccion, telefono, correo, hashedContrasenaGenerica, privilegio, imagen || null, 1, 1], (err, results) => {
            if (err) {
                if (err.code === "ER_DUP_ENTRY") {
                    return res.status(409).json({ message: "El correo ya está registrado" });
                }
                return res.status(500).json({ message: "Error en el servidor", error: err });
            }

            const id_usuario = results.insertId;

            // Insertar en tabla paciente o especialista según privilegio
            if (Number(privilegio) === 1) {
                const pacienteQuery = "INSERT INTO paciente (id_usuario, fecha_nacimiento, sexo) VALUES (?, ?, ?)";
                db.query(pacienteQuery, [id_usuario, fecha_nacimiento, sexo], (err) => {
                    if (err) {
                        return res.status(500).json({ message: "Error al registrar paciente", error: err });
                    }
                    enviarCorreoBienvenida(correo, contrasenaGenerica, nombres, apellidos);
                    return res.status(201).json({ message: "Paciente registrado exitosamente", userId: id_usuario });
                });
            } else if (Number(privilegio) === 0) {
                const especialistaQuery = "INSERT INTO especialista (id_usuario, especialidad) VALUES (?, ?)";
                db.query(especialistaQuery, [id_usuario, especialidad], (err) => {
                    if (err) {
                        return res.status(500).json({ message: "Error al registrar especialista", error: err });
                    }
                    enviarCorreoBienvenida(correo, contrasenaGenerica, nombres, apellidos);
                    return res.status(201).json({ message: "Especialista registrado exitosamente", userId: id_usuario });
                });
            }
        });
    });
};

exports.cambiarContrasena = (req, res) => {
    const { id_usuario, nuevaContra } = req.body;

    if (!id_usuario || !nuevaContra) {
        return res.status(400).json({ message: "ID de usuario y nueva contraseña son requeridos" });
    }

    // Validación de seguridad de la contraseña
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!regex.test(nuevaContra)) {
        return res.status(400).json({ message: "La contraseña no cumple con los requisitos de seguridad." });
    }

    // Hashear la nueva contraseña
    bcrypt.hash(nuevaContra, 10, (err, hashedPassword) => {
        if (err) {
            return res.status(500).json({ message: "Error al encriptar la contraseña", error: err });
        }

        // Cambia la contraseña y actualiza el flag
        const query = "UPDATE usuario SET contrasena = ?, requiere_cambio_contrasena = 0 WHERE id_usuario = ?";
        db.query(query, [hashedPassword, id_usuario], (err, result) => {
            if (err) {
                return res.status(500).json({ message: "Error al actualizar la contraseña", error: err });
            }
            return res.status(200).json({ message: "Contraseña actualizada correctamente" });
        });
    });
};

exports.listarPacientes = (req, res) => {
    const query = `
        SELECT p.id_paciente, u.nombres, u.apellidos, p.sexo, p.fecha_nacimiento
        FROM paciente p
        JOIN usuario u ON p.id_usuario = u.id_usuario
        ORDER BY u.nombres
    `;
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ message: "Error al obtener pacientes." });
        res.json(results); // <-- debe ser un array, NO { pacientes: results }
    });
};

// Función para enviar correo
function enviarCorreoBienvenida(destinatario, contrasena, nombre, apellidos) {
    // Configura tu transporte de correo (ejemplo con Gmail)
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
        subject: 'Bienvenido a la Aplicación de Diagnóstico de TEA',
        text: `Hola ${nombre} ${apellidos},\n\nTu usuario ha sido creado exitosamente.\n\nUsuario: ${destinatario}\nContraseña: ${contrasena}\n\nPor favor, cambia tu contraseña al iniciar sesión.\n\nSaludos.`
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log('Error enviando correo:', error);
        } else {
            console.log('Correo enviado: ' + info.response);
        }
    });
}

