const express = require("express");
const router = express.Router();
const productoController = require("../controllers/producto.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

// Rutas CRUD básicas
router.post("/productos", verifyToken, productoController.createProducto);
router.get("/productos", productoController.getProductos);
router.get("/productos/:id", productoController.getProductoById);
router.put("/productos/:id", verifyToken, productoController.updateProducto);
router.delete("/productos/:id", verifyToken, productoController.deleteProducto);

// Rutas avanzadas SIN barra intermedia
router.get("/productostock", productoController.getStockPorProducto);  
router.get("/productoscatalogo", productoController.getCatalogoProductos);
router.get("/productoscategoria/:categoria", productoController.filtrarPorCategoria);
router.get("/productosestado/:estado", productoController.filtrarPorEstado);
router.get("/productosfiltrar", productoController.filtrarPorAmbos);

module.exports = router;
