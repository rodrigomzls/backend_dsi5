const db = require("../config/database");
const multer = require("multer");
const upload = multer(); // sin almacenamiento en disco, solo en memoria

exports.crearVentaCompleta = [
  upload.any(), // acepta archivos opcionales
  async (req, res) => {
    try {
      // 1. Obtener datos del cliente del token (o del body)
      const id_cliente = req.user.id_cliente; // desde auth middleware
      if (!id_cliente) return res.status(400).json({ message: "Cliente no identificado" });

      // 2. Obtener datos del body
      const { lugar_entrega, total, productos } = req.body;
      if (!lugar_entrega || !total || !productos) {
        return res.status(400).json({ message: "Faltan datos obligatorios" });
      }

      // 3. Parsear productos JSON (porque vienen en FormData)
      const productosParsed = JSON.parse(productos);

      // 4. Insertar la venta
      const sqlInsertVenta = "INSERT INTO ventas (id_cliente, lugar_entrega, total, fecha) VALUES (?, ?, ?, NOW())";
      const [ventaResult] = await db.promise().query(sqlInsertVenta, [id_cliente, lugar_entrega, total]);
      const id_venta = ventaResult.insertId;

      // 5. Insertar detalles de la venta y productos personalizados
      for (const prod of productosParsed) {
        const sqlDetalle = "INSERT INTO ventas_detalle (id_venta, id_producto, cantidad, precio) VALUES (?, ?, ?, ?)";
        await db.promise().query(sqlDetalle, [id_venta, prod.id, prod.cantidad, prod.precio]);

        // Si hay personalización, insertar en producto_personalizado
        if (prod.personalizacion) {
          // Aquí manejamos archivo: revisar si hay archivo para ese producto
          // req.files tiene todos los archivos. Buscar archivo con nombre "archivo-{id_producto}-index"
          const archivosParaProducto = req.files.filter(f => f.fieldname.startsWith(`archivo-${prod.id}-`));

          let archivoBuffer = null;
          let archivoNombre = null;
          if (archivosParaProducto.length > 0) {
            archivoBuffer = archivosParaProducto[0].buffer;
            archivoNombre = archivosParaProducto[0].originalname;
          }

          const { talla, color, material } = prod.personalizacion;

          const sqlPers = `INSERT INTO producto_personalizado 
            (id_venta, id_producto, talla, color, material, archivo, nombre_archivo) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`;

          await db.promise().query(sqlPers, [
            id_venta,
            prod.id,
            talla || null,
            color || null,
            material || null,
            archivoBuffer,
            archivoNombre,
          ]);
        }
      }

      res.status(200).json({ message: "Venta registrada exitosamente" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error en el servidor" });
    }
  },
];



// Crear venta
exports.createVenta = (req, res) => {
  const { id_cliente, lugar_entrega, total, fecha, hora } = req.body;
  if (!id_cliente || !lugar_entrega || !total || !fecha || !hora) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  db.query(
    "INSERT INTO ventas (id_cliente, lugar_entrega, total, fecha, hora) VALUES (?, ?, ?, ?, ?, ?)",
    [id_cliente, lugar_entrega, total, fecha, hora],
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
      v.lugar_entrega
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
