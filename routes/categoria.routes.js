const express = require("express");
const router = express.Router();
const categoriaController = require("../controllers/categoria.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

router.post("/categorias", categoriaController.createCategoria);
router.get("/categorias",  categoriaController.getCategorias); 
router.get("/categorias/:id",  categoriaController.getCategoriaById); 
router.put("/categorias/:id",  categoriaController.updateCategoria);
router.delete("/categorias/:id", categoriaController.deleteCategoria);

module.exports = router;
