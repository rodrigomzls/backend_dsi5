const express = require("express");
const router = express.Router();
const ventaController = require("../controllers/ventas.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

// Rutas para ventas
router.post("/ventas", verifyToken, ventaController.createVenta);
router.get("/ventas", verifyToken, ventaController.getVentas);
router.get("/ventas/:id", verifyToken, ventaController.getVentaById);
router.put("/ventas/:id", verifyToken, ventaController.updateVenta);
router.delete("/ventas/:id", verifyToken, ventaController.deleteVenta);
// Rutas para filtrar ventas
router.get("/ventas/mes", verifyToken, ventaController.obtenerVentasPorMes);
router.post("/ventas/filtrar/mes", verifyToken, ventaController.filtrarVentasPorMes);
router.post("/ventas/filtrar/año", verifyToken, ventaController.filtrarVentasPorYear);
router.post("/ventas/filtrar/año-mes", verifyToken, ventaController.filtrarVentasPorYearYMes);
module.exports = router;