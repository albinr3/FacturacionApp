import React, { useEffect, useState } from 'react';
import { Text, View, Button, FlatList } from 'react-native';
import { database } from '../database/database';
import { supabase } from '../database/supabase';

export default function Prueba() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const observeTasks = async () => {
      const collection = database.collections.get('tasks');
      const allTasks = await collection.query().fetch();
      setTasks(allTasks);
    };

    observeTasks();
  }, []);

  const addTask = async () => {
    const collection = database.collections.get('tasks');
    await database.write(async () => {
      await collection.create(task => {
        task.title = `Tarea ${Math.random().toFixed(2)}`;
        task.isCompleted = false;
      });
    });

    const updated = await collection.query().fetch();
    setTasks(updated);
  };

  const syncToSupabase = async () => {
    const collection = database.collections.get('tasks');
    const localTasks = await collection.query().fetch();

    for (const task of localTasks) {
      await supabase.from('tasks').upsert({
        id: task.id,
        title: task.title,
        is_completed: task.isCompleted,
      });
    }

    alert('Sincronizado con Supabase');
  };

  return (
    <View style={{ padding: 30 }}>
      <Button title="Agregar tarea" onPress={addTask} />
      <Button title="Sincronizar con Supabase" onPress={syncToSupabase} />
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text style={{ marginVertical: 5 }}>
            {item.title} - {item.isCompleted ? '✔️' : '❌'}
          </Text>
        )}
      />
    </View>
  );
}
