import React, { createContext, useState } from 'react';

// Crear el contexto
export const UserContext = createContext();

// Proveedor del contexto que envuelve la app
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Estado del usuario
  const [analisis, setAnalisis] = useState([]); //analisis del paciente
  return (
    <UserContext.Provider value={{ user, setUser, analisis, setAnalisis }}>
      {children}
    </UserContext.Provider>
  );
};
