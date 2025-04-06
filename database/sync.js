import { supabase } from './supabase';
import { getTodos } from './todos';

export const syncWithSupabase = async () => {
    const localTodos = await getTodos();
    console.log("Local todos a sincronizar:", localTodos);
  
    for (const todo of localTodos) {
      const { data, error } = await supabase
        .from('todos')
        .upsert({
          id: todo.id,
          title: todo.title,
          completed: todo.completed === 1,
          updated_at: todo.updated_at
        });
        
      if (error) {
        console.error("Error al sincronizar el todo:", todo, error);
      } else {
        console.log("Todo sincronizado correctamente:", data);
      }
    }
  
    const { data: serverTodos, error } = await supabase
      .from('todos')
      .select('*');
  
    if (error) {
      console.error("Error al obtener los todos del servidor:", error);
    } else {
      console.log("Todos en el servidor:", serverTodos);
    }
  
    // Aquí podrías comparar los timestamps u otros campos para confirmar que están en sincronía.
    return serverTodos;
  };
  