const db = require("../config/database");

//crear proveedor
exports.createProveedor = (req, res) => {
  const { proveedor, empresa, direccion, telefono, ruc } = req.body;
  if (!proveedor || !empresa || !direccion || !telefono || !ruc)
    return res.status(400).json({ error: "Todos los campos son obligatorios" });

  db.query(
    "INSERT INTO proveedor (proveedor, empresa, direccion, telefono, ruc) VALUES (?, ?, ?, ?, ?)",
    [proveedor, empresa, direccion, telefono],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Error en la base de datos" });
      res.status(201).json({ message: "Proveedor creado", id: result.insertId });
    }
  );
};


//obtener proveedores
exports.getProveedores = (req, res) => {
  db.query("SELECT * FROM proveedor", (err, results) => {
    if (err) return res.status(500).json({ error: "Error en la base de datos" });
    res.status(200).json(results);
  });
};


//obtener proveedores por ID
exports.getProveedorById = (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM proveedor WHERE id_proveedor = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ error: "Error en la base de datos" });
    if (results.length === 0) return res.status(404).json({ error: "Proveedor no encontrado" });
    res.status(200).json(results[0]);
  });
};


//actualizar proveedores por ID
exports.updateProveedor = (req, res) => {
  const { id } = req.params;
  const { proveedor, empresa, direccion, telefono, ruc } = req.body;

  db.query(
    "UPDATE proveedor SET proveedor = ?, empresa = ?, direccion = ?, telefono = ?, ruc = ? WHERE id_proveedor = ?",
    [proveedor, empresa, direccion, telefono, ruc, id],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Error en la base de datos" });
      res.status(200).json({ message: "Proveedor actualizado" });
    }
  );
};


//eliminar proveedores
exports.deleteProveedor = (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM proveedor WHERE id_proveedor = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: "Error en la base de datos" });
    res.status(200).json({ message: "Proveedor eliminado" });
  });
};
