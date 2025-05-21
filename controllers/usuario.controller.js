const db = require("../config/database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Función para generar token JWT
const generarToken = (user) => {
  return jwt.sign(user, process.env.JWT_SECRET || "secret_key", {
    expiresIn: "1h",
  });
};

// Crear usuario
exports.createUsuario = async (req, res) => {
  const { user, email, password } = req.body;

  try {
    // Verificar si el email ya existe
    const [userExists] = await db.query(
      "SELECT * FROM usuario WHERE email = ?",
      [email]
    );
    if (userExists.length > 0)
      return res.status(400).json({ error: "El correo ya está registrado" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      "INSERT INTO usuario (user, email, password) VALUES (?, ?, ?)",
      [user, email, hashedPassword]
    );

    const token = jwt.sign(
      { id: result.insertId, email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      token,
      user: {
        // Cambiado de usuario a user para consistencia
        id: result.insertId,
        email,
        user, // Nombre de usuario
      },
      cliente: null, // Añadido para consistencia con login
    });
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

exports.loginUsuario = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await db.query("SELECT * FROM usuario WHERE email = ?", [email]);
    if (rows.length === 0) return res.status(404).json({ error: "Usuario no encontrado" });

    const user = rows[0]; // ← Accedes correctamente al objeto


    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(400).json({ error: "Contraseña incorrecta" });

    const token = jwt.sign(
      { id: user.id_usuario, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Buscar datos del cliente si existen
    let cliente = null;
    if (user.id_cliente) {
    const [clienteRows] = await db.query("SELECT * FROM cliente WHERE id_cliente = ?", [user.id_cliente]);
    cliente = clienteRows[0] || null;
      }


    res.status(200).json({
      token,
      user: {
        // Cambiado de usuario a user
        id: user.id_usuario,
        email: user.email,
        user: user.user, 
      },
      cliente: cliente || null,
    });
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Obtener todos los usuarios
exports.getUsuarios = (req, res) => {
  db.query("SELECT id_usuario, user, email FROM usuario", (err, results) => {
    if (err)
      return res.status(500).json({ error: "Error en la base de datos" });
    res.status(200).json(results);
  });
};

// Obtener usuario por ID
exports.getUsuarioById = (req, res) => {
  const { id } = req.params;
  db.query(
    "SELECT id_usuario, user, email FROM usuario WHERE id_usuario = ?",
    [id],
    (err, results) => {
      if (err)
        return res.status(500).json({ error: "Error en la base de datos" });
      if (results.length === 0)
        return res.status(404).json({ error: "Usuario no encontrado" });
      res.status(200).json(results[0]);
    }
  );
};

// Obtener usuario con datos de cliente
exports.getUsuarioWithCliente = (req, res) => {
  const { id } = req.params;
  const sql = `
    SELECT u.*, c.nombres, c.apellidos, c.telefono, c.direccion 
    FROM usuario u 
    LEFT JOIN cliente c ON u.id_cliente = c.id_cliente 
    WHERE u.id_usuario = ?
  `;

  db.query(sql, [id], (err, results) => {
    if (err)
      return res.status(500).json({ error: "Error en la base de datos" });
    if (results.length === 0)
      return res.status(404).json({ error: "Usuario no encontrado" });
    res.status(200).json(results[0]);
  });
};

// Actualizar usuario
exports.updateUsuario = async (req, res) => {
  const { id } = req.params;
  const { user, email, password } = req.body;

  if (!user && !email && !password) {
    return res
      .status(400)
      .json({ error: "Debes enviar al menos un campo para actualizar" });
  }

  try {
    // Obtener el usuario actual
    db.query(
      "SELECT * FROM usuario WHERE id_usuario = ?",
      [id],
      async (err, results) => {
        if (err)
          return res.status(500).json({ error: "Error en la base de datos" });
        if (results.length === 0)
          return res.status(404).json({ error: "Usuario no encontrado" });

        // Si no se envía un nuevo password, conservar el actual
        const hashedPassword = password
          ? await bcrypt.hash(password, 10)
          : results[0].password;

        db.query(
          "UPDATE usuario SET user = ?, email = ?, password = ? WHERE id_usuario = ?",
          [
            user || results[0].user,
            email || results[0].email,
            hashedPassword,
            id,
          ],
          (err, result) => {
            if (err)
              return res
                .status(500)
                .json({ error: "Error al actualizar usuario" });
            if (result.affectedRows === 0)
              return res
                .status(404)
                .json({ error: "No se pudo actualizar el usuario" });
            res
              .status(200)
              .json({ message: "Usuario actualizado correctamente" });
          }
        );
      }
    );
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Eliminar usuario
exports.deleteUsuario = (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM usuario WHERE id_usuario = ?", [id], (err, result) => {
    if (err)
      return res.status(500).json({ error: "Error en la base de datos" });
    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Usuario no encontrado" });
    res.status(200).json({ message: "Usuario eliminado" });
  });
};
