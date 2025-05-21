require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

//obtengo mis rutas
const authRoutes = require("./routes/auth.routes");
const usuarioRoutes = require("./routes/usuario.routes");
const clienteRoutes = require("./routes/cliente.routes");
const ventasRoutes = require("./routes/ventas.routes");
const ventasDRoutes = require("./routes/ventasD.routes");
const productoRoutes = require("./routes/producto.routes");
const proveedorRoutes = require("./routes/proveedor.routes");
const categoriaRoutes = require("./routes/categoria.routes");
const contratoRoutes = require("./routes/contrato.routes");
const stockRoutes = require("./routes/stock.routes");
const telefonoRoutes = require("./routes/telefono.routes");
const logsRoutes = require("./routes/logs.routes"); 


const app = express();

// Configuración de seguridad
app.use(helmet());

// Configuración CORS más estricta
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};
app.use(cors(corsOptions));

// Validar variables de entorno requeridas
const requiredEnvVars = ['JWT_SECRET', 'DB_HOST', 'DB_USER', 'DB_NAME'];
requiredEnvVars.forEach(envVar => {
  if (!process.env[envVar]) {
    console.error(`Error: La variable de entorno ${envVar} no está definida`);
    process.exit(1);
  }
});

app.use(cors({
  origin: 'http://localhost:3000', // o el puerto de tu frontend
  credentials: true
}));

app.use(express.json());

// Ruta default
app.get("/", (_req, res) => {
  res.json({
    message: "BACKEND KYM",
    version: "15.9.85"
  });
});


// rutas
app.use("/api/v1", authRoutes);
app.use("/api/v1", usuarioRoutes);
app.use("/api/v1", clienteRoutes);
app.use("/api/v1", ventasRoutes);
app.use("/api/v1", ventasDRoutes);
app.use("/api/v1", productoRoutes);
app.use("/api/v1", proveedorRoutes);
app.use("/api/v1", categoriaRoutes);
app.use("/api/v1", contratoRoutes);
app.use("/api/v1", stockRoutes);
app.use("/api/v1", telefonoRoutes);
app.use("/api/v1", logsRoutes); 

// Manejo de rutas no encontradas
app.use((_req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});


const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`Servidor corriendose en http://localhost:${PORT} 🥵`);
});
