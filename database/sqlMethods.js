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
    const result = await db.getAllAsync("SELECT * FROM Clientes ORDER BY id DESC;");
    return result;
  } catch (err) {
    console.error("❌ Error al obtener clientes:", err);
    return [];
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
export const insertProducto = async (sku, descripcion, referencia, precio, existencia) => {
  const db = getDB();
  try {
    await db.runAsync(
      "INSERT INTO Productos (sku, descripcion, referencia, precio, existencia) VALUES (?, ?, ?, ?, ?);",
      [sku, descripcion, referencia, precio, existencia]
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
    const result = await db.getAllAsync("SELECT * FROM Productos ORDER BY sku;");
    return result;
  } catch (err) {
    console.error("❌ Error al obtener productos:", err);
    return [];
  }
};

// Actualizar un producto existente
export const updateProducto = async (sku, descripcion, referencia, precio, existencia) => {
  const db = getDB();
  try {
    await db.runAsync(
      "UPDATE Productos SET descripcion = ?, referencia = ?, precio = ?, existencia = ? WHERE sku = ?;",
      [descripcion, referencia, precio, existencia, sku]
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
export const insertFactura = async (monto, fecha, condicion, cliente_id) => {
  const db = getDB();
  try {
    await db.runAsync(
      "INSERT INTO Facturas (monto, fecha, condicion, cliente_id) VALUES (?, ?, ?, ?);",
      [monto, fecha, condicion, cliente_id]
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
    const result = await db.getAllAsync("SELECT * FROM Facturas ORDER BY numero_factura DESC;");
    return result;
  } catch (err) {
    console.error("❌ Error al obtener facturas:", err);
    return [];
  }
};

// Actualizar una factura existente
export const updateFactura = async (numero_factura, monto, fecha, condicion, cliente_id) => {
  const db = getDB();
  try {
    await db.runAsync(
      "UPDATE Facturas SET monto = ?, fecha = ?, condicion = ?, cliente_id = ? WHERE numero_factura = ?;",
      [monto, fecha, condicion, cliente_id, numero_factura]
    );
    console.log("✅ Factura actualizada con éxito");
  } catch (err) {
    console.error("❌ Error al actualizar factura:", err);
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
      "SELECT * FROM DetalleFactura WHERE numero_factura = ? ORDER BY id ASC;",
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
