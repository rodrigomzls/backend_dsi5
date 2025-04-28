const db = require("../config/database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//logearse
exports.login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Todos los campos son obligatorios" });

  const sql = "SELECT * FROM usuario WHERE email = ?";
  db.query(sql, [email], async (err, results) => {
    if (err || results.length === 0) return res.status(401).json({ error: "Email no registrado" });

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Contraseña incorrecta" });

    const token = jwt.sign({ id: user.id, name: user.user }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.status(200).json({ 
        message: "Login exitoso", 
        token: token,
        // user: { id: user.id, nombre: user.nombre } //modifique: nombre del usuario
      });
  });
};


//deslogearse xd
exports.logout = (_req, res) => {
  res.status(200).json({ message: "Logout exitoso. Token eliminado del cliente." });
};
