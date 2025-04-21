import { StyleSheet, View, Text, Pressable, Dimensions } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { FontAwesome5 } from "@expo/vector-icons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import {
  useFonts,
  Roboto_400Regular,
  Roboto_700Bold,
  Roboto_500Medium,
} from "@expo-google-fonts/roboto";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useContext, useState } from "react";
import { UserContext } from "../navigation/UserContext"; // Importa el contexto


//banner
const { width, height } = Dimensions.get("window");


export default function Home({ navigation }) {
  const { user, setUser } = useContext(UserContext); // Acceder al usuario desde el contexto
  SplashScreen.preventAutoHideAsync();



  const [loaded, error] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
    Roboto_500Medium,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }



  return (
    <View style={styles.container}>
      <View style={styles.configIconRow}>
        {/* <Image
          source={require("../assets/images/logo.png")}
          contentFit="cover"
          style={styles.logo}
        ></Image> */}
        <Pressable onPress={() => navigation.toggleDrawer()}>
          <Feather name="settings" style={styles.configIcon}></Feather>
        </Pressable>

        {/* <Feather name="bell" style={styles.notificationIcon}></Feather> */}
      </View>
      {/* fin header */}

      <View style={styles.rect2}>
        {/* <BannerCarousel /> */}
        <View style={styles.viewSaludo}>
          <View style={styles.holaSofiaStack}>
            <Text style={styles.holaSofia}>Hola Sofia</Text>
            <Text style={styles.text}>En que te podemos ayudar?</Text>
          </View>
        </View>
        <View style={styles.viewBotones}>
          <Pressable
            style={styles.buttonResultados}
            onPress={() => navigation.navigate("Facturacion")}
          >
            <FontAwesome5 name="clipboard" style={styles.icon2}></FontAwesome5>
            <Text style={styles.textButtonUp}>
              FACTURACION
            </Text>
          </Pressable>
          <Pressable
            style={styles.buttonFacturar}
            onPress={() => navigation.navigate("Cxc")}
          >
            <FontAwesome5 name="coins" style={styles.icon3}></FontAwesome5>
            <Text style={styles.textButtonUp}>CXC</Text>
          </Pressable>
          <Pressable
            style={styles.buttonPrueba}
            onPress={() => navigation.navigate("Products")}
          >
            <FontAwesome5 name="boxes" style={styles.iconPrueba}></FontAwesome5>
            <Text style={styles.textButton}>
              PRODUCTOS
            </Text>
          </Pressable>

          <Pressable
            style={styles.buttonPerfil}
            onPress={() => navigation.navigate("Customers")}
          >
            <FontAwesome5 name="users" style={styles.icon4}></FontAwesome5>
            <Text style={styles.textButton}>CLIENTES</Text>
          </Pressable>
          <Pressable
            style={styles.buttonSucursales}
            onPress={() => navigation.navigate("Proveedores")}
          >
            <FontAwesome5 name="truck" style={styles.iconMap}></FontAwesome5>
            <Text style={styles.textButton}>PROVEEDORES</Text>
          </Pressable>
          <Pressable
            style={styles.buttonBlog}
            onPress={() => navigation.navigate("ConsultaFacturas")}
          >
            <MaterialCommunityIcons
              name="image-album"
              style={styles.iconBlog}
            ></MaterialCommunityIcons>
            <Text style={styles.textButton}>CONSULTA FACT</Text>
          </Pressable>

          <Pressable
            style={styles.buttonBlog}
            onPress={() => navigation.navigate("ConsultaRecibos")}
          >
            <MaterialCommunityIcons
              name="image-album"
              style={styles.iconBlog}
            ></MaterialCommunityIcons>
            <Text style={styles.textButton}>CONSULTA RECIBOS</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

// Declara el estilo base 'button' fuera de StyleSheet.create
const button = {
  width: "1%",
  height: 105,
  borderRadius: 20,
  marginBottom: 5,
  alignItems: "center",
  justifyContent: "center",
  flexBasis: "40%",
};

const buttonAbajo = {
  backgroundColor: "#f7fafd",
  
  shadowColor: "#000000",
  shadowOffset: {
    width: 0,
    height: 1,
  },
  shadowOpacity: 0.22,
  shadowRadius: 2.22,

  elevation: 3,
}

const iconButtonsAbajo = {
  color: "#014d84",
  fontSize: 38,
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(253,252,252,1)",
  },
  configIcon: {
    color: "rgba(128,128,128,1)",
    fontSize: 30,
  },
  logo: {
    width: 75,
    height: 75,
  },
  notificationIcon: {
    color: "rgba(128,128,128,1)",
    fontSize: 32,
    marginLeft: 62,
    marginTop: 50,
  },
  configIconRow: {
    marginTop: 30,
    flexDirection: "row",
    paddingHorizontal: 10,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    marginBottom: 4,
  },
  rect2: {
    width: "100%",
    marginTop: 1,
  },
  viewSaludo: {
    height: height * 0.14,
    marginTop: 71,
  },
  holaSofia: {
    position: "absolute",
    fontFamily: "Roboto_400Regular",
    color: "#121212",
    textAlign: "center",
    fontSize: 24,
    top: 0,
    left: 0,
    right: 0,
  },
  text: {
    position: "absolute",
    fontFamily: "Roboto_700Bold",
    color: "#121212",
    textAlign: "center",
    fontSize: 22,
    left: 0,
    top: 28,
    right: 0,
  },
  holaSofiaStack: {
    height: 54,
    marginTop: 22,
  },
  viewBotones: {
    flexDirection: "row",
    justifyContent: "space-around",
    flexWrap: "wrap",
    marginTop: 20,
    paddingHorizontal: 5,
  },

  

  textButton: {
    fontFamily: "Roboto_500Medium",
    color: "#014d84",
    fontSize: 18,
    alignItems: "center",
    alignSelf: "center",
    marginTop: 0,
  },
  textButtonUp: {
    fontFamily: "Roboto_500Medium",
    color: "#ffffff",
    fontSize: 22,
    alignItems: "center",
    alignSelf: "center",
    marginTop: 0,
  },
  
  buttonResultados: {
    ...button,
    backgroundColor: "#0073c6",
    width: 140,
    height: 140,
    flexBasis: "47%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },

  icon2: {
    color: "rgba(255,255,255,1)",
    fontSize: 48,
  },

  buttonFacturar: {
    ...button,
    backgroundColor: "#0073c6",
    width: 140,
    height: 140,
    flexBasis: "47%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },
  icon3: {
    color: "rgba(255,255,255,1)",
    fontSize: 48,
  },

  buttonPrueba: {
    ...button,
    ...buttonAbajo,
    marginTop: 10,
  },

  iconPrueba: {
    ...iconButtonsAbajo
  },
  
  buttonPerfil: {
    ...button,
    ...buttonAbajo,
    marginTop: 10,
    
  },

  icon4: {
    ...iconButtonsAbajo
  },
  buttonSucursales: {
    ...button,
   ...buttonAbajo
  },

  iconMap: {
    ...iconButtonsAbajo
  },

  buttonBlog: {
    ...button,
    ...buttonAbajo
  },

  iconBlog: {
    ...iconButtonsAbajo
  },


  paginationContainer: {
    // Ajusta este valor para colocar los puntos más arriba o más abajo
    width: "100%",
  },
});
