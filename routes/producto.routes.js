const express = require("express");
const router = express.Router();
const productoController = require("../controllers/producto.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

router.post("/productos", verifyToken, productoController.createProducto);
router.get("/productos", verifyToken, productoController.getProductos); 
router.get("/productos/:id", verifyToken, productoController.getProductoById); 
router.put("/productos/:id", verifyToken, productoController.updateProducto);
router.delete("/productos/:id", verifyToken, productoController.deleteProducto);

module.exports = router;
