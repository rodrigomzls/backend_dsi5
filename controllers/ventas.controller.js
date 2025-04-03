const db = require("../config/database");

//crear ventas
exports.createVenta = (req, res) => {
  const { id_ventas, id_cliente, total } = req.body;
  if (!id_ventas || !id_cliente || !total) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  db.query(
    "INSERT INTO ventas (id_ventas, id_cliente, total) VALUES (?, ?, ?)",
    [id_ventas, id_cliente, total],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Error en la base de datos" });
      res.status(201).json({ message: "Venta registrada", id: result.insertId });
    }
  );
};


//obtener ventas
exports.getVentas = (req, res) => {
  db.query("SELECT * FROM ventas", (err, results) => {
    if (err) return res.status(500).json({ error: "Error en la base de datos" });
    res.status(200).json(results);
  });
};


//obtener ventas por ID
exports.getVentaById = (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM ventas WHERE id_venta = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ error: "Error en la base de datos" });
    if (results.length === 0) return res.status(404).json({ error: "Venta no encontrada" });
    res.status(200).json(results[0]);
  });
};


//actualizar ventas
exports.updateVenta = (req, res) => {
  const { id } = req.params;
  const { id_ventas, id_cliente, total } = req.body;

  db.query(
    "UPDATE ventas SET id_ventas = ?, id_cliente = ?, total = ? WHERE id_venta = ?",
    [id_ventas, id_cliente, total, id],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Error en la base de datos" });
      res.status(200).json({ message: "Venta actualizada" });
    }
  );
};


//elimnar ventas
exports.deleteVenta = (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM ventas WHERE id_venta = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: "Error en la base de datos" });
    res.status(200).json({ message: "Venta eliminada" });
  });
};
