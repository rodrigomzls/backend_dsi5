const db = require("../config/database");

//crear categoria
exports.createCategoria = (req, res) => {
  const { categoria } = req.body;
  if (!categoria) return res.status(400).json({ error: "Descripción es obligatoria" });

  db.query("INSERT INTO categoria (categoria) VALUES (?)", [categoria], (err, result) => {
    if (err) return res.status(500).json({ error: "Error en la base de datos" });
    res.status(201).json({ message: "Categoría creada", id: result.insertId });
  });
};


//obtener categorias
exports.getCategorias = (req, res) => {
  db.query("SELECT * FROM categoria", (err, results) => {
    if (err) return res.status(500).json({ error: "Error en la base de datos" });
    res.status(200).json(results);
  });
};


//obtener categorias por ID
exports.getCategoriaById = (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM categoria WHERE id_categoria = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ error: "Error en la base de datos" });
    if (results.length === 0) return res.status(404).json({ error: "Categoría no encontrada" });
    res.status(200).json(results[0]);
  });
};


//actualizar categorias
exports.updateCategoria = (req, res) => {
  const { id } = req.params;
  const { categoria } = req.body;

  db.query("UPDATE categoria SET categoria = ? WHERE id_categoria = ?", [categoria, id], (err, result) => {
    if (err) return res.status(500).json({ error: "Error en la base de datos" });
    res.status(200).json({ message: "Categoría actualizada" });
  });
};


//eliminar categorias
exports.deleteCategoria = (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM categoria WHERE id_categoria = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: "Error en la base de datos" });
    res.status(200).json({ message: "Categoría eliminada" });
  });
};
