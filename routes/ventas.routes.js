const express = require("express");
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // o configuración
const ventaController = require("../controllers/ventas.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

// Rutas para ventas
router.post("/ventas",  ventaController.createVenta);
router.get("/ventas", ventaController.getVentas);
router.get("/ventas/:id", ventaController.getVentaById);
router.put("/ventas/:id", ventaController.updateVenta);
router.delete("/ventas/:id", ventaController.deleteVenta);

// Rutas para filtrar ventas
router.get("/ventas/mes",  ventaController.obtenerVentasPorMes);
router.post("/ventas/filtrar/mes",  ventaController.filtrarVentasPorMes);
router.post("/ventas/filtrar/año",  ventaController.filtrarVentasPorYear);
router.post("/ventas/filtrar/año-mes",  ventaController.filtrarVentasPorYearYMes);

// Asegúrate de que el controlador está correctamente importado
router.post("/ventas/completa", verifyToken, upload.any(), ventaController.crearVentaCompleta);

module.exports = router;