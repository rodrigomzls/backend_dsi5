const db = require("../config/database");

//crear producto
exports.createProducto = (req, res) => {
  const { producto, precio, costo, id_categoria, materia, estado } = req.body;
  if (!producto || !precio  || !costo || !id_categoria || !materia || !estado) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  db.query(
    "INSERT INTO producto (producto, precio, costo, id_categoria, materia, estado) VALUES (?, ?, ?, ?, ?, ?)",
    [producto, precio, costo, id_categoria, materia, estado],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Error en la base de datos" });
      res.status(201).json({ message: "Producto agregado", id: result.insertId });
    }
  );
};

//obtener productos
exports.getProductos = (req, res) => {
  db.query("SELECT * FROM producto", (err, results) => {
    if (err) return res.status(500).json({ error: "Error en la base de datos" });
    res.status(200).json(results);
  });
};


//obtener productos por ID
exports.getProductoById = (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM producto WHERE id_producto = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ error: "Error en la base de datos" });
    if (results.length === 0) return res.status(404).json({ error: "Producto no encontrado" });
    res.status(200).json(results[0]);
  });
};


//actualizar productos
exports.updateProducto = (req, res) => {
  const { id } = req.params;
  const { producto, precio, costo, id_categoria, materia, estado } = req.body;

  db.query(
    "UPDATE producto SET producto = ?, precio = ?,  costo = ?, id_categoria = ?, materia = ?, estado = ? WHERE id_producto = ?",
    [producto, precio, costo, id_categoria, materia, estado, id],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Error en la base de datos" });
      res.status(200).json({ message: "Producto actualizado" });
    }
  );
};


//eliminar producto
exports.deleteProducto = (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM producto WHERE id_producto = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: "Error en la base de datos" });
    res.status(200).json({ message: "Producto eliminado" });
  });
};
