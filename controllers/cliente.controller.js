const db = require("../config/database");

//crear cliente
exports.createCliente = (req, res) => {
  const { nombres, apellidos, telefono } = req.body;
  if (!nombres || !apellidos|| !telefono) return res.status(400).json({ error: "Todos los campos son obligatorios" });

  db.query("INSERT INTO cliente (nombres, apellidos, telefono) VALUES (?, ?, ?)", [nombres, apellidos, telefono], (err, result) => {
    if (err) return res.status(500).json({ error: "Error en la base de datos" });
    res.status(201).json({ message: "Cliente creado", id: result.insertId });
  });
};


//obtener clientes
exports.getClientes = (req, res) => {
  db.query("SELECT * FROM cliente", (err, results) => {
    if (err) return res.status(500).json({ error: "Error en la base de datos" });
    res.status(200).json(results);
  }); 
};


//obtener clientes por ID
exports.getClienteById = (req, res) => {
  const { id } = req.params;
  
  db.query("SELECT * FROM cliente WHERE id_cliente = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ error: "Error en la base de datos" });
    
    if (results.length === 0) {
      return res.status(404).json({ error: "Cliente no encontrado" });
    }

    res.status(200).json(results[0]);
  });
};


//actualizar clientes
exports.updateCliente = (req, res) => {
  const { id } = req.params;
  const { nombres, apellidos, telefono } = req.body;
  db.query("UPDATE cliente SET nombres = ?,  apellidos= ?, telefono = ? WHERE id_cliente = ?", [nombres, apellidos, telefono, id], (err, result) => {
    if (err) return res.status(500).json({ error: "Error al actualizar" });
    res.status(200).json({ message: "Cliente actualizado" });
  });
};


//eliminar clientes
exports.deleteCliente = (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM cliente WHERE id_cliente = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: "Error al eliminar" });
    res.status(200).json({ message: "Cliente eliminado" });
  });
};