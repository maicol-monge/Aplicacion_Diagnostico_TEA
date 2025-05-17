const nodemailer = require('nodemailer');
const db = require("../config/db");
const bcrypt = require("bcryptjs");

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

            // Verificar si la contraseña ingresada es la genérica
            const contrasenaGenerica = `Bienvenido123*${user.id_usuario}`;
            if (contrasena === contrasenaGenerica) {
                return res.status(200).json({
                    message: "Contraseña genérica detectada, debe cambiarla",
                    requirePasswordChange: true,
                    user: {
                        id_usuario: user.id_usuario,
                        correo: user.correo
                    }
                });
            }

            // Si no es la genérica, login normal
            return res.status(200).json({
                message: "Inicio de sesión exitoso",
                requirePasswordChange: false,
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
    const { nombres, apellidos, direccion, telefono, correo, privilegio, imagen } = req.body;

    if (!nombres || !apellidos || !direccion || !telefono || !correo || privilegio === undefined) {
        return res.status(400).json({ message: "Todos los campos requeridos deben ser enviados" });
    }

    if (![0, 1].includes(Number(privilegio))) {
        return res.status(400).json({ message: "Privilegio no válido" });
    }

    // Contraseña temporal para cumplir con NOT NULL
    const contrasenaTemporal = 'Temporal123*';

    bcrypt.hash(contrasenaTemporal, 10, (err, hashedContrasenaTemporal) => {
        if (err) {
            return res.status(500).json({ message: "Error al encriptar la contraseña temporal", error: err });
        }

        const query = "INSERT INTO usuario (nombres, apellidos, direccion, telefono, correo, contrasena, privilegio, imagen, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        db.query(query, [nombres, apellidos, direccion, telefono, correo, hashedContrasenaTemporal, privilegio, imagen || null, 1], (err, results) => {
            if (err) {
                if (err.code === "ER_DUP_ENTRY") {
                    return res.status(409).json({ message: "El correo ya está registrado" });
                }
                return res.status(500).json({ message: "Error en el servidor", error: err });
            }

            const id_usuario = results.insertId;
            const contrasenaGenerica = `Bienvenido123*${id_usuario}`;

            bcrypt.hash(contrasenaGenerica, 10, (err, hashedContrasenaFinal) => {
                if (err) {
                    return res.status(500).json({ message: "Error al encriptar la contraseña final", error: err });
                }

                const updateQuery = "UPDATE usuario SET contrasena = ? WHERE id_usuario = ?";
                db.query(updateQuery, [hashedContrasenaFinal, id_usuario], (err) => {
                    if (err) {
                        return res.status(500).json({ message: "Error al actualizar la contraseña", error: err });
                    }

                    // Enviar correo al usuario
                    enviarCorreoBienvenida(correo, contrasenaGenerica, nombres, apellidos);

                    return res.status(201).json({ message: "Usuario registrado exitosamente", userId: id_usuario });
                });
            });
        });
    });
};

exports.cambiarContrasena = (req, res) => {
    const { id_usuario, nuevaContra } = req.body;

    if (!id_usuario || !nuevaContra) {
        return res.status(400).json({ message: "ID de usuario y nueva contraseña son requeridos" });
    }

    // Validación de seguridad de la contraseña (opcional, pero recomendable)
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!regex.test(nuevaContra)) {
        return res.status(400).json({ message: "La contraseña no cumple con los requisitos de seguridad." });
    }

    // Hashear la nueva contraseña
    bcrypt.hash(nuevaContra, 10, (err, hashedPassword) => {
        if (err) {
            return res.status(500).json({ message: "Error al encriptar la contraseña", error: err });
        }

        const query = "UPDATE usuario SET contrasena = ? WHERE id_usuario = ?";
        db.query(query, [hashedPassword, id_usuario], (err, result) => {
            if (err) {
                return res.status(500).json({ message: "Error al actualizar la contraseña", error: err });
            }
            return res.status(200).json({ message: "Contraseña actualizada correctamente" });
        });
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

