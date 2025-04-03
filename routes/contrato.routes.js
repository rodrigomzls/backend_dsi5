const express = require("express");
const router = express.Router();
const contratoController = require("../controllers/contrato.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

router.post("/contratos",  verifyToken, contratoController.createContrato);
router.get("/contratos",  verifyToken, contratoController.getContratos); 
router.get("/contratos/:id", verifyToken, contratoController.getContratoById); 
router.put("/contratos/:id", verifyToken, contratoController.updateContrato);
router.delete("/contratos/:id", verifyToken, contratoController.deleteContrato);

module.exports = router;
