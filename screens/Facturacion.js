import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Dimensions,
  Pressable,
  Modal,
} from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useState } from "react";

const Facturacion = () => {
  const [visible, setVisible] = useState(false);
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <MaterialCommunityIcons
            name="cash-plus"
            style={styles.iconFac}
          ></MaterialCommunityIcons>
        </View>
        <View style={styles.headerText}>
          <Text style={styles.textTitle}>FACTURACION</Text>
          <View style={styles.textBox}>
            <Text style={styles.text}>Albin Rodriguez</Text>
            <Text style={styles.text}>829-240-8542</Text>
            <Text style={styles.text}>C/ CIPRIANO BENCOSME, MOCA</Text>
          </View>
        </View>
      </View>
      <View style={styles.buscador}>
        <TextInput editable placeholder="Buscar Cliente"></TextInput>
        <Pressable onPress={() => setVisible(true)} style={styles.buscadorIcon}>
          <Modal visible={visible}></Modal>
          <MaterialCommunityIcons
            name="account-search-outline"
            style={styles.iconSearch}
          ></MaterialCommunityIcons>
        </Pressable>
      </View>
      <View style={styles.viewBotones}>
        <Pressable style={[styles.botones, { backgroundColor: "white" }]}>
          <MaterialCommunityIcons
            name="plus"
            style={styles.iconAdd}
          ></MaterialCommunityIcons>
          <Text style={[styles.textBotones, { color: "black" }]}>
            Selec. Producto
          </Text>
        </Pressable>
        <Pressable style={styles.botones}>
        <MaterialCommunityIcons
            name="newspaper-variant-multiple"
            style={styles.iconResumen}
          ></MaterialCommunityIcons>
          <Text style={styles.textBotones}> Resumen</Text>
        </Pressable>
      </View>

      <View style={styles.grid}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
  },
  headerIcon: {
    width: 90,
    borderRadius: 60,
    backgroundColor: "#0073c6",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  iconFac: {
    fontSize: 64,
    color: "white",
  },
  headerText: {},
  textBox: {
    borderWidth: 1,
    padding: 4,
    borderRadius: 5,
  },
  text: {
    fontSize: 16,
  },
  textTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  iconSearch: {
    fontSize: 30,
    color: "white",
  },
  buscador: {
    flexDirection: "row",
    borderWidth: 1,
    justifyContent: "space-between",
    padding: 3,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 8,
  },
  buscadorIcon: {
    borderRadius: 60,
    backgroundColor: "#0073c6",
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center",
    width: 40,
    height: 40,
  },
  viewBotones: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  botones: {
    borderRadius: 14,
    backgroundColor: "#0073c6",
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,

    elevation: 9,
    flexDirection: "row",
  },
  textBotones: {
    color: "white",
    fontWeight: "600",
  },
  iconAdd: {
    color: "#0073c6",
    fontSize: 20,
    fontWeight: "bold",
  },
  iconResumen: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default Facturacion;
