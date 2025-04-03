const db = require("../config/database");

//crear telefono
exports.createTelefono = (req, res) => {
  const { id_cliente, telefono } = req.body;
  if (!id_cliente || !apellidos|| !direccion || !telefono) return res.status(400).json({ error: "Todos los campos son obligatorios" });

  db.query("INSERT INTO telefono (id_cliente, telefono) VALUES (?, ?)", [id_cliente, telefono], (err, result) => {
    if (err) return res.status(500).json({ error: "Error en la base de datos" });
    res.status(201).json({ message: "Telefono creado", id: result.insertId });
  });
};


//obtener telefonos
exports.getTelefonos = (req, res) => {
  db.query("SELECT * FROM telefono", (err, results) => {
    if (err) return res.status(500).json({ error: "Error en la base de datos" });
    res.status(200).json(results);
  }); 
};


//obtener telefonos por ID
exports.getTelefonoById = (req, res) => {
  const { id } = req.params;
  
  db.query("SELECT * FROM telefono WHERE id_telefono = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ error: "Error en la base de datos" });
    
    if (results.length === 0) {
      return res.status(404).json({ error: "Telefono no encontrado" });
    }

    res.status(200).json(results[0]);
  });
};


//actualizar telefonos
exports.updateTelefono = (req, res) => {
  const { id } = req.params;
  const { id_cliente, telefono } = req.body;
  db.query("UPDATE telefono SET id_cliente = ?, telefono = ? WHERE id_telefono = ?", [id_cliente, telefono, id], (err, result) => {
    if (err) return res.status(500).json({ error: "Error al actualizar" });
    res.status(200).json({ message: "Telefono actualizado" });
  });
};


//eliminar telefonos
exports.deleteTelefono = (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM telefono WHERE id_telefono = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: "Error al eliminar" });
    res.status(200).json({ message: "Telefono eliminado" });
  });
};