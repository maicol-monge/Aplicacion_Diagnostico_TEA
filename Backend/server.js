require("dotenv").config(); //Cargar variables d entorno
const express = require("express"); //Crear servidor web
const cors = require("cors"); //Para permitir solicitudes desde otro dominio

const db = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const pacienteRoutes = require("./routes/pacienteRoutes");
const especialistaRoutes = require("./routes/especialistaRoutes");
const adirRoutes = require('./routes/adirRoutes');
const adminRoutes = require('./routes/adminRoutes');
const adosRoutes = require('./routes/adosRoutes');

const app = express(); //Instancia del servidor
app.use(cors()); //Evitar errores al consumir en React
app.use(express.json()); //Recibir los datos en JSON

db.connect((err) => {
  if (err) {
    console.error("Error conectando a la base de datos:", err);
    process.exit(1); // Sale de la aplicación en caso de error
  }
  console.log("Conectado a la base de datos MySQL");
});

// Rutas
app.use("/api/users", userRoutes);
app.use("/api/pacientes", pacienteRoutes);
app.use("/api/especialistas", especialistaRoutes);
app.use('/api/adir', adirRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ados', adosRoutes);

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en el puerto ${PORT}`);
});
