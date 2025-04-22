import { getDB } from './database';

// ***********************
// Métodos para Clientes
// ***********************

// Insertar un nuevo cliente
export const insertCliente = async (nombre, direccion, telefono) => {
  const db = getDB();
  try {
    await db.runAsync(
      "INSERT INTO Clientes (nombre, direccion, telefono) VALUES (?, ?, ?);",
      [nombre, direccion, telefono]
    );
    console.log("✅ Cliente insertado con éxito");
  } catch (err) {
    console.error("❌ Error al insertar cliente:", err);
  }
};

// Obtener todos los clientes
export const getClientes = async () => {
  const db = getDB();
  try {
    const result = await db.getAllAsync("SELECT * FROM Clientes ORDER BY nombre ASC;");
    return result;
  } catch (err) {
    console.error("❌ Error al obtener clientes:", err);
    return [];
  }
};

// Obtener un solo cliente por ID
export const getClienteById = async (id) => {
  const db = getDB();
  try {
    // Reutilizamos getAllAsync: filtramos por id y devolvemos sólo la primera fila
    const filas = await db.getAllAsync(
      "SELECT * FROM Clientes WHERE id = ?;",
      [id]
    );
    // filas es un array; si hay al menos uno, lo devolvemos, si no, null
    return filas.length > 0 ? filas[0] : null;
  } catch (err) {
    console.error("❌ Error al obtener cliente por ID:", err);
    return null;
  }
};


// Actualizar un cliente existente
export const updateCliente = async (id, nombre, direccion, telefono) => {
  const db = getDB();
  try {
    await db.runAsync(
      "UPDATE Clientes SET nombre = ?, direccion = ?, telefono = ? WHERE id = ?;",
      [nombre, direccion, telefono, id]
    );
    console.log("✅ Cliente actualizado con éxito");
  } catch (err) {
    console.error("❌ Error al actualizar cliente:", err);
  }
};

// ***********************
// Métodos para Productos
// ***********************

// Insertar un nuevo producto
export const insertProducto = async (sku, descripcion, referencia, precio, existencia, proveedor_id) => {
  const db = getDB();
  try {
    await db.runAsync(
      "INSERT INTO Productos (sku, descripcion, referencia, precio, existencia, proveedor_id) VALUES (?, ?, ?, ?, ?, ?);",
      [sku, descripcion, referencia, precio, existencia, proveedor_id]
    );
    console.log("✅ Producto insertado con éxito");
  } catch (err) {
    console.error("❌ Error al insertar producto:", err);
  }
};

// Obtener todos los productos
export const getProductos = async () => {
  const db = getDB();
  try {
    const result = await db.getAllAsync("SELECT * FROM Productos ORDER BY descripcion;");
    return result;
  } catch (err) {
    console.error("❌ Error al obtener productos:", err);
    return [];
  }
};

// Actualizar un producto existente
export const updateProducto = async (sku, descripcion, referencia, precio, existencia, proveedor_id) => {
  const db = getDB();
  try {
    await db.runAsync(
      "UPDATE Productos SET descripcion = ?, referencia = ?, precio = ?, existencia = ?, proveedor_id = ? WHERE sku = ?;",
      [descripcion, referencia, precio, existencia, proveedor_id, sku]
    );
    console.log("✅ Producto actualizado con éxito");
  } catch (err) {
    console.error("❌ Error al actualizar producto:", err);
  }
};




// ***********************
// Métodos para Proveedores
// ***********************

// Insertar un nuevo proveedor
export const insertProveedor = async (nombre_proveedor, direccion, telefono) => {
  const db = getDB();
  try {
    await db.runAsync(
      "INSERT INTO Proveedores (nombre_proveedor, direccion, telefono) VALUES (?, ?, ?);",
      [nombre_proveedor, direccion, telefono]
    );
    console.log("✅ Proveedor insertado con éxito");
  } catch (err) {
    console.error("❌ Error al insertar proveedor:", err);
  }
};

// Obtener todos los proveedores
export const getProveedores = async () => {
  const db = getDB();
  try {
    const result = await db.getAllAsync("SELECT * FROM Proveedores ORDER BY id DESC;");
    return result;
  } catch (err) {
    console.error("❌ Error al obtener proveedores:", err);
    return [];
  }
};

// Actualizar un proveedor existente
export const updateProveedor = async (id, nombre_proveedor, direccion, telefono) => {
  const db = getDB();
  try {
    await db.runAsync(
      "UPDATE Proveedores SET nombre_proveedor = ?, direccion = ?, telefono = ? WHERE id = ?;",
      [nombre_proveedor, direccion, telefono, id]
    );
    console.log("✅ Proveedor actualizado con éxito");
  } catch (err) {
    console.error("❌ Error al actualizar proveedor:", err);
  }
};

