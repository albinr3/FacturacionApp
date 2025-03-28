import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";

import { StyleSheet, Dimensions } from "react-native";

import Home from "../screens/Home";
import Facturacion from "../screens/Facturacion";
import Cxc from "../screens/Cxc";
import Products from "../screens/Products";
import Customers from "../screens/Customers";

const Stack = createNativeStackNavigator();
const { width, height } = Dimensions.get("window");

const MainStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Home"
      component={Home}
      options={{ headerShown: false }}
    />
    <Stack.Screen name= "Facturacion" component={Facturacion} options={{ headerShown: false }}/>
    <Stack.Screen name= "Cxc" component={Cxc} options={{ headerShown: false }}/>
    <Stack.Screen name= "Products" component={Products} options={{ headerShown: false }}/>
    <Stack.Screen name= "Customers" component={Customers} options={{ headerShown: false }}/>
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
