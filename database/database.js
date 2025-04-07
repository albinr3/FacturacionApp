import * as SQLite from 'expo-sqlite';

let db;

export const initDB = async () => {
  try {
    db = await SQLite.openDatabaseAsync('mynewdb.db');

    // Tabla de Clientes
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS Clientes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        direccion TEXT,
        telefono TEXT
      );
    `);

    // Tabla de Productos
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS Productos (
        sku TEXT PRIMARY KEY,
        descripcion TEXT NOT NULL,
        referencia TEXT,
        precio REAL NOT NULL,
        existencia INTEGER NOT NULL
      );
    `);

    // Tabla de Proveedores
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS Proveedores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre_proveedor TEXT NOT NULL,
        direccion TEXT,
        telefono TEXT
      );
    `);

    // Tabla de Facturas
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS Facturas (
        numero_factura INTEGER PRIMARY KEY AUTOINCREMENT,
        monto REAL NOT NULL,
        fecha TEXT NOT NULL,
        condicion TEXT NOT NULL, -- 'credito' o 'contado'
        cliente_id INTEGER,
        FOREIGN KEY (cliente_id) REFERENCES Clientes(id)
      );
    `);

    // Tabla de DetalleFactura
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS DetalleFactura (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        numero_factura INTEGER NOT NULL,
        sku TEXT NOT NULL,
        cantidad INTEGER NOT NULL,
        precio_unitario REAL NOT NULL,
        FOREIGN KEY (numero_factura) REFERENCES Facturas(numero_factura),
        FOREIGN KEY (sku) REFERENCES Productos(sku)
      );
    `);

    console.log('✅ Base de datos y tablas inicializadas');
  } catch (err) {
    console.error('❌ Error al inicializar la DB:', err);
  }
};

export const getDB = () => {
  if (!db) {
    throw new Error('❌ La base de datos no está inicializada. ¿Olvidaste llamar initDB()?');
  }
  return db;
};
