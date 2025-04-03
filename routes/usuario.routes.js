const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/usuario.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

router.post("/usuarios", usuarioController.createUsuario);
router.get("/usuarios", verifyToken, usuarioController.getUsuarios); 
router.get("/usuarios/:id", verifyToken, usuarioController.getUsuarioById); 
router.put("/usuarios/:id", verifyToken, usuarioController.updateUsuario);
router.delete("/usuarios/:id", verifyToken, usuarioController.deleteUsuario);


module.exports = router;
