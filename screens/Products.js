import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TextInput,
  Pressable,
  Modal,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const Products = ({ navigation }) => {
  // Lista de productos seleccionados
  const [productos, setProductos] = useState([
    {
      id: "1",
      sku: 2018,
      descripcion: "Bocina neodimio",
      ref: "YR-901",
      precio: 32.8,
      cantidad: 22,
      existencia: 1432,
    },
    {
      id: "2",
      sku: 2019,
      descripcion: "Sueter XL Blanco",
      ref: "YR-0909",
      precio: 1000,
      cantidad: 15,
      existencia: 4432,
    },
    {
      id: "3",
      sku: 3011,
      descripcion: "Bocina neodimio",
      ref: "YR-FA-437",
      precio: 32.8,
      cantidad: 22,
      existencia: 340,
    },
    {
      id: "4",
      sku: 4213,
      descripcion: "Sueter XL Blanco",
      ref: "YR-10",
      precio: 1000,
      cantidad: 15,
      existencia: 22,
    },
    {
      id: 5,
      sku: 5021,
      descripcion: "Audífonos Bluetooth",
      ref: "YR-BT-001",
      precio: 250.5,
      cantidad: 30,
      existencia: 500,
    },
    {
      id: 6,
      sku: 5022,
      descripcion: "Teclado mecánico RGB",
      ref: "YR-KB-002",
      precio: 850,
      cantidad: 10,
      existencia: 150,
    },
    {
      id: 7,
      sku: 5023,
      descripcion: "Mouse inalámbrico",
      ref: "YR-MS-003",
      precio: 320.75,
      cantidad: 25,
      existencia: 300,
    },
    {
      id: 8,
      sku: 5024,
      descripcion: "Monitor LED 24 pulgadas",
      ref: "YR-MN-004",
      precio: 4200,
      cantidad: 5,
      existencia: 80,
    },
    {
      id: 9,
      sku: 5025,
      descripcion: "Cable HDMI 2M",
      ref: "YR-CB-005",
      precio: 120.5,
      cantidad: 50,
      existencia: 1000,
    },
    {
      id: 10,
      sku: 5026,
      descripcion: "Mochila para laptop",
      ref: "YR-MP-006",
      precio: 540,
      cantidad: 20,
      existencia: 250,
    },
    {
      id: 11,
      sku: 5027,
      descripcion: "Disco Duro Externo 1TB",
      ref: "YR-DD-007",
      precio: 1350,
      cantidad: 12,
      existencia: 120,
    },
    {
      id: 12,
      sku: 5028,
      descripcion: "Memoria USB 64GB",
      ref: "YR-USB-008",
      precio: 250,
      cantidad: 40,
      existencia: 600,
    },
    {
      id: 13,
      sku: 5029,
      descripcion: "Cargador inalámbrico",
      ref: "YR-CH-009",
      precio: 450,
      cantidad: 18,
      existencia: 180,
    },
    {
      id: 14,
      sku: 5030,
      descripcion: "Smartwatch Deportivo",
      ref: "YR-SW-010",
      precio: 1850,
      cantidad: 8,
      existencia: 90,
    },
    {
      id: 15,
      sku: 5031,
      descripcion: "Lámpara LED Escritorio",
      ref: "YR-LD-011",
      precio: 320,
      cantidad: 15,
      existencia: 220,
    },
    {
      id: 16,
      sku: 5032,
      descripcion: "Batería Externa 10000mAh",
      ref: "YR-PB-012",
      precio: 750,
      cantidad: 22,
      existencia: 160,
    },
    {
      id: 17,
      sku: 5033,
      descripcion: "Parlante Bluetooth",
      ref: "YR-SP-013",
      precio: 1200,
      cantidad: 14,
      existencia: 130,
    },
    {
      id: 18,
      sku: 5034,
      descripcion: "Teclado y Mouse Inalámbrico Rojo y azul de 32gb",
      ref: "YR-KM-014",
      precio: 950,
      cantidad: 10,
      existencia: 110,
    },
    {
      id: 19,
      sku: 5035,
      descripcion: "Router WiFi 6",
      ref: "YR-RT-015",
      precio: 2200,
      cantidad: 7,
      existencia: 75,
    },
    {
      id: 20,
      sku: 5036,
      descripcion: "Cámara de Seguridad WiFi",
      ref: "YR-CS-016",
      precio: 2800,
      cantidad: 6,
      existencia: 60,
    },
    {
      id: 21,
      sku: 5037,
      descripcion: "Base de Refrigeración Laptop",
      ref: "YR-BR-017",
      precio: 560,
      cantidad: 12,
      existencia: 140,
    },
    {
      id: 22,
      sku: 5038,
      descripcion: "Tablet Android 10 pulgadas",
      ref: "YR-TB-018",
      precio: 4800,
      cantidad: 4,
      existencia: 40,
    },
    {
      id: 23,
      sku: 5039,
      descripcion: "Micrófono Profesional USB",
      ref: "YR-MC-019",
      precio: 1600,
      cantidad: 9,
      existencia: 100,
    },
    {
      id: 24,
      sku: 5040,
      descripcion: "Luces LED RGB",
      ref: "YR-LR-020",
      precio: 450,
      cantidad: 30,
      existencia: 500,
    },
  ]);
  const [buscarTexto, setBuscarTexto] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [productoActual, setProductoActual] = useState({
    id: "",
    sku: "",
    descripcion: "",
    ref: "",
    precio: "",
    existencia: "",
  });

  const abrirModal = (producto = null) => {
    if (producto) {
      setProductoActual(producto);
      setModoEdicion(true);
    } else {
      setProductoActual({
        id: Date.now().toString(),
        sku: "",
        descripcion: "",
        ref: "",
        precio: "",
        existencia: "",
      });
      setModoEdicion(false);
    }
    setModalVisible(true);
  };

  const guardarProducto = () => {
    if (!productoActual.descripcion.trim()) {
      Alert.alert("Error", "La descripción no puede estar vacía.");
      return;
    }
    if (modoEdicion) {
      setProductos((prev) =>
        prev.map((p) => (p.id === productoActual.id ? productoActual : p))
      );
    } else {
      setProductos((prev) => [...prev, productoActual]);
    }
    setModalVisible(false);
  };

  const productosFiltrados = productos.filter((item) =>
    `${item.descripcion} ${item.sku} ${item.ref}`
      .toLowerCase()
      .includes(buscarTexto.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header con botón de volver */}
      <View style={styles.headerRow}>
        <Pressable onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons
            name="keyboard-backspace"
            style={styles.iconTitle}
          />
        </Pressable>
        <Text style={styles.textTitle}>PRODUCTOS</Text>
        <Pressable onPress={() => abrirModal()} style={styles.botonAgregar}>
          <MaterialCommunityIcons name="plus" color="#fff" size={24} />
        </Pressable>
      </View>

      {/* Buscador */}
      <View style={styles.buscador}>
        <TextInput
          placeholder="Buscar producto..."
          value={buscarTexto}
          onChangeText={setBuscarTexto}
          style={{ flex: 1 }}
        />
        <MaterialCommunityIcons name="magnify" style={styles.iconSearch} />
      </View>

      {/* Lista */}
      <FlatList
        data={productosFiltrados}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable style={styles.card} onPress={() => abrirModal(item)}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <MaterialCommunityIcons
                name="pencil"
                size={22}
                color="#0073c6"
                style={{ marginRight: 10 }}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.cardText}>{item.descripcion}</Text>
                <Text
                  style={[styles.cardText, { fontSize: 13, color: "#555" }]}
                >
                  SKU: {item.sku} · REF: {item.ref} · Precio: ${item.precio}
                </Text>
              </View>
            </View>
          </Pressable>
        )}
      />

      {/* Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {modoEdicion ? "Editar Producto" : "Nuevo Producto"}
            </Text>
            {["descripcion", "sku", "ref", "precio", "existencia"].map(
              (campo) => (
                <TextInput
                  key={campo}
                  style={styles.input}
                  placeholder={campo.toUpperCase()}
                  value={productoActual[campo].toString()}
                  onChangeText={(text) =>
                    setProductoActual((prev) => ({
                      ...prev,
                      [campo]:
                        campo === "sku" ||
                        campo === "precio" ||
                        campo === "existencia"
                          ? Number(text)
                          : text,
                    }))
                  }
                  keyboardType={
                    ["precio", "sku", "existencia"].includes(campo)
                      ? "numeric"
                      : "default"
                  }
                />
              )
            )}
            <View style={{ flexDirection: "row", gap: 10 }}>
              <Pressable
                style={styles.btnCancelar}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.btnText}>Cancelar</Text>
              </Pressable>
              <Pressable style={styles.btnGuardar} onPress={guardarProducto}>
                <Text style={styles.btnText}>Guardar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 10 },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  iconTitle: {
    color: "#0073c6",
    fontSize: 28,
  },
  textTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0073c6",
  },
  botonAgregar: {
    backgroundColor: "#0073c6",
    padding: 10,
    borderRadius: 8,
  },
  buscador: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 5,
  },
  iconSearch: {
    fontSize: 24,
    color: "#0073c6",
    marginLeft: 5,
  },
  card: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

  cardText: {
    fontSize: 15,
    color: "#333",
    lineHeight: 20,
  },

  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    gap: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0073c6",
    textAlign: "center",
    marginBottom: 5,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#0073c6",
    fontSize: 16,
    padding: 8,
  },
  btnCancelar: {
    flex: 1,
    padding: 10,
    backgroundColor: "#999",
    borderRadius: 8,
  },
  btnGuardar: {
    flex: 1,
    padding: 10,
    backgroundColor: "#0073c6",
    borderRadius: 8,
  },
  btnText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default Products;
