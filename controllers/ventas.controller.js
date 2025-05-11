const db = require("../config/database");

// Crear venta
exports.createVenta = (req, res) => {
  const { id_ventas, id_cliente, lugar_entrega, total, fecha, hora } = req.body;
  if (!id_ventas || !id_cliente || !lugar_entrega || !total || !fecha || !hora) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  db.query(
    "INSERT INTO ventas (id_ventas, id_cliente, lugar_entrega, total, fecha, hora) VALUES (?, ?, ?, ?, ?, ?)",
    [id_ventas, id_cliente, lugar_entrega, total, fecha, hora],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Error en la base de datos" });
      res.status(201).json({ message: "Venta registrada", id: result.insertId });
    }
  );
};

// Obtener todas las ventas
exports.getVentas = (req, res) => {
  db.query("SELECT * FROM ventas", (err, results) => {
    if (err) return res.status(500).json({ error: "Error en la base de datos" });
    res.status(200).json(results);
  });
};

// Obtener venta por ID
exports.getVentaById = (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM ventas WHERE id_venta = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ error: "Error en la base de datos" });
    if (results.length === 0) return res.status(404).json({ error: "Venta no encontrada" });
    res.status(200).json(results[0]);
  });
};

// Actualizar venta
exports.updateVenta = (req, res) => {
  const { id } = req.params;
  const { id_ventas, id_cliente, lugar_entrega, total, fecha, hora} = req.body;

  db.query(
    "UPDATE ventas SET id_ventas = ?, id_cliente = ?, lugar_entrega = ?, total = ?, fecha = ?, hora = ? WHERE id_venta = ?",
    [id_ventas, id_cliente, lugar_entrega, total, fecha, hora, id],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Error en la base de datos" });
      res.status(200).json({ message: "Venta actualizada" });
    }
  );
};

// Eliminar venta
exports.deleteVenta = (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM ventas WHERE id_venta = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: "Error en la base de datos" });
    res.status(200).json({ message: "Venta eliminada" });
  });
};

// Obtener ventas por mes
exports.obtenerVentasPorMes = (req, res) => {
  const sql = `
    SELECT 
      MONTH(fecha) AS Mes, 
      SUM(total) AS Total
    FROM 
      ventas
    GROUP BY 
      MONTH(fecha)
    ORDER BY 
      MONTH(fecha)
  `;

  db.query(sql, (err, resultados) => {
    if (err) return res.status(500).json({ error: "Error al obtener ventas por mes" });
    res.status(200).json(resultados);
  });
};

// Filtrar ventas por mes
exports.filtrarVentasPorMes = (req, res) => {
  const { mes } = req.body;
  if (!mes) return res.status(400).json({ error: "El campo mes es obligatorio" });

  const sql = `
    SELECT 
      v.id_ventas AS ID,
      CONCAT(cl.nombres, ' ', cl.apellidos) AS Nombre_Completo,
      cl.telefono,
      v.fecha,
      v.hora,
      v.total,
      v.lugar_entrega
    FROM 
      ventas v
    JOIN 
      cliente cl ON v.id_cliente = cl.id_cliente
    WHERE 
      MONTH(v.fecha) = ?
  `;

  db.query(sql, [mes], (err, resultados) => {
    if (err) return res.status(500).json({ error: "Error al filtrar ventas por mes" });
    res.status(200).json(resultados);
  });
};

// Filtrar ventas por año
exports.filtrarVentasPorYear = (req, res) => {
  const { year } = req.body;
  if (!year) return res.status(400).json({ error: "El campo año es obligatorio" });

  const sql = `
    SELECT 
      v.id_ventas AS ID,
      CONCAT(cl.nombres, ' ', cl.apellidos) AS Nombre_Completo,
      cl.telefono,
      v.fecha,
      v.hora,
      v.total,
      v.Lugar_entrega
    FROM 
      ventas v
    JOIN 
      cliente cl ON v.id_cliente = cl.id_cliente
    WHERE 
      YEAR(v.fecha) = ?
  `;

  db.query(sql, [year], (err, resultados) => {
    if (err) return res.status(500).json({ error: "Error al filtrar ventas por año" });
    res.status(200).json(resultados);
  });
};

// Filtrar ventas por año y mes
exports.filtrarVentasPorYearYMes = (req, res) => {
  const { year, month } = req.body;
  if (!year || !month) return res.status(400).json({ error: "Los campos año y mes son obligatorios" });

  const sql = `
    SELECT 
      v.id_ventas AS ID,
      CONCAT(cl.nombres, ' ', cl.apellidos) AS Nombre_Completo,
      cl.telefono,
      v.fecha,
      v.hora,
      v.total,
      v.lugar_entrega
    FROM 
      ventas v
    JOIN 
      cliente cl ON v.id_cliente = cl.id_cliente
    WHERE 
      YEAR(v.fecha) = ? AND MONTH(v.fecha) = ?
  `;

  db.query(sql, [year, month], (err, resultados) => {
    if (err) return res.status(500).json({ error: "Error al filtrar ventas por año y mes" });
    res.status(200).json(resultados);
  });
};
