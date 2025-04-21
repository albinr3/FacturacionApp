import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";

import { StyleSheet, Dimensions } from "react-native";

import Home from "../screens/Home";
import Facturacion from "../screens/Facturacion";
import Cxc from "../screens/Cxc";
import Products from "../screens/Products";
import Customers from "../screens/Customers";
import Proveedores from "../screens/Proveedores";
import ConsultaFacturas from "../screens/ConsultaFacturas";
import FacturaPdfView from "../screens/FacturaPdfView";
import ConsultaRecibos from "../screens/ConsultaRecibos";
import ReciboPdfView from "../screens/ReciboPdfView";

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
    <Stack.Screen name= "Proveedores" component={Proveedores} options={{ headerShown: false }}/>
    <Stack.Screen name= "ConsultaFacturas" component={ConsultaFacturas} options={{ headerShown: false }}/>
    <Stack.Screen name= "FacturaPdfView" component={FacturaPdfView} options={{ headerShown: false }}/>
    <Stack.Screen name= "ConsultaRecibos" component={ConsultaRecibos} options={{ headerShown: false }}/>
    <Stack.Screen name= "ReciboPdfView" component={ReciboPdfView} options={{ headerShown: false }}/>
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
