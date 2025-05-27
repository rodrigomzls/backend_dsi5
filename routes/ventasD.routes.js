const express = require("express");
const router = express.Router();
const ventaDController = require("../controllers/ventasD.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

router.post("/ventasD",  ventaDController.createVentaDetalle);
router.get("/ventasD", ventaDController.getVentasDetalle); 
router.get("/ventasD/:id",  ventaDController.getVentaDetalleById); 
router.put("/ventasD/:id",  ventaDController.updateVentaDetalle);
router.delete("/ventasD/:id", ventaDController.deleteVentaDetalle);

module.exports = router;
