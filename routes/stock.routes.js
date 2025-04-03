const express = require("express");
const router = express.Router();
const stockController = require("../controllers/stock.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

router.post("/stock",  verifyToken, stockController.createStock);
router.get("/stock",  verifyToken, stockController.getStocks); 
router.get("/stock/:id", verifyToken, stockController.getStockById); 
router.put("/stock/:id", verifyToken, stockController.updateStock);
router.delete("/stock/:id", verifyToken, stockController.deleteStock);

module.exports = router;
