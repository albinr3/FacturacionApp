import {
  StyleSheet,
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  Modal,
} from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const Facturacion = () => {
  const [visible, setVisible] = useState(false);

  // Lista de productos seleccionados
  const [productos, setProductos] = useState([
    { id: "1", nombre: "Bocina neodimio", precio: 32.8, cantidad: 22 },
    { id: "2", nombre: "Sueter XL Blanco", precio: 1000, cantidad: 15 },
    { id: "3", nombre: "Bocina neodimio", precio: 32.8, cantidad: 22 },
    { id: "4", nombre: "Sueter XL Blanco", precio: 1000, cantidad: 15 },
  ]);

  const totalCantidad = productos.reduce((acc, prod) => acc + prod.cantidad, 0);

  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.headerConfig}>
        <MaterialCommunityIcons
          name="keyboard-backspace"
          style={styles.iconTitle}
        ></MaterialCommunityIcons>
        <Text style={styles.textTitle}>FACTURACION</Text>
        <MaterialCommunityIcons
          name="snowflake-variant"
          style={styles.iconTitle}
        ></MaterialCommunityIcons>
      </View>

      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <MaterialCommunityIcons
            name="script-text-outline"
            style={styles.iconFac}
          ></MaterialCommunityIcons>
        </View>
        <View style={styles.headerText}>
          <View style={styles.textBox}>
            <View style={styles.itemTextbox}>
              <MaterialCommunityIcons
                name="account"
                style={styles.iconData}
              ></MaterialCommunityIcons>
              <Text style={styles.text}>Albin Rodriguez</Text>
            </View>
            <View style={styles.itemTextbox}>
              <MaterialCommunityIcons
                name="phone"
                style={styles.iconData}
              ></MaterialCommunityIcons>
              <Text style={styles.text}>829-240-8542</Text>
            </View>
            <View style={styles.itemTextbox}>
              <MaterialCommunityIcons
                name="store"
                style={styles.iconData}
              ></MaterialCommunityIcons>
              <Text style={styles.text}>C/ CIPRIANO BENCOSME, MOCA</Text>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.buscador}>
        <TextInput editable placeholder="Buscar Cliente" style={{flex:1}}></TextInput>
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

      <View style={styles.grid}>
        <View style={styles.headerRow}>
          <Text style={[styles.cell, styles.cellNumero, styles.headerText]}>
            #
          </Text>
          <Text
            style={[styles.cell, styles.cellDescripcion, styles.headerText]}
          >
            Descripción
          </Text>
          <Text style={[styles.cell, styles.cellCantidad, styles.headerText]}>
            Cantidad
          </Text>
          <Text style={[styles.cell, styles.cellPrecio, styles.headerText]}>
            Precio
          </Text>
        </View>

        {/* Lista de productos */}
        <FlatList
          data={productos}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <View style={styles.row}>
              <Text style={[styles.cell, styles.cellNumero,]}>
                {index + 1}
              </Text>
              <Text style={[styles.cell, styles.cellDescripcion]}>
                {item.nombre}
              </Text>
              <Text style={[styles.cell, styles.cellPrecio]}>
                {item.cantidad}
              </Text>
              <Text style={[styles.cell, styles.cellCantidad]}>
                ${item.precio.toFixed(2)}
              </Text>
            </View>
          )}
        />

        {/* Fila de Totales */}
        <View style={[styles.row, styles.totalRow]}>
          <Text
            style={[
              styles.cell,
              styles.cellNumero,
              styles.totalText,
            ]}
          >
            {productos.length}
          </Text>
          <Text style={[styles.cell, styles.cellDescripcion, styles.totalText]}>
            Total
          </Text>
          <Text style={[styles.cell, styles.cellCantidad, styles.totalText]}>
            {totalCantidad}
          </Text>
          <Text style={[styles.cell, styles.cellPrecio, styles.totalText]}>
            $2,065.10
          </Text>
        </View>
      </View>
    </SafeAreaView>
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
    padding: 10,
    borderRadius: 14,
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
    marginLeft: 6,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.4,
    shadowRadius: 3.84,
    elevation: 5,
    padding: 5,
  },
  itemTextbox: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconData: {
    color: "#0073c6",
    fontSize: 16,
    marginRight: 2,
  },
  text: {
    fontSize: 16,
  },
  textTitle: {
    fontSize: 19,
    fontWeight: "bold",
  },
  iconSearch: {
    fontSize: 30,
    color: "white",
  },
  buscador: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 2,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 10,
    backgroundColor: "#fff", // 🔹 Necesario para que la sombra se vea en iOS
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3, // 🔹 Aumenta la altura para que la sombra sea más visible
    },
    shadowOpacity: 0.4, // 🔹 Reduce la opacidad para que no sea tan fuerte
    shadowRadius: 4, // 🔹 Ajusta el radio de la sombra
    elevation: 8, // 🔹 Para Android
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
  grid: {
    marginTop: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 3,
    padding: 5,
  },
  headerRow: {
    flexDirection: "row",
    backgroundColor: "#0073c6",
    padding: 10,
    borderRadius: 5,
  },
  row: {
    flexDirection: "row",
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  cell: {
    flex: 1,
    textAlign: "center",
    fontSize: 16,
  },
  headerText: {
    color: "#fff",
    fontWeight: "bold",
  },
  totalRow: {
    backgroundColor: "#f1f1f1",
  },
  totalText: {
    fontWeight: "bold",
    color: "#0073c6",
  },

  cellNumero: { flex: 0.5, textAlign: "left" }, // Hace que la columna # sea más pequeña
  cellDescripcion: { flex: 2, textAlign: "left" }, // Más espacio para la descripción
  cellCantidad: { flex: 1, textAlign: "center" }, // Tamaño normal para Cantidad
  cellPrecio: { flex: 1, textAlign: "center" }, // Tamaño normal para Precio
  headerConfig: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
    marginBottom: 14
  },
  iconTitle: {
    color: "#0073c6",
    fontSize: 22,
   
  }
});

export default Facturacion;
