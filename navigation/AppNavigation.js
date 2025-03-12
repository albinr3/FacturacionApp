import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";

import { StyleSheet, Dimensions } from "react-native";

import Home from "../screens/Home";
import Facturacion from "../screens/Facturacion";

const Stack = createNativeStackNavigator();
const { width, height } = Dimensions.get("window");

const MainStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Home"
      component={Home}
      options={{ headerShown: false }}
    />
    <Stack.Screen name= "Facturacion" component={Facturacion}/>
  </Stack.Navigator>
);

const AppNavigation = () => {
  return (
    <NavigationContainer>
      <MainStack />
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  splashImage: {
    ...StyleSheet.absoluteFillObject,
    width: width,
    height: height,
  },
});

export default AppNavigation;
