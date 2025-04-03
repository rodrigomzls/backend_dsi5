const db = require("../config/database");

//crear contrato
exports.createContrato = (req, res) => {
  const { descripcion, id_cliente, estado, fecha_inicio } = req.body;
  if (!descripcion || !id_cliente|| !estado || !fecha_inicio) return res.status(400).json({ error: "Todos los campos son obligatorios" });

  db.query("INSERT INTO contrato (descripcion, id_cliente, estado, fecha_inicio) VALUES (?, ?, ?, ?)", [descripcion, id_cliente, estado, fecha_inicio], (err, result) => {
    if (err) return res.status(500).json({ error: "Error en la base de datos" });
    res.status(201).json({ message: "Contrato creado", id: result.insertId });
  });
};


//obtener contratos
exports.getContratos = (req, res) => {
  db.query("SELECT * FROM contrato", (err, results) => {
    if (err) return res.status(500).json({ error: "Error en la base de datos" });
    res.status(200).json(results);
  }); 
};


//obtener contratos por ID
exports.getContratoById = (req, res) => {
  const { id } = req.params;
  
  db.query("SELECT * FROM contrato WHERE id_contrato = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ error: "Error en la base de datos" });
    
    if (results.length === 0) {
      return res.status(404).json({ error: "Contrato no encontrado" });
    }

    res.status(200).json(results[0]);
  });
};


//actualizar contratos
exports.updateContrato = (req, res) => {
  const { id } = req.params;
  const { descripcion, id_cliente, estado, fecha_inicio } = req.body;
  db.query("UPDATE contrato SET descripcion = ?,  id_cliente = ?, estado = ?, fecha_inicio = ? WHERE id_contrato = ?", [descripcion, id_cliente, estado, fecha_inicio, id], (err, result) => {
    if (err) return res.status(500).json({ error: "Error al actualizar" });
    res.status(200).json({ message: "Contrato actualizado" });
  });
};


//eliminar contratos
exports.deleteContrato = (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM contrato WHERE id_contrato = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: "Error al eliminar" });
    res.status(200).json({ message: "Contrato eliminado" });
  });
};