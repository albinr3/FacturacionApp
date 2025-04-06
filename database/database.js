import * as SQLite from 'expo-sqlite';

let db;

export const initDB = async () => {
  try {
    db = await SQLite.openDatabaseAsync('mydb.db');

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS todos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        completed INTEGER DEFAULT 0,
        updated_at TEXT
      );
    `);

    console.log('✅ Base de datos y tabla inicializadas');
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