// ***********************
// Métodos para Facturas
// ***********************

// Insertar una nueva factura
export const insertFactura = async (monto, fecha, condicion, cliente_id, pagada, saldo) => {
  const db = getDB();
  try {
    await db.runAsync(
      "INSERT INTO Facturas (monto, fecha, condicion, cliente_id, pagada, saldo) VALUES (?, ?, ?, ?, ?, ?);",
      [monto, fecha, condicion, cliente_id, pagada, saldo]
    );
    console.log("✅ Factura insertada con éxito");
  } catch (err) {
    console.error("❌ Error al insertar factura:", err);
  }
};

// Obtener todas las facturas
export const getFacturas = async () => {
  const db = getDB();
  try {
    const result = await db.getAllAsync(`
      SELECT F.numero_factura, F.monto, F.fecha, F.condicion, F.cliente_id, F.pagada, F.cancelada, F.saldo, C.nombre AS cliente
      FROM Facturas F
      LEFT JOIN Clientes C ON F.cliente_id = C.id
      ORDER BY F.numero_factura ASC;
    `);
    return result;
  } catch (err) {
    console.error("❌ Error al obtener facturas:", err);
    return [];
  }
};

// Obtener facturas con saldo > 0
export const getFacturasPendientesPorCliente = async (cliente_id) => {
  const db = getDB();
  return db.getAllAsync(
    `SELECT numero_factura, saldo
     FROM Facturas
     WHERE cliente_id = ? AND saldo > 0 AND cancelada = 0
     ORDER BY fecha ASC;`,
    [cliente_id]
  );
};

// Actualizar saldo y estado de factura
export const updateFacturaSaldo = async (numero_factura, nuevoSaldo, pagada) => {
  const db = getDB();
  await db.runAsync(
    `UPDATE Facturas
        SET saldo = ?, pagada = ?
      WHERE numero_factura = ?;`,
    [nuevoSaldo, pagada, numero_factura]
  );
};

// Actualizar una factura existente
export const updateFactura = async (numero_factura, monto, fecha, condicion, cliente_id, pagada, saldo) => {
  const db = getDB();
  try {
    await db.runAsync(
      "UPDATE Facturas SET monto = ?, fecha = ?, condicion = ?, cliente_id = ?, pagada = ?, saldo = ? WHERE numero_factura = ?;",
      [monto, fecha, condicion, cliente_id, pagada, saldo, numero_factura]
    );
    console.log("✅ Factura actualizada con éxito");
  } catch (err) {
    console.error("❌ Error al actualizar factura:", err);
  }
};

// Método para cancelar una factura
// ***********************
export const cancelarFactura = async (numero_factura) => {
  const db = getDB();
  try {
    await db.runAsync(
      "UPDATE Facturas SET cancelada = 1 WHERE numero_factura = ?;",
      [numero_factura]
    );
    console.log(`✅ Factura ${numero_factura} marcada como cancelada`);
  } catch (err) {
    console.error(`❌ Error cancelando factura ${numero_factura}:`, err);
  }
};

// ***********************
// Métodos para DetalleFactura
// ***********************

// Insertar un detalle en una factura
export const insertDetalleFactura = async (numero_factura, sku, cantidad, precio_unitario) => {
  const db = getDB();
  try {
    await db.runAsync(
      "INSERT INTO DetalleFactura (numero_factura, sku, cantidad, precio_unitario) VALUES (?, ?, ?, ?);",
      [numero_factura, sku, cantidad, precio_unitario]
    );
    console.log("✅ Detalle de factura insertado con éxito");
  } catch (err) {
    console.error("❌ Error al insertar detalle de factura:", err);
  }
};

// Obtener los detalles de una factura específica
export const getDetalleFacturaByNumero = async (numero_factura) => {
  const db = getDB();
  try {
    const result = await db.getAllAsync(
      `SELECT D.id, D.numero_factura, D.sku, D.cantidad, D.precio_unitario, P.descripcion, P.referencia
       FROM DetalleFactura D
       LEFT JOIN Productos P ON D.sku = P.sku
       WHERE D.numero_factura = ?
       ORDER BY D.id ASC;`,
      [numero_factura]
    );
    return result;
  } catch (err) {
    console.error("❌ Error al obtener detalle de factura:", err);
    return [];
  }
};


// Actualizar un detalle de factura existente
export const updateDetalleFactura = async (id, numero_factura, sku, cantidad, precio_unitario) => {
  const db = getDB();
  try {
    await db.runAsync(
      "UPDATE DetalleFactura SET numero_factura = ?, sku = ?, cantidad = ?, precio_unitario = ? WHERE id = ?;",
      [numero_factura, sku, cantidad, precio_unitario, id]
    );
    console.log("✅ Detalle de factura actualizado con éxito");
  } catch (err) {
    console.error("❌ Error al actualizar detalle de factura:", err);
  }
};


