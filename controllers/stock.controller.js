const db = require("../config/database");

//crear stock
exports.createStock = (req, res) => {
  const { id_producto, cantidad_total } = req.body;
  if (!id_producto || !cantidad_total) return res.status(400).json({ error: "Todos los campos son obligatorios" });

  db.query("INSERT INTO stock (id_producto, cantidad_total, direccion, telefono) VALUES (?, ?)", [id_producto, cantidad_total], (err, result) => {
    if (err) return res.status(500).json({ error: "Error en la base de datos" });
    res.status(201).json({ message: "Stock creado", id: result.insertId });
  });
};


//obtener stocks
exports.getStocks = (req, res) => {
  db.query("SELECT * FROM stock", (err, results) => {
    if (err) return res.status(500).json({ error: "Error en la base de datos" });
    res.status(200).json(results);
  }); 
};


//obtener stocks por ID
exports.getStockById = (req, res) => {
  const { id } = req.params;
  
  db.query("SELECT * FROM stock WHERE id_stock = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ error: "Error en la base de datos" });
    
    if (results.length === 0) {
      return res.status(404).json({ error: "Stock no encontrado" });
    }

    res.status(200).json(results[0]);
  });
};


//actualizar stocks
exports.updateStock = (req, res) => {
  const { id } = req.params;
  const { id_producto, cantidad_total } = req.body;
  db.query("UPDATE stock SET id_producto = ?,  cantidad_total= ? WHERE id_stock = ?", [id_producto, cantidad_total, id], (err, result) => {
    if (err) return res.status(500).json({ error: "Error al actualizar" });
    res.status(200).json({ message: "Stock actualizado" });
  });
};


//eliminar stocks
exports.deleteStock = (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM stock WHERE id_stock = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: "Error al eliminar" });
    res.status(200).json({ message: "Stock eliminado" });
  });
};