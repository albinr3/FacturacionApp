import './gesture-handler';

import AppNavigation from './navigation/AppNavigation';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
//import * as Sentry from '@sentry/react-native';

// Sentry.init({
//   dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
//   enableInExpoDevelopment: true
//   // uncomment the line below to enable Spotlight (https://spotlightjs.com)
//   // enableSpotlight: __DEV__,
// });
import { UserProvider } from './navigation/UserContext'; // Importa tu contexto
import React, { useEffect } from "react";

function App() {
  useEffect(() => {
    // Descomenta una de estas líneas para probar
     //throw new Error("My first Sentry error!");
    // Sentry.nativeCrash();
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