export const createFacturaConDetalles = async (monto, fecha, condicion, clienteId, detalles, pagada, saldo) => {
  try {
    // Inserta la factura
    await insertFactura(monto, fecha, condicion, clienteId, pagada, saldo);

    // Recupera el último ID insertado en la tabla Facturas
    const db = getDB();
    const result = await db.getAllAsync("SELECT last_insert_rowid() AS lastId;");
    const numero_factura = result[0].lastId;

    // Inserta cada registro en la tabla de DetalleFactura
    for (const detalle of detalles) {
      // detalle debe contener { sku, cantidad, precio }
      await insertDetalleFactura(numero_factura, detalle.sku, detalle.cantidad, detalle.precio);
    }
    return numero_factura;
  } catch (error) {
    console.error("Error en createFacturaConDetalles:", error);
    throw error;
  }
};

// Borrar todos los detalles asociados a una factura
export const deleteDetallesFactura = async (numero_factura) => {
  const db = getDB();
  try {
    const result = await db.runAsync(
      "DELETE FROM DetalleFactura WHERE numero_factura = ?;",
      numero_factura
    );
    console.log(`✅ Detalles borrados: ${result.changes}`);
    return result.changes;
  } catch (error) {
    console.error("❌ Error al borrar detalles de factura:", error);
    throw error;
  }
};


///recibosssss

// Insertar un nuevo recibo
export const insertRecibo = async (numero_recibo, fecha, factura_id, cliente_id, monto) => {
  const db = getDB();
  try {
    await db.runAsync(
      "INSERT INTO Recibos (numero_recibo, fecha, factura_id, cliente_id, monto) VALUES (?, ?, ?, ?, ?);",
      [numero_recibo, fecha, factura_id, cliente_id, monto]
    );
    console.log("✅ Recibo insertado con éxito");
  } catch (err) {
    console.error("❌ Error al insertar recibo:", err);
  }
};



// ***********************
// Crear recibo con numero = 'R' + id, reutilizando insertRecibo
// ***********************
export const createReciboConNumero = async (fecha, factura_id, cliente_id, monto) => {
  const db = getDB();
  try {
    await db.runAsync("BEGIN TRANSACTION;");

    // 1) Insertamos un registro provisional para obtener el id
    //    pasamos '' (cadena vacía) como numero_recibo temporal
    await insertRecibo('', fecha, factura_id, cliente_id, monto);

    // 2) Recuperamos el id generado
    const [{ id }] = await db.getAllAsync("SELECT last_insert_rowid() AS id;");

    // 3) Generamos el número definitivo
    const numeroRecibo = `R000${id}`;

    // 4) Lo actualizamos en la fila recién creada
    await db.runAsync(
      "UPDATE Recibos SET numero_recibo = ? WHERE id = ?;",
      [numeroRecibo, id]
    );

    await db.runAsync("COMMIT;");
    console.log(`✅ Recibo creado con numero_recibo=${numeroRecibo}`);
    return { id, numero_recibo: numeroRecibo };
  } catch (err) {
    await db.runAsync("ROLLBACK;");
    console.error("❌ Error en createReciboConNumero:", err);
    throw err;
  }
};



//Obtener todos los recibos
export const getAllRecibos = async () => {
  const db = getDB();
  try {
    const sql = `
      SELECT
        R.id,
        R.numero_recibo,
        R.fecha,
        R.factura_id,
        R.cliente_id,
        R.monto,
        R.cancelado,
        C.nombre    AS cliente,
        C.direccion AS direccion    -- <-- agregamos esto
      FROM Recibos R
      LEFT JOIN Clientes C ON R.cliente_id = C.id
      ORDER BY R.fecha DESC;
    `;
    return await db.getAllAsync(sql);
  } catch (err) {
    console.error("❌ Error al obtener todos los recibos:", err);
    return [];
  }
};


// 2) Obtener todos los recibos de un cliente específico
export const getRecibosByCliente = async (cliente_id) => {
  const db = getDB();
  try {
    const sql = `
      SELECT
        R.id,
        R.numero_recibo,
        R.fecha,
        R.factura_id,
        R.monto,
        R.cancelado
      FROM Recibos R
      WHERE R.cliente_id = ?
      ORDER BY R.fecha DESC;
    `;
    return await db.getAllAsync(sql, [cliente_id]);
  } catch (err) {
    console.error(
      `❌ Error al obtener recibos para cliente \${cliente_id}:`,
      err
    );
    return [];
  }
};


