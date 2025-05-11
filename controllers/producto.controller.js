const db = require("../config/database");

// Crear producto
exports.createProducto = (req, res) => {
  const { producto, descripcion, precio, costo, id_categoria, material, estado } = req.body;
  if (!producto || !descripcion || !precio || !costo || !id_categoria || !material || !estado) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  const query = `
    INSERT INTO producto (producto, descripcion, precio, costo, id_categoria, material, estado)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(query, [producto, descripcion, precio, costo, id_categoria, material, estado], (err, result) => {
    if (err) return res.status(500).json({ error: "Error en la base de datos" });
    res.status(201).json({ message: "Producto agregado", id: result.insertId });
  });
};

// Obtener todos los productos
exports.getProductos = (req, res) => {
  db.query("SELECT * FROM producto", (err, results) => {
    if (err) return res.status(500).json({ error: "Error en la base de datos" });
    res.status(200).json(results);
  });
};

// Obtener producto por ID
exports.getProductoById = (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM producto WHERE id_producto = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ error: "Error en la base de datos" });
    if (results.length === 0) return res.status(404).json({ error: "Producto no encontrado" });
    res.status(200).json(results[0]);
  });
};

// Actualizar producto
exports.updateProducto = (req, res) => {
  const { id } = req.params;
  const { producto, descripcion, precio, costo, id_categoria, material, estado } = req.body;

  const query = `
    UPDATE producto 
    SET producto = ?, descripcion = ?, precio = ?, costo = ?, id_categoria = ?, material = ?, estado = ?
    WHERE id_producto = ?
  `;

  db.query(query, [producto, descripcion, precio, costo, id_categoria, material, estado, id], (err) => {
    if (err) return res.status(500).json({ error: "Error en la base de datos" });
    res.status(200).json({ message: "Producto actualizado" });
  });
};

// Eliminar producto
exports.deleteProducto = (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM producto WHERE id_producto = ?", [id], (err) => {
    if (err) return res.status(500).json({ error: "Error en la base de datos" });
    res.status(200).json({ message: "Producto eliminado" });
  });
};

// Obtener cantidad de stock por producto
exports.getStockPorProducto = (req, res) => {
  const query = `
    SELECT 
      p.id_producto,
      p.producto,
      IFNULL(SUM(sd.cantidad), 0)
    FROM producto p
    LEFT JOIN stock_detalle sd ON p.id_producto = sd.id_producto
    GROUP BY p.id_producto, p.producto
    ORDER BY p.producto
  `;

  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: "Error al obtener stock de productos" });
    res.status(200).json(results);
  });
};

// Obtener todos los productos con su stock total
exports.getProductosConTotalStock = (req, res) => {
  const query = `
    SELECT 
      p.id_producto,
      p.producto,
      p.descripcion,
      c.categoria,
      IFNULL(SUM(sd.cantidad), 0)
    FROM producto p
    JOIN categoria c ON p.id_categoria = c.id_categoria
    LEFT JOIN stock_detalle sd ON p.id_producto = sd.id_producto
    GROUP BY p.id_producto, p.producto, p.descripcion, c.categoria
    ORDER BY p.producto
  `;

  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: "Error al obtener productos con stock" });
    res.status(200).json(results);
  });
};

// Catálogo de productos
exports.getCatalogoProductos = (req, res) => {
  const query = `
    SELECT 
      p.id_producto,
      p.producto,
      p.descripcion,
      p.precio,
      p.material,
      c.categoria,
      p.estado
    FROM producto p
    JOIN categoria c ON p.id_categoria = c.id_categoria
    ORDER BY p.producto
  `;

  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: "Error al obtener catálogo" });
    res.status(200).json(results);
  });
};

// Filtrar por categoría
exports.filtrarPorCategoria = (req, res) => {
  const { categoria } = req.params;
  const query = `
    SELECT 
      p.id_producto,
      p.producto,
      p.descripcion,
      p.precio,
      p.material,
      c.categoria,
      p.estado
    FROM producto p
    JOIN categoria c ON p.id_categoria = c.id_categoria
    WHERE c.categoria = ?
    ORDER BY p.producto
  `;

  db.query(query, [categoria], (err, results) => {
    if (err) return res.status(500).json({ error: "Error al filtrar por categoría" });
    res.status(200).json(results);
  });
};

// Filtrar por estado
exports.filtrarPorEstado = (req, res) => {
  const { estado } = req.params;
  const query = `
    SELECT 
      p.id_producto,
      p.producto,
      p.descripcion,
      p.precio,
      p.material,
      c.categoria,
      p.estado
    FROM producto p
    JOIN categoria c ON p.id_categoria = c.id_categoria
    WHERE p.estado = ?
    ORDER BY p.producto
  `;

  db.query(query, [estado], (err, results) => {
    if (err) return res.status(500).json({ error: "Error al filtrar por estado" });
    res.status(200).json(results);
  });
};

// Filtrar por categoría y estado
exports.filtrarPorAmbos = (req, res) => {
  const { estado, categoria } = req.query;
  const query = `
    SELECT 
      p.id_producto,
      p.producto,
      p.descripcion,
      p.precio,
      p.material,
      c.categoria,
      p.estado
    FROM producto p
    JOIN categoria c ON p.id_categoria = c.id_categoria
    WHERE p.estado = ? AND c.categoria = ?
    ORDER BY p.producto
  `;

  db.query(query, [estado, categoria], (err, results) => {
    if (err) return res.status(500).json({ error: "Error al filtrar por estado y categoría" });
    res.status(200).json(results);
  });
};
