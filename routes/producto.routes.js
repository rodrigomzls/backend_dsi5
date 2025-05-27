const express = require("express");
const router = express.Router();
const productoController = require("../controllers/producto.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

// Rutas CRUD básicas
router.post("/productos", productoController.createProducto);
router.get("/productos", productoController.getProductos);
router.get("/productos/:id", productoController.getProductoById);
router.put("/productos/:id",  productoController.updateProducto);
router.delete("/productos/:id",  productoController.deleteProducto);

// Rutas avanzadas SIN barra intermedia
router.get("/productostock", productoController.getStockPorProducto);  
router.get("/productoscatalogo", productoController.getCatalogoProductos);
router.get("/productoscategoria/:categoria", productoController.filtrarPorCategoria);
router.get("/productosestado/:estado", productoController.filtrarPorEstado);
router.get("/productosfiltrar", productoController.filtrarPorAmbos);

module.exports = router;
