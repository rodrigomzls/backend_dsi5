const express = require("express");
const router = express.Router();
const ventaDController = require("../controllers/ventasD.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

router.post("/ventasD", verifyToken, ventaDController.createVentaD);
router.get("/ventasD", ventaDController.getVentasD); 
router.get("/ventasD/:id", verifyToken, ventaDController.getVentaDById); 
router.put("/ventasD/:id", verifyToken, ventaDController.updateVentaD);
router.delete("/ventasD/:id", verifyToken, ventaDController.deleteVentaD);

module.exports = router;
