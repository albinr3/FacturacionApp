// App.js
import './gesture-handler';
import AppNavigation from './navigation/AppNavigation';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { UserProvider } from './navigation/UserContext';
import React, { useEffect } from "react";
import { initDB } from './database/database'; // Asegúrate de la ruta correcta

function App() {
  useEffect(() => {
    const initializeDatabase = async () => {
      await initDB();
    };
    initializeDatabase();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <UserProvider>
        <AppNavigation />
      </UserProvider>
    </GestureHandlerRootView>
  );
}

export default App;
