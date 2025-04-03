const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(403).json({ error: "Acceso Denegado x.X" });

  try {
    const verified = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ error: "¡Token Inválido!" });
  }
};
