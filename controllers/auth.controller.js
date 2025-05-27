const db = require("../config/database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const util = require("util");

const query = util.promisify(db.query).bind(db);

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "Todos los campos son obligatorios" });

    const results = await query("SELECT * FROM usuario WHERE email = ?", [email]);
    if (results.length === 0)
      return res.status(401).json({ error: "Credenciales incorrectas" });

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ error: "Credenciales incorrectas" });

    const token = jwt.sign(
      {
        id_usuario: user.id_usuario,
        id_cliente: user.id_cliente,
        user: user.user,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Puedes quitar la contraseña antes de enviar
    delete user.password;

    res.status(200).json({
      message: "Login exitoso",
      token,
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

exports.logout = (_req, res) => {
  res.status(200).json({ message: "Logout exitoso. Token eliminado del cliente." });
};
