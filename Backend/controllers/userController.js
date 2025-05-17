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

            return res.status(200).json({
                message: "Inicio de sesión exitoso",
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

    // Contraseña genérica
    const contrasenaGenerica = 'Bienvenido123*';

    bcrypt.hash(contrasenaGenerica, 10, (err, hashedContrasena) => {
        if (err) {
            return res.status(500).json({ message: "Error al encriptar la contraseña", error: err });
        }

        const query = "INSERT INTO usuario (nombres, apellidos, direccion, telefono, correo, contrasena, privilegio, imagen, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        db.query(query, [nombres, apellidos, direccion, telefono, correo, hashedContrasena, privilegio, imagen || null, 1], (err, results) => {
            if (err) {
                if (err.code === "ER_DUP_ENTRY") {
                    return res.status(409).json({ message: "El correo ya está registrado" });
                }
                return res.status(500).json({ message: "Error en el servidor", error: err });
            }

            // Enviar correo al usuario
            enviarCorreoBienvenida(correo, contrasenaGenerica, nombres);

            return res.status(201).json({ message: "Usuario registrado exitosamente", userId: results.insertId });
        });
    });
};

// Función para enviar correo
function enviarCorreoBienvenida(destinatario, contrasena, nombre) {
    // Configura tu transporte de correo (ejemplo con Gmail)
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'TU_CORREO@gmail.com',
            pass: 'TU_CONTRASEÑA_DE_APLICACION'
        }
    });

    const mailOptions = {
        from: 'TU_CORREO@gmail.com',
        to: destinatario,
        subject: 'Bienvenido a la Aplicación de Diagnóstico de TEA',
        text: `Hola ${nombre},\n\nTu usuario ha sido creado exitosamente.\n\nUsuario: ${destinatario}\nContraseña: ${contrasena}\n\nPor favor, cambia tu contraseña al iniciar sesión.\n\nSaludos.`
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log('Error enviando correo:', error);
        } else {
            console.log('Correo enviado: ' + info.response);
        }
    });
}

