// logs.controller.js

const db = require("../config/database");

// Obtener logs por tabla y tipo
exports.obtenerLog = (req, res) => {
  const { tabla, tipo } = req.query;

  if (!tabla) {
    return res.status(400).json({ error: "El parámetro 'tabla' es obligatorio." });
  }

  let sql = `SELECT * FROM ??`;
  const params = [tabla];

  if (tipo) {
    sql += ` WHERE Tipo = ?`;
    params.push(tipo);
  }

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error("Error al obtener logs:", err);
      return res.status(500).json({ error: "Error en la base de datos." });
    }

    res.status(200).json(results);
  });
};

// Obtener todos los logs de una tabla
exports.obtenerTodosLogs = (req, res) => {
  const { tabla } = req.query;

  if (!tabla) {
    return res.status(400).json({ error: "El parámetro 'tabla' es obligatorio." });
  }

  const sql = `SELECT * FROM ??`;

  db.query(sql, [tabla], (err, results) => {
    if (err) {
      console.error("Error al obtener todos los logs:", err);
      return res.status(500).json({ error: "Error en la base de datos." });
    }

    res.status(200).json(results);
  });
};
