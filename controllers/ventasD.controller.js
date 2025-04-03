const db = require("../config/database");

//crear ventasD
exports.createVentaD = (req, res) => {
  const { id_ventas, id_producto, cantidad, subtotal } = req.body;
  if (!id_ventas || !id_producto || !cantidad || !subtotal) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  db.query(
    "INSERT INTO ventas_detalle (id_ventas, id_producto, cantidad, subtotal) VALUES (?, ?, ?, ?)",
    [id_ventas, id_producto, cantidad, subtotal],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Error en la base de datos" });
      res.status(201).json({ message: "Venta registrada", id: result.insertId });
    }
  );
};


//obtener ventasD
exports.getVentasD = (req, res) => {
  db.query("SELECT * FROM ventas_detalle", (err, results) => {
    if (err) return res.status(500).json({ error: "Error en la base de datos" });
    res.status(200).json(results);
  });
};


//obtener ventasD por ID
exports.getVentaDById = (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM ventas_detalle WHERE id_ventas_d = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ error: "Error en la base de datos" });
    if (results.length === 0) return res.status(404).json({ error: "Venta no encontrada" });
    res.status(200).json(results[0]);
  });
};


//actualizar ventasD
exports.updateVentaD = (req, res) => {
  const { id } = req.params;
  const { id_ventas, id_producto, cantidad, subtotal } = req.body;

  db.query(
    "UPDATE ventas_detalle SET id_ventas = ?, id_producto = ?, cantidad = ?, subtotal = ? WHERE id_ventas_d = ?",
    [id_ventas, id_producto, cantidad, subtotal, id],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Error en la base de datos" });
      res.status(200).json({ message: "Venta actualizada" });
    }
  );
};


//elimnar ventasD
exports.deleteVentaD = (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM ventas_detalle WHERE id_ventas_d = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: "Error en la base de datos" });
    res.status(200).json({ message: "Venta eliminada" });
  });
};
