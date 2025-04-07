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
  getClientes,
  insertCliente,
  updateCliente,
} from "../database/sqlMethods";
import { syncWithSupabase } from "../database/sync";

const Customers = ({ navigation }) => {
  // Inicialmente, el listado de clientes se carga desde la base de datos local
  const [loading, setLoading] = useState(false);

  const [clientes, setClientes] = useState([]);
  const [buscarTexto, setBuscarTexto] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [clienteActual, setClienteActual] = useState({
    id: "",
    nombre: "",
    telefono: "",
    direccion: "",
    facturas: [],
  });

  // Función para cargar los clientes desde la base de datos SQL
  const loadClientes = async () => {
    try {
      const data = await getClientes();
      // Como en la DB no se almacena el arreglo "facturas", se asigna un arreglo vacío para la UI
      const clientesConFacturas = data.map((item) => ({
        ...item,
        facturas: [],
      }));
      setClientes(clientesConFacturas);
    } catch (err) {
      console.error("Error cargando clientes:", err);
    }
  };

  // Función para verificar la conectividad y sincronizar con Supabase si es posible
  const checkSync = async () => {
    const net = await Network.getNetworkStateAsync();
    if (net.isConnected && net.isInternetReachable) {
      await syncWithSupabase();
      console.log("Si habia internet");
    } else {
      console.log("⚠️ No se puede conectar a internet");
    }
  };
  // Cargar clientes y verificar sincronización al montar el componente
  useEffect(() => {
    loadClientes();
    checkSync();
  }, []);

  const abrirModal = (cliente = null) => {
    if (cliente) {
      setClienteActual(cliente);
      setModoEdicion(true);
    } else {
      setClienteActual({
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

  // Guardar o actualizar cliente en SQL y sincronizar con Supabase
  const guardarCliente = async () => {
    if (!clienteActual.nombre.trim()) {
      Alert.alert("Error", "El nombre no puede estar vacío.");
      return;
    }
    try {
      setLoading(true);

      if (modoEdicion) {
        await updateCliente(
          clienteActual.id,
          clienteActual.nombre,
          clienteActual.direccion,
          clienteActual.telefono
        );
      } else {
        await insertCliente(
          clienteActual.nombre,
          clienteActual.direccion,
          clienteActual.telefono
        );
      }
      // Recargar los clientes desde la base de datos local
      await loadClientes();
      // Sincronizar con Supabase
      await syncWithSupabase();
    } catch (error) {
      console.error("Error guardando el cliente:", error);
    }
    setLoading(false);

    setModalVisible(false);
  };

  const clientesFiltrados = clientes.filter((item) =>
    `${item.nombre} ${item.id}`
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
        <Text style={styles.textTitle}>CLIENTES</Text>
        <Pressable onPress={() => abrirModal()} style={styles.botonAgregar}>
          <MaterialCommunityIcons name="plus" color="#fff" size={24} />
        </Pressable>
      </View>

      {/* Buscador */}
      <View style={styles.buscador}>
        <TextInput
          placeholder="Buscar cliente..."
          value={buscarTexto}
          onChangeText={setBuscarTexto}
          style={{ flex: 1 }}
        />
        <MaterialCommunityIcons name="magnify" style={styles.iconSearch} />
      </View>

      {/* Lista */}
      <FlatList
        data={clientesFiltrados}
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
                <Text style={styles.cardText}>{item.nombre}</Text>
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
              {modoEdicion ? "Editar Cliente" : "Nuevo Cliente"}
            </Text>
            {modoEdicion && (
              <TextInput
                style={[styles.input, styles.inputReadonly]}
                placeholder="ID"
                value={clienteActual.id?.toString()}
                editable={false} // No permite edición
              />
            )}
            {["nombre", "direccion", "telefono"].map((campo) => (
              <TextInput
                key={campo}
                style={styles.input}
                placeholder={campo.toUpperCase()}
                value={clienteActual[campo]?.toString()}
                onChangeText={(text) =>
                  setClienteActual((prev) => ({
                    ...prev,
                    [campo]: text,
                  }))
                }
                keyboardType={campo === "telefono" ? "phone-pad" : "default"}
              />
            ))}
            {/* Muestra el ActivityIndicator cuando está cargando */}
            {loading && <ActivityIndicator size="large" color="#0073c6" style={{ marginVertical: 10 }} />}

            <View style={{ flexDirection: "row", gap: 10 }}>
              <Pressable
                style={styles.btnCancelar}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.btnText}>Cancelar</Text>
              </Pressable>
              <Pressable style={styles.btnGuardar} onPress={guardarCliente}>
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
  inputReadonly: {
    backgroundColor: "#eee",
    color: "#666",
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

export default Customers;
