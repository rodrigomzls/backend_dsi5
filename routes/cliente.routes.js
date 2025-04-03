const express = require("express");
const router = express.Router();
const clienteController = require("../controllers/cliente.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

router.post("/clientes",  verifyToken, clienteController.createCliente);
router.get("/clientes",  verifyToken, clienteController.getClientes); 
router.get("/clientes/:id", verifyToken, clienteController.getClienteById); 
router.put("/clientes/:id", verifyToken, clienteController.updateCliente);
router.delete("/clientes/:id", verifyToken, clienteController.deleteCliente);

module.exports = router;
