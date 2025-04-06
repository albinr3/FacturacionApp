import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, FlatList, Text } from 'react-native';
import * as Network from 'expo-network';
import { initDB } from '../database/database';
import { insertTodo, getTodos } from '../database/todos';
import { syncWithSupabase } from '../database/sync';

export default function App() {
  const [text, setText] = useState('');
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    const setup = async () => {
      await initDB();     // ✅ ahora sí esperamos
      await loadTodos();  // también podrías esperar aquí
      await checkSync();
    };
    setup();
  }, []);

  const loadTodos = async () => {
    const items = await getTodos();
    setTodos(items);
  };

  const addTodo = async () => {
    const trimmed = text.trim();
  
    if (!trimmed) {
      console.warn("⚠️ No se puede agregar una tarea vacía");
      return;
    }
  
    try {
      console.log("Agregando tarea:", trimmed);
      await insertTodo(trimmed);
      setText('');
      await loadTodos();

          // Llamar a la sincronización inmediatamente después de agregar

      await checkSync();
    } catch (err) {
      console.error("❌ Error al agregar tarea:", err);
    }
  };
  
  

  const checkSync = async () => {
    const net = await Network.getNetworkStateAsync();
    if (net.isConnected && net.isInternetReachable) {
      await syncWithSupabase();
      loadTodos();
      console.log("Si habia internet")
    } else {
      console.log("⚠️ No se puede conectar a internet")
    }
  };

  return (
    <View style={{ padding: 20, marginTop: 50 }}>
      <TextInput
        value={text}
        onChangeText={setText}
        placeholder="Nueva tarea"
        style={{ borderWidth: 1, padding: 8, marginBottom: 10 }}
      />
      <Button title="Agregar" onPress={addTodo} />
      <FlatList
        data={todos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Text style={{ padding: 8 }}>{item.title}</Text>
        )}
      />
    </View>
  );
}
