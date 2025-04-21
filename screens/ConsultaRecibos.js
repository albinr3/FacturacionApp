import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  Modal,
  ActivityIndicator,
  Keyboard,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Network from "expo-network";

// Métodos SQL y sincronización
import {
  getAllRecibos,
  getReciboById,
  cancelarReciboYFactura,
  getClientes,
} from "../database/sqlMethods";
import { syncRecibos } from "../database/sync";

const ConsultaRecibos = ({ navigation }) => {
  const [recibos, setRecibos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [clientesFiltrados, setClientesFiltrados] = useState([]);
  const [clienteFilter, setClienteFilter] = useState("");
  const [fechaFilter, setFechaFilter] = useState("");
  const [modalClienteVisible, setModalClienteVisible] = useState(false);
  const [modalFechaVisible, setModalFechaVisible] = useState(false);
  const [buscarTextoC, setBuscarTextoC] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  // Cargar recibos y clientes
  const loadData = async () => {
    try {
      // 1) Traemos la info base
      const baseRecibos = await getAllRecibos();

      // 2) Para cada uno obtenemos el campo cancelado
      const completos = await Promise.all(
        baseRecibos.map(async (r) => {
          const full = await getReciboById(r.id);
          return { ...r, cancelado: full.cancelado };
        })
      );

      // 3) Filtramos sólo los activos (cancelado === 0)
      setRecibos(completos.filter((r) => r.cancelado === 0));

      // 4) Clientes igual que antes
      const dataClientes = await getClientes();
      setClientes(dataClientes);
      setClientesFiltrados(dataClientes);
    } catch (err) {
      console.error("Error cargando recibos o clientes:", err);
    }
  };

  // Sincronizar con Supabase
  const checkSync = async () => {
    const net = await Network.getNetworkStateAsync();
    if (net.isConnected && net.isInternetReachable) {
      await syncRecibos();
    }
  };

  useEffect(() => {
    loadData();
    checkSync();
  }, []);

  useEffect(() => {
    if (modalClienteVisible) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [modalClienteVisible]);

  // Filtrar clientes en modal
  const filtrarClientes = (texto) => {
    setBuscarTextoC(texto);
    const filtrados = clientes.filter((c) =>
      c.nombre.toLowerCase().includes(texto.toLowerCase())
    );
    setClientesFiltrados(filtrados);
  };

  // Seleccionar cliente para filtro
  const seleccionarCliente = (c) => {
    setClienteFilter(c.nombre);
    setModalClienteVisible(false);
    setBuscarTextoC("");
    Keyboard.dismiss();
  };

  // Manejar cambio de fecha en picker
  const handleDateChange = (event, date) => {
    setModalFechaVisible(false);
    if (event.type === "set" && date) {
      const adj = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
      const iso = adj.toISOString().split("T")[0];
      setFechaFilter(iso);
      setSelectedDate(date);
    }
  };

  // Recibos filtrados por cliente y fecha
  const filtered = recibos.filter((r) => {
    const byCliente =
      !clienteFilter ||
      (r.cliente &&
        r.cliente.toLowerCase().includes(clienteFilter.toLowerCase()));
    const byFecha = !fechaFilter || (r.fecha && r.fecha.includes(fechaFilter));
    return byCliente && byFecha;
  });

  // Mostrar detalle de recibo
  const verRecibo = (r) => {
    navigation.navigate("ReciboPdfView", { recibo: r });
  };

  const handleCancelPress = useCallback(
    async (recibo) => {
      setLoading(true);
      try {
        await cancelarReciboYFactura(recibo.numero_recibo);
        await checkSync();
        
        // 3) Volvemos a cargar y filtrar los recibos en memoria
        await loadData();
        Alert.alert(
          "Exito",
          `✅ Recibo ${recibo.numero_recibo} cancelado con éxito.`
        );
      } catch (error) {
        console.log("Error al cancelar recibo: ", error);
        Alert.alert("Error", "No se pudo cancelar el recibo");
      } finally {
        setLoading(false);
      }
    },
    [cancelarReciboYFactura, loadData]
  );

  const handleLongPressRecibo = useCallback(
    (recibo) => {
      Alert.alert(
        "Acción",
        "¿Qué deseas hacer con esta factura?",
        [
          {
            text: "Cerrar",
            onPress: () => {}, // simplemente cierra el diálogo
            style: "cancel",
          },
          {
            text: "Ver Detalle",
            onPress: () => verRecibo(recibo),
            style: "default",
          },
          {
            text: "Cancelar Recibo",
            onPress: () => handleCancelPress(recibo),
            style: "destructive", // en iOS sale en rojo, en Android igual aparece como opción normal
          },
        ],
        { cancelable: true }
      );
    },
    [verRecibo, cancelarReciboYFactura]
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Pressable onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons
            name="keyboard-backspace"
            style={styles.iconTitle}
          />
        </Pressable>
        <Text style={styles.textTitle}>Consulta de Recibos</Text>
      </View>

      {/* Filtros */}
      <View style={styles.filtrosContainer}>
        <Pressable
          style={styles.filterButton}
          onPress={() => setModalClienteVisible(true)}
        >
          <Text style={styles.filterText}>
            {clienteFilter
              ? `Cliente: ${clienteFilter}`
              : "Filtrar por Cliente"}
          </Text>
        </Pressable>
        <Pressable
          style={styles.filterButton}
          onPress={() => setModalFechaVisible(true)}
        >
          <Text style={styles.filterText}>
            {fechaFilter ? `Fecha: ${fechaFilter}` : "Filtrar por Fecha"}
          </Text>
        </Pressable>
      </View>

      {/* Lista de Recibos */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Pressable
            style={styles.card}
            onPress={() => verRecibo(item)}
            onLongPress={() => handleLongPressRecibo(item)}
          >
            <View style={styles.row}>
              <Text style={styles.label}>Recibo:</Text>
              <Text style={styles.value}>{item.numero_recibo}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Cliente:</Text>
              <Text style={styles.value}>{item.cliente || "-"}</Text>
              <Text style={[styles.label, { marginLeft: 10 }]}>Monto:</Text>
              <Text style={styles.value}>${item.monto.toFixed(2)}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Fecha:</Text>
              <Text style={styles.value}>{item.fecha}</Text>
              <Text style={[styles.label, { marginLeft: 10 }]}>Factura:</Text>
              <Text style={styles.value}>{item.factura_id}</Text>
            </View>
          </Pressable>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No se encontraron recibos</Text>
        }
      />

      {/* Modal Cliente */}
      <Modal visible={modalClienteVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filtrar por Cliente</Text>
            <TextInput
              ref={inputRef}
              style={styles.inputBuscar}
              placeholder="Buscar cliente..."
              value={buscarTextoC}
              onChangeText={filtrarClientes}
            />
            <FlatList
              data={clientesFiltrados}
              keyExtractor={(c) => c.id.toString()}
              renderItem={({ item }) => (
                <Pressable
                  style={styles.itemCliente}
                  onPress={() => seleccionarCliente(item)}
                >
                  <Text style={styles.nombreCliente}>{item.nombre}</Text>
                </Pressable>
              )}
            />
            <Pressable
              style={styles.botonCerrar}
              onPress={() => setModalClienteVisible(false)}
            >
              <Text style={styles.textoBotonCerrar}>Cerrar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* DateTimePicker */}
      {modalFechaVisible && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}

      {/* Loading */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#0073c6" />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 10 },
  headerRow: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  iconTitle: { color: "#0073c6", fontSize: 28 },
  textTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0073c6",
    marginLeft: 10,
  },
  filtrosContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },
  filterButton: {
    flex: 1,
    backgroundColor: "#e0f0ff",
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 8,
    alignItems: "center",
  },
  filterText: { fontSize: 16, color: "#0073c6" },
  card: {
    backgroundColor: "#fff",
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#eee",
  },
  row: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  label: { fontSize: 16, fontWeight: "bold", color: "#0073c6", marginRight: 5 },
  value: { fontSize: 16, color: "#333" },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#999",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0073c6",
    marginBottom: 10,
  },
  inputBuscar: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  itemCliente: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  nombreCliente: { fontSize: 16, color: "#0073c6" },
  botonCerrar: {
    backgroundColor: "#0073c6",
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  textoBotonCerrar: { color: "#fff", fontWeight: "bold" },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.6)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
});

export default ConsultaRecibos;
