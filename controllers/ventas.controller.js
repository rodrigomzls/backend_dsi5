const db = require("../config/database");

exports.crearVentaCompleta= function(req, res) {
  const { id_usuario, productos, detalles_personalizados, total, lugar_entrega } = req.body;

  // 1. Obtener id_cliente desde usuario
  db.query(
    "SELECT id_cliente FROM usuario WHERE id_usuario = ?", 
    [id_usuario],
    (err, usuario) => {
      if (err) return res.status(500).json({ error: "Error al buscar usuario", detalle: err.message });
      if (!usuario || usuario.length === 0) return res.status(404).json({ error: "Usuario no encontrado" });

      const id_cliente = usuario[0].id_cliente;

      // 2. Crear venta principal
      db.query(
        `INSERT INTO ventas 
         (id_cliente, lugar_entrega, total, fecha, hora) 
         VALUES (?, ?, ?, CURDATE(), CURTIME())`,
        [id_cliente, lugar_entrega, total],
        (err, resultVenta) => {
          if (err) return res.status(500).json({ error: "Error al crear venta", detalle: err.message });

          const id_ventas = resultVenta.insertId;

          // 3. Procesar productos con sus detalles
          const queries = productos.map(producto => {
            const detalleProducto = {
              tallas: detalles_personalizados?.tallas?.[producto.id] || [],
              color: detalles_personalizados?.colores?.[producto.id] || "",
              logo: detalles_personalizados?.logos?.[producto.id] || ""
            };

            return new Promise((resolve, reject) => {
              db.query(
                `INSERT INTO ventas_detalle 
                 (id_ventas, id_producto, cantidad, subtotal, detalles) 
                 VALUES (?, ?, ?, ?, ?)`,
                [
                  id_ventas, 
                  producto.id, 
                  producto.cantidad, 
                  producto.precio * producto.cantidad,
                  JSON.stringify(detalleProducto)
                ],
                (err) => err ? reject(err) : resolve()
              );
            });
          });

          // 4. Ejecutar todas las inserciones
          Promise.all(queries)
            .then(() => res.status(201).json({ 
              success: true, 
              id_ventas,
              message: "Venta registrada con detalles" 
            }))
            .catch(error => {
              console.error("Error en detalles de venta:", error);
              res.status(500).json({ 
                error: "Error al guardar productos", 
                detalle: error.message 
              });
            });

        }
      );
    }
  );
};


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
  db.query("SELECT * FROM ventas WHERE id_ventas = ?", [id], (err, results) => {
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
    "UPDATE ventas SET id_ventas = ?, id_cliente = ?, lugar_entrega = ?, total = ?, fecha = ?, hora = ? WHERE id_ventas = ?",
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

      // Primero eliminar los detalles
    db.query("DELETE FROM ventas_detalle WHERE id_ventas = ?", [id], (err) => {
      if (err) return res.status(500).json({ error: "Error al eliminar detalles" });

      // Luego eliminar la venta
      db.query("DELETE FROM ventas WHERE id_ventas = ?", [id], (err) => {
        if (err) return res.status(500).json({ error: "Error al eliminar venta" });
        res.status(200).json({ message: "Venta eliminada correctamente" });
      });
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
