const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/usuario.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

router.post("/usuarios", usuarioController.createUsuario);
router.get("/usuarios", verifyToken, usuarioController.getUsuarios); 
router.get("/usuarios/:id", usuarioController.getUsuarioById); 
router.put("/usuarios/:id",  usuarioController.updateUsuario);
router.delete("/usuarios/:id", usuarioController.deleteUsuario);


module.exports = router;
