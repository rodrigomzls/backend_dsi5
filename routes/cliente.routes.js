const express = require("express");
const router = express.Router();
const clienteController = require("../controllers/cliente.controller"); // Asegúrate de que la ruta sea correcta
const { verifyToken } = require("../middlewares/auth.middleware");

// Rutas para clientes
router.post("/clientes", clienteController.createCliente);
router.get("/clientes", clienteController.getClientes);
router.get("/clientes/:id", clienteController.getClienteById);
router.put("/clientes/:id", clienteController.updateCliente);
router.delete("/clientes/:id", clienteController.deleteCliente);

// Rutas para contratos
router.get("/contrato", clienteController.listarTodosContratos);
router.post("/contrato/filtrar", clienteController.filtrarContratosPorCorreo);

// Rutas para datos de boleta del cliente
router.get("/clientes/boleta/:idCliente", clienteController.datosBoletaCliente);

// Rutas para listar clientes con detalles
router.get("/clientes/detalles", clienteController.listarClientesConDetalles);

module.exports = router;
