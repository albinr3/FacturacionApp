import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TextInput,
  Pressable,
  Modal,
  Alert,
  ActivityIndicator
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import * as Network from "expo-network";

// Importar métodos SQL y sincronización con Supabase
import {
  getProveedores,
  insertProveedor,
  updateProveedor,
} from "../database/sqlMethods";
import { syncWithSupabase } from "../database/sync";

const Proveedores = ({ navigation }) => {
  // Se carga la lista de proveedores desde la base de datos local
  const [proveedores, setProveedores] = useState([]);
  const [buscarTexto, setBuscarTexto] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [loading, setLoading] = useState(false);
  const [proveedorActual, setProveedorActual] = useState({
    id: "",
    nombre: "",
    telefono: "",
    direccion: "",
    facturas: [],
  });

  // Función para cargar los proveedores desde SQLite
  const loadProveedores = async () => {
    try {
      const data = await getProveedores();
      // Como la tabla de proveedores no almacena facturas, asignamos un arreglo vacío para la UI
      const proveedoresConFacturas = data.map((item) => ({
        ...item,
        facturas: [],
      }));
      setProveedores(proveedoresConFacturas);
    } catch (err) {
      console.error("Error cargando proveedores:", err);
    }
  };

  // Función para verificar conectividad y sincronizar con Supabase
  const checkSync = async () => {
    const net = await Network.getNetworkStateAsync();
    if (net.isConnected && net.isInternetReachable) {
      await syncWithSupabase();

    } else {
      console.log("⚠️ No se puede conectar a internet");
    }
  };

  useEffect(() => {
    loadProveedores();
    checkSync();
  }, []);

  const abrirModal = (proveedor = null) => {
    if (proveedor) {
      setProveedorActual(proveedor);
      setModoEdicion(true);
    } else {
      setProveedorActual({
        id: "",
        nombre: "",
        telefono: "",
        direccion: "",
        facturas: [],
      });
      setModoEdicion(false);
    }
    setModalVisible(true);
  };

  const guardarProveedor = async () => {
    if (!proveedorActual.nombre.trim()) {
      Alert.alert("Error", "El nombre no puede estar vacío.");
      return;
    }
    try {
      setLoading(true);
      if (modoEdicion) {
        await updateProveedor(
          proveedorActual.id,
          proveedorActual.nombre,
          proveedorActual.direccion,
          proveedorActual.telefono
        );
      } else {
        await insertProveedor(
          proveedorActual.nombre,
          proveedorActual.direccion,
          proveedorActual.telefono
        );
      }
      await loadProveedores();
      await syncWithSupabase();
    } catch (err) {
      console.error("Error guardando proveedor:", err);
    }
    setLoading(false);
    setModalVisible(false);
  };

  const proveedoresFiltrados = proveedores.filter((item) =>
    `${item.nombre_proveedor} ${item.id}`
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
        <Text style={styles.textTitle}>PROVEEDORES</Text>
        <Pressable onPress={() => abrirModal()} style={styles.botonAgregar}>
          <MaterialCommunityIcons name="plus" color="#fff" size={24} />
        </Pressable>
      </View>

      {/* Buscador */}
      <View style={styles.buscador}>
        <TextInput
          placeholder="Buscar proveedor..."
          value={buscarTexto}
          onChangeText={setBuscarTexto}
          style={{ flex: 1 }}
        />
        <MaterialCommunityIcons name="magnify" style={styles.iconSearch} />
      </View>

      {/* Lista */}
      <FlatList
        data={proveedoresFiltrados}
        keyExtractor={(item) => item.id.toString()}
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
                <Text style={styles.cardText}>{item.nombre_proveedor}</Text>
                <Text
                  style={[styles.cardText, { fontSize: 13, color: "#555" }]}
                >
                  Id: {item.id} · {item.direccion} · Tel: {item.telefono}
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
              {modoEdicion ? "Editar Proveedor" : "Nuevo Proveedor"}
            </Text>
            {modoEdicion && (
              <TextInput
                style={[
                  styles.input,
                  { backgroundColor: "#eee", color: "#666" },
                ]}
                placeholder="ID"
                value={proveedorActual.id?.toString()}
                editable={false}
              />
            )}
            {["nombre", "direccion", "telefono"].map((campo) => (
              <TextInput
                key={campo}
                style={styles.input}
                placeholder={campo.toUpperCase()}
                value={proveedorActual[campo]?.toString()}
                onChangeText={(text) =>
                  setProveedorActual((prev) => ({
                    ...prev,
                    [campo]: text,
                  }))
                }
                keyboardType={campo === "telefono" ? "phone-pad" : "default"}
              />
            ))}

            {/* Muestra el ActivityIndicator cuando está cargando */}
            {loading && (
              <ActivityIndicator
                size="large"
                color="#0073c6"
                style={{ marginVertical: 10 }}
              />
            )}

            <View style={{ flexDirection: "row", gap: 10 }}>
              <Pressable
                style={styles.btnCancelar}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.btnText}>Cancelar</Text>
              </Pressable>
              <Pressable style={styles.btnGuardar} onPress={guardarProveedor}>
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

export default Proveedores;
