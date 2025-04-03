require('dotenv').config();
const express = require('express');
const cors = require('cors');

//obtengo mis rutas
const authRoutes = require("./routes/auth.routes");
const usuarioaRoutes = require("./routes/usuario.routes");
const clienteRoutes = require("./routes/cliente.routes");
const ventasRoutes = require("./routes/ventas.routes");
const ventasDRoutes = require("./routes/ventasD.routes");
const productoRoutes = require("./routes/producto.routes");
const proveedorRoutes = require("./routes/proveedor.routes");
const categoriaRoutes = require("./routes/categoria.routes");
const contratoRoutes = require("./routes/contrato.routes");
const stockRoutes = require("./routes/stock.routes");
const telefonoRoutes = require("./routes/telefono.routes");



const app = express();
app.use(cors());
app.use(express.json());

//deafult
app.get("/", (_req,res) => {
  res.send("Welcome to BackEnd");
});

//rutas
app.use("/api/v1", authRoutes);
app.use("/api/v1", usuarioaRoutes);
app.use("/api/v1", clienteRoutes);
app.use("/api/v1", ventasRoutes);
app.use("/api/v1", ventasDRoutes);
app.use("/api/v1", productoRoutes);
app.use("/api/v1", proveedorRoutes);
app.use("/api/v1", categoriaRoutes);
app.use("/api/v1", contratoRoutes);
app.use("/api/v1", stockRoutes);
app.use("/api/v1", telefonoRoutes);



const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`Servidor corriendose en http://localhost:${PORT} 🥵`);
});
