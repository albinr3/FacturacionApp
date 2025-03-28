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

const Customers = ({ navigation }) => {
  // Lista de clientes seleccionados
  const [clientes, setClientes] = useState([
    {
      id: "1",
      nombre: "Juan Pérez",
      telefono: "809-555-1234",
      direccion: "Calle 10, Santo Domingo",
      facturas: [
        { numero: "F001", monto: 1530.75, fecha: "2024-03-10" },
        { numero: "F002", monto: 9000.5, fecha: "2024-03-15" },
      ],
    },
    {
      id: "2",
      nombre: "María González",
      telefono: "829-888-5678",
      direccion: "Av. Principal, Santiago",
      facturas: [],
    },
    {
      id: "3",
      nombre: "Carlos Ramírez",
      telefono: "849-777-9123",
      direccion: "Calle B, La Vega",
      facturas: [{ numero: "F003", monto: 2000, fecha: "2024-02-28" }],
    },
    {
      id: "4",
      nombre: "Ana López",
      telefono: "809-333-4567",
      direccion: "Calle C, San Cristóbal",
      facturas: [],
    },
    {
      id: "5",
      nombre: "Pedro Martínez",
      telefono: "829-222-7890",
      direccion: "Av. Duarte, Puerto Plata",
      facturas: [
        { numero: "F004", monto: 3200.3, fecha: "2024-03-05" },
        { numero: "F005", monto: 1500.0, fecha: "2024-03-12" },
      ],
    },
  ]);
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

  const guardarCliente = () => {
    if (!clienteActual.nombre.trim()) {
      Alert.alert("Error", "El nombre no puede estar vacío.");
      return;
    }
    if (modoEdicion) {
      setClientes((prev) =>
        prev.map((p) => (p.id === clienteActual.id ? clienteActual : p))
      );
    } else {
      setClientes((prev) => [...prev, clienteActual]);
    }
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
            {["nombre", "id", "direccion", "telefono"].map((campo) => (
              <TextInput
                key={campo}
                style={styles.input}
                placeholder={campo.toUpperCase()}
                value={clienteActual[campo].toString()}
                onChangeText={(text) =>
                  setClienteActual((prev) => ({
                    ...prev,
                    [campo]: campo === "id" ? text.toString() : text,
                  }))
                }
                keyboardType={
                  campo === "telefono" || campo === "id"
                    ? "phone-pad"
                    : "default"
                }
              />
            ))}
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
