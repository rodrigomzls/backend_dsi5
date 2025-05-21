const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/usuario.controller");
const db = require("../config/database");
const { verifyToken } = require("../middlewares/auth.middleware");

// Ruta para crear usuario
router.post("/usuarios", usuarioController.createUsuario);

// Ruta para obtener todos los usuarios
router.get("/usuarios", usuarioController.getUsuarios);

// Ruta para obtener usuario específico
router.get("/usuarios/:id", usuarioController.getUsuarioById);

// Ruta para actualizar usuario
router.put("/usuarios/:id", usuarioController.updateUsuario);

// Ruta para eliminar usuario
router.delete("/usuarios/:id", usuarioController.deleteUsuario);

// Ruta para obtener usuario con datos de cliente
router.get('/usuario-cliente/:id', usuarioController.getUsuarioWithCliente);


router.post("/register", usuarioController.createUsuario);
router.post("/login", usuarioController.loginUsuario);

module.exports = router;