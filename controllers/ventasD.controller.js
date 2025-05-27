const db = require("../config/database");

// Crear detalle de venta
exports.createVentaDetalle = (req, res) => {
  const { id_ventas, id_producto, cantidad, subtotal } = req.body;

  if (!id_ventas || !id_producto || !cantidad || !subtotal || !id_personalizado	) {
    return res.status(400).json({ error: "Todos los campos son obligatorios: id_ventas, id_producto, cantidad, subtotal, id_personalizado" });
  }

  const query = `INSERT INTO ventas_detalle (id_ventas, id_producto, cantidad, subtotal, id_personalizado) VALUES (?, ?, ?, ?, ?)`;
  db.query(query, [id_ventas, id_producto, cantidad, subtotal], (err, result) => {
    if (err) {
      console.error("Error al crear detalle de venta:", err);
      return res.status(500).json({ error: "Error en la base de datos", detalle: err.message });
    }
    res.status(201).json({ message: "Detalle de venta creado exitosamente", id: result.insertId });
  });
};

// Obtener todos los detalles de venta
exports.getVentasDetalle = (req, res) => {
  db.query("SELECT * FROM ventas_detalle", (err, results) => {
    if (err) {
      console.error("Error al obtener detalles de ventas:", err);
      return res.status(500).json({ error: "Error en la base de datos", detalle: err.message });
    }
    res.status(200).json(results);
  });
};

// Obtener detalle de venta por ID
exports.getVentaDetalleById = (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM ventas_detalle WHERE id_ventas_d = ?", [id], (err, results) => {
    if (err) {
      console.error("Error al obtener detalle de venta por ID:", err);
      return res.status(500).json({ error: "Error en la base de datos", detalle: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "Detalle de venta no encontrado" });
    }
    res.status(200).json(results[0]);
  });
};

// Actualizar detalle de venta
exports.updateVentaDetalle = (req, res) => {
  const { id } = req.params;
  const { id_ventas, id_producto, cantidad, subtotal } = req.body;

  if (!id_ventas || !id_producto || !cantidad || !subtotal) {
    return res.status(400).json({ error: "Todos los campos son obligatorios para actualizar: id_ventas, id_producto, cantidad, subtotal, id_personalizado" });
  }

  const query = `
    UPDATE ventas_detalle 
    SET id_ventas = ?, id_producto = ?, cantidad = ?, subtotal = ?, id_personalizado = ?,
    WHERE id_ventas_d = ?
  `;

  db.query(query, [id_ventas, id_producto, cantidad, subtotal, id], (err, result) => {
    if (err) {
      console.error("Error al actualizar detalle de venta:", err);
      return res.status(500).json({ error: "Error en la base de datos", detalle: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Detalle de venta no encontrado para actualizar" });
    }
    res.status(200).json({ message: "Detalle de venta actualizado correctamente" });
  });
};

// Eliminar detalle de venta
exports.deleteVentaDetalle = (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM ventas_detalle WHERE id_ventas_d = ?", [id], (err, result) => {
    if (err) {
      console.error("Error al eliminar detalle de venta:", err);
      return res.status(500).json({ error: "Error en la base de datos", detalle: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Detalle de venta no encontrado para eliminar" });
    }
    res.status(200).json({ message: "Detalle de venta eliminado correctamente" });
  });
};
