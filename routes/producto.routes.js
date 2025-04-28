const express = require("express");
const router = express.Router();
const productoController = require("../controllers/producto.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

router.post("/productos", productoController.createProducto);
router.get("/productos",  productoController.getProductos); 
router.get("/productos/:id",  productoController.getProductoById); 
router.put("/productos/:id",  productoController.updateProducto);
router.delete("/productos/:id",  productoController.deleteProducto);

module.exports = router;