// Obtener todos los recibos de una factura
export const getRecibosByFactura = async (factura_id) => {
  const db = getDB();
  try {
    return await db.getAllAsync(
      `SELECT R.id, R.numero_recibo, R.fecha, R.monto, R.cancelado, C.nombre AS cliente
       FROM Recibos R
       LEFT JOIN Clientes C ON R.cliente_id = C.id
       WHERE R.factura_id = ?
       ORDER BY R.fecha DESC;`,
      [factura_id]
    );
  } catch (err) {
    console.error("❌ Error al obtener recibos de factura:", err);
    return [];
  }
};

// (Opcional) Obtener un recibo por ID
export const getReciboById = async (id) => {
  const db = getDB();
  try {
    const filas = await db.getAllAsync("SELECT * FROM Recibos WHERE id = ?;", [id]);
    return filas.length ? filas[0] : null;
  } catch (err) {
    console.error("❌ Error al obtener recibo por ID:", err);
    return null;
  }
};

// ***********************
// Método para cancelar un recibo y desmarcar la factura como pagada
// ***********************
export const cancelarReciboYFactura = async (numero_recibo) => {
  const db = getDB();
  try {
    // 1) Obtener el id de factura asociado al recibo
    const filas = await db.getAllAsync(
      "SELECT factura_id FROM Recibos WHERE numero_recibo = ?;",
      [numero_recibo]
    );
    if (filas.length === 0) {
      console.warn(`⚠️ No se encontró ningún recibo con número ${numero_recibo}`);
      return;
    }
    const facturaId = filas[0].factura_id;

    // 2) Marcar el recibo como cancelado
    await db.runAsync(
      "UPDATE Recibos SET cancelado = 1 WHERE numero_recibo = ?;",
      [numero_recibo]
    );

    // 3) Volver la factura a estado no pagada
    await db.runAsync(
      "UPDATE Facturas SET pagada = 0 WHERE numero_factura = ?;",
      [facturaId]
    );

    console.log(`✅ Recibo ${numero_recibo} cancelado y factura ${facturaId} marcada como sin pagar`);
  } catch (err) {
    console.error(`❌ Error cancelando recibo y actualizando factura:`, err);
  }
};



// Cabecera
export const insertReciboCabecera = async (fecha, cliente_id, monto_total) => {
  const db = getDB();
  await db.runAsync(
    `INSERT INTO RecibosCabecera (fecha, cliente_id, monto_total) VALUES (?, ?, ?);`,
    [fecha, cliente_id, monto_total]
  );
  const [{ id }] = await db.getAllAsync("SELECT last_insert_rowid() AS id;");
  const numero = `R${String(id).padStart(6, '0')}`;
  await db.runAsync("UPDATE RecibosCabecera SET numero_recibo = ? WHERE id = ?;", [numero, id]);
  return { id, numero_recibo: numero };
};

// Detalle
export const insertReciboDetalle = async (recibo_id, factura_id, monto_aplicado) => {
  const db = getDB();
  await db.runAsync(
    `INSERT INTO RecibosDetalle (recibo_id, factura_id, monto_aplicado) VALUES (?, ?, ?);`,
    [recibo_id, factura_id, monto_aplicado]
  );
};

//abonar a facturas
export const abonarCuenta = async (cliente_id, montoAbono) => {
  const db = getDB();
  try {
    await db.runAsync("BEGIN TRANSACTION;");
    // 1) Insertar cabecera de recibo
    const { id: reciboId } = await insertReciboCabecera(new Date().toISOString(), cliente_id, montoAbono);
    // 2) Obtener facturas pendientes ordenadas por fecha
    const facturas = await db.getAllAsync(
      `SELECT numero_factura, saldo
         FROM Facturas
        WHERE cliente_id = ? AND saldo > 0 AND cancelada = 0
        ORDER BY fecha ASC;`,
      [cliente_id]
    );
    // 3) Distribuir el abono
    let restante = montoAbono;
    for (const f of facturas) {
      if (restante <= 0) break;
      const aplicar = Math.min(f.saldo, restante);
      // 3.1) Detalle de recibo
      await insertReciboDetalle(reciboId, f.numero_factura, aplicar);
      // 3.2) Actualizar saldo y estado de factura
      const nuevoSaldo = f.saldo - aplicar;
      await db.runAsync(
        `UPDATE Facturas
            SET saldo = ?, pagada = ?
          WHERE numero_factura = ?;`,
        [nuevoSaldo, nuevoSaldo === 0 ? 1 : 0, f.numero_factura]
      );
      restante -= aplicar;
    }
    await db.runAsync("COMMIT;");
    return reciboId;
  } catch (err) {
    await db.runAsync("ROLLBACK;");
    throw err;
  }
};
