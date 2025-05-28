const db = require("../config/database");

// Crear cliente
exports.createCliente = (req, res) => {
  const { nombres, apellidos, telefono, direccion } = req.body;
  if (!nombres || !apellidos || !telefono || !direccion)
    return res.status(400).json({ error: "Todos los campos son obligatorios" });

  db.query(
    "INSERT INTO cliente (nombres, apellidos, telefono, direccion) VALUES (?, ?, ?, ?)",
    [nombres, apellidos, telefono, direccion],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Error en la base de datos" });
      res.status(201).json({ message: "Cliente creado", id: result.insertId });
    }
  );
};

// Obtener clientes
exports.getClientes = (req, res) => {
  db.query("SELECT * FROM cliente", (err, results) => {
    if (err) return res.status(500).json({ error: "Error en la base de datos" });
    res.status(200).json(results);
  });
};

// Obtener cliente por ID
exports.getClienteById = (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM cliente WHERE id_cliente = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ error: "Error en la base de datos" });
    if (results.length === 0) {
      return res.status(404).json({ error: "Cliente no encontrado" });
    }
    res.status(200).json(results[0]);
  });
};

// Actualizar cliente
exports.updateCliente = (req, res) => {
  const { id } = req.params;
  const { nombres, apellidos, telefono, direccion } = req.body;
  db.query(
    "UPDATE cliente SET nombres = ?, apellidos = ?, telefono = ?, direccion = ? WHERE id_cliente = ?",
    [nombres, apellidos, telefono, direccion, id],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Error al actualizar" });
      res.status(200).json({ message: "Cliente actualizado" });
    }
  );
};

// Eliminar cliente
exports.deleteCliente = (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM cliente WHERE id_cliente = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: "Error al eliminar" });
    res.status(200).json({ message: "Cliente eliminado" });
  });
};


//Para guardar datos en compra
exports.createOrUpdateCliente = async (req, res) => {
  const { id_usuario, nombres, apellidos, telefono, direccion, dni } = req.body;

  try {
    // Verificar si ya existe cliente para este usuario
    const [[usuario]] = await db.query("SELECT id_cliente FROM usuario WHERE id_usuario = ?", [id_usuario]);
    if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });

    let clienteId = usuario.id_cliente;

    if (clienteId) {
      // Actualizar cliente existente
      await db.query(
        `UPDATE cliente 
         SET nombres = ?, apellidos = ?, telefono = ?, direccion = ?, dni = ?
         WHERE id_cliente = ?`,
        [nombres, apellidos, telefono, direccion, dni, clienteId]
      );
    } else {
      // Crear nuevo cliente
      const [result] = await db.query(
        `INSERT INTO cliente 
         (nombres, apellidos, telefono, direccion, dni) 
         VALUES (?, ?, ?, ?, ?)`,
        [nombres, apellidos, telefono, direccion, dni]
      );
      
      clienteId = result.insertId;
      // Actualizar usuario con id_cliente
      await db.query(
        "UPDATE usuario SET id_cliente = ? WHERE id_usuario = ?",
        [clienteId, id_usuario]
      );
    }

    // Devolver datos actualizados del cliente
    const [[cliente]] = await db.query("SELECT * FROM cliente WHERE id_cliente = ?", [clienteId]);
    res.status(200).json(cliente);
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
};


// Listar todos los contratos
exports.listarTodosContratos = (req, res) => {
  const sql = `
    SELECT 
      c.ID_Contrato,
      CONCAT(cl.nombres, ' ', cl.apellidos) AS Nombre_Completo,
      cl.telefono,
      c.Contrato,
      c.Estado
    FROM 
      Contratos c
    INNER JOIN 
      cliente cl ON c.ID_Cliente = cl.id_cliente
  `;

  db.query(sql, (err, resultados) => {
    if (err) return res.status(500).json({ error: "Error al listar contratos" });
    res.status(200).json({ exito: true, datos: resultados });
  });
};

  // Filtrar contratos por correo
  exports.filtrarContratosPorCorreo = (req, res) => {
  const { correo } = req.body;
  if (!correo) return res.status(400).json({ error: "El campo correo es obligatorio" });

  const sql = `
    SELECT 
      c.ID_Contrato,
      CONCAT(cl.nombres, ' ', cl.apellidos) AS Nombre_Completo,
      cl.telefono,
      c.Contrato,
      c.Estado
    FROM 
      Contratos c
    INNER JOIN 
      cliente cl ON c.ID_Cliente = cl.id_cliente
    WHERE 
      cl.correo = ?
  `;

  db.query(sql, [correo], (err, resultados) => {
    if (err) return res.status(500).json({ error: "Error al filtrar contratos" });
    res.status(200).json({ exito: true, datos: resultados, correoAlmacenado: correo });
  });
};

// Obtener datos para la boleta del cliente
exports.datosBoletaCliente = (req, res) => {
  const { idCliente } = req.params;
  const sql = `
    SELECT 
      cl.id_cliente,
      cl.nombres,
      cl.apellidos,
      cl.telefono,
      cl.direccion
    FROM cliente cl
    WHERE cl.id_cliente = ?
  `;

  db.query(sql, [idCliente], (err, resultados) => {
    if (err) return res.status(500).json({ error: "Error al obtener datos para boleta" });
    if (resultados.length === 0) {
      return res.status(404).json({ error: "Cliente no encontrado" });
    }
    res.status(200).json({ exito: true, datos: resultados[0] });
  });
};

// Listar clientes con detalles (incluye teléfonos concatenados)
exports.listarClientesConDetalles = (req, res) => {
  const sql = `
    SELECT 
      cl.id_cliente,
      cl.nombres,
      cl.apellidos,
      cl.telefono,
      cl.correo,
      (
        SELECT GROUP_CONCAT(t.telefono SEPARATOR ', ')
        FROM Telefono t
        WHERE t.id_cliente = cl.id_cliente
      ) AS NumerosTelefonicos
    FROM cliente cl
  `;

  db.query(sql, (err, resultados) => {
    if (err) return res.status(500).json({ error: "Error al listar clientes con detalles" });
    res.status(200).json({ exito: true, datos: resultados });
  });
};