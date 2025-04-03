const express = require("express");
const router = express.Router();
const categoriaController = require("../controllers/categoria.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

router.post("/categorias", verifyToken, categoriaController.createCategoria);
router.get("/categorias", verifyToken, categoriaController.getCategorias); 
router.get("/categorias/:id", verifyToken, categoriaController.getCategoriaById); 
router.put("/categorias/:id", verifyToken, categoriaController.updateCategoria);
router.delete("/categorias/:id", verifyToken, categoriaController.deleteCategoria);

module.exports = router;
