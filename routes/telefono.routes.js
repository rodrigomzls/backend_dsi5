const express = require("express");
const router = express.Router();
const telefonoController = require("../controllers/telefono.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

router.post("/telefonos",  verifyToken, telefonoController.createTelefono);
router.get("/telefonos",  verifyToken, telefonoController.getTelefonos); 
router.get("/telefonos/:id", verifyToken, telefonoController.getTelefonoById); 
router.put("/telefonos/:id", verifyToken, telefonoController.updateTelefono);
router.delete("/telefonos/:id", verifyToken, telefonoController.deleteTelefono);

module.exports = router;
