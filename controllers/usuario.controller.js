const db = require("../config/database");
const bcrypt = require("bcrypt");

// Crear usuario
exports.createUsuario = async (req, res) => {
  const { user, email, password } = req.body;
  if (!user || !email || !password) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const sql = "INSERT INTO usuario (user, email, password) VALUES (?, ?, ?)";

  db.query(sql, [user, email, hashedPassword], (err, result) => {
    if (err) return res.status(500).json({ error: "Error en la base de datos" });
    res.status(201).json({ message: "Usuario creado", id: result.insertId });
  });
};

// Obtener todos los usuarios
exports.getUsuarios = (_req, res) => {
  db.query("SELECT id_usuario, user, email FROM usuario", (err, results) => {
    if (err) return res.status(500).json({ error: "Error en la base de datos" });
    res.status(200).json(results);
  });
};

// Obtener usuario por ID
exports.getUsuarioById = (req, res) => {
  const { id } = req.params;
  db.query("SELECT id_usuario, user, email FROM usuario WHERE id = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ error: "Error en la base de datos" });
    if (results.length === 0) return res.status(404).json({ error: "Usuario no encontrado" });
    res.status(200).json(results[0]);
  });
};


// Actualizar usuario
exports.updateUsuario = async (req, res) => {
  const { id } = req.params;
  const { user, email, password } = req.body;

  if (!user && !email && !password) {
    return res.status(400).json({ error: "Debes enviar al menos un campo para actualizar" });
  }

  try {
    // Obtener el usuario actual
    db.query("SELECT * FROM usuario WHERE id_usuario = ?", [id], async (err, results) => {
      if (err) return res.status(500).json({ error: "Error en la base de datos" });
      if (results.length === 0) return res.status(404).json({ error: "Usuario no encontrado" });

      // Si no se envía un nuevo password, conservar el actual
      const hashedPassword = password ? await bcrypt.hash(password, 10) : results[0].password;

      db.query(
        "UPDATE usuario SET user = ?, email = ?, password = ? WHERE id_usuario = ?",
        [user || results[0].user, email || results[0].email, hashedPassword, id],
        (err, result) => {
          if (err) return res.status(500).json({ error: "Error al actualizar usuario" });
          if (result.affectedRows === 0) return res.status(404).json({ error: "No se pudo actualizar el usuario" });
          res.status(200).json({ message: "Usuario actualizado correctamente" });
        }
      );
    });
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Eliminar usuario
exports.deleteUsuario = (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM usuario WHERE id_usuario = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: "Error en la base de datos" });
    if (result.affectedRows === 0) return res.status(404).json({ error: "Usuario no encontrado" });
    res.status(200).json({ message: "Usuario eliminado" });
  });
};
