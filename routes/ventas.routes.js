const express = require("express");
const router = express.Router();
const ventaController = require("../controllers/ventas.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

router.post("/ventas", verifyToken, ventaController.createVenta);
router.get("/ventas", verifyToken, ventaController.getVentas); 
router.get("/ventas/:id", verifyToken, ventaController.getVentaById); 
router.put("/ventas/:id", verifyToken, ventaController.updateVenta);
router.delete("/ventas/:id", verifyToken, ventaController.deleteVenta);

module.exports = router;
