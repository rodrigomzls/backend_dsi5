const express = require("express");
const router = express.Router();
const proveedorController = require("../controllers/proveedor.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

router.post("/proveedores", verifyToken, proveedorController.createProveedor);
router.get("/proveedores", verifyToken, proveedorController.getProveedores); 
router.get("/proveedores/:id", verifyToken, proveedorController.getProveedorById); 
router.put("/proveedores/:id", verifyToken, proveedorController.updateProveedor);
router.delete("/proveedores/:id", verifyToken, proveedorController.deleteProveedor);

module.exports = router;
