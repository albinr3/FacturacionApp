import { getDB } from './database';

// Insertar tarea nueva
export const insertTodo = async (title) => {
    const db = getDB();
    const now = new Date().toISOString();
  
    console.log("🟡 insertTodo → title:", title);
    console.log("🟡 insertTodo → now:", now);
  
    try {
        await db.runAsync(
            "INSERT INTO todos (title, completed, updated_at) VALUES (?, ?, ?);",
            [title, 0, now]
          );
        console.log("✅ Tarea insertada con éxito");
      } catch (err) {
        console.error("❌ Error real al insertar:", err);
      }
  };
  
// Obtener todas las tareas
export const getTodos = async () => {
  const db = getDB();

  const result = await db.getAllAsync(`SELECT * FROM todos ORDER BY id DESC;`);
  return result; // devuelve array de objetos
};
