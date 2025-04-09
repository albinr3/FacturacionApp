import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  Modal,
  Alert,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Network from "expo-network";

// Importa los métodos SQL y la sincronización con Supabase
import { getFacturas } from "../database/sqlMethods";
import { syncWithSupabase } from "../database/sync";
import { getDetalleFacturaByNumero } from "../database/sqlMethods";
import { getClientes } from "../database/sqlMethods";

const ConsultaFacturas = ({ navigation }) => {
  // Estado para la lista principal de facturas (cargadas de SQLite)
  const [invoices, setInvoices] = useState([]);
  // Estados de filtros
  const [clienteFilter, setClienteFilter] = useState("");
  const [fechaFilter, setFechaFilter] = useState("");

  // Estados para los modales de filtro
  const [modalClienteVisible, setModalClienteVisible] = useState(false);
  const [modalFechaVisible, setModalFechaVisible] = useState(false);

  // Estado para el TextInput del modal de clientes
  const [buscarTextoC, setBuscarTextoC] = useState("");
  const [clientesFiltrados, setClientesFiltrados] = useState([]);

  // Estado para la fecha seleccionada en el DateTimePicker
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Estado para el ActivityIndicator (operaciones en curso)
  const [loading, setLoading] = useState(false);

  // Ref para el TextInput de búsqueda en el modal (si se desea forzar el foco)
  const inputRef = useRef(null);

  // Función para cargar las facturas desde SQLite usando getFacturas
  const loadInvoices = async () => {
    try {
      const data = await getFacturas();
      setInvoices(data);
    } catch (err) {
      console.error("Error cargando facturas:", err);
    }
  };

  const loadClientes = async () => {
    try {
      const data = await getClientes();
      setClientesFiltrados(data);
    } catch (err) {
      console.error("Error cargando clientes:", err);
    }
  };

  useEffect(() => {
    if (modalClienteVisible) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [modalClienteVisible]);

  // Función para sincronizar con Supabase si hay conexión
  const checkSync = async () => {
    const net = await Network.getNetworkStateAsync();
    if (net.isConnected && net.isInternetReachable) {
      await syncWithSupabase();
      console.log("Si había internet");
    } else {
      console.log("⚠️ No se puede conectar a internet");
    }
  };

  useEffect(() => {
    loadInvoices();
    loadClientes(); // Para el listado completo de clientes (con datos completos)
    checkSync();
  }, []);

  // Filtrado de facturas en la lista principal según los filtros de cliente y fecha
  const filteredInvoices = invoices.filter((inv) => {
    const matchCliente =
      clienteFilter.trim() === "" ||
      (inv.cliente &&
        inv.cliente.toLowerCase().includes(clienteFilter.toLowerCase()));
    const matchFecha =
      fechaFilter.trim() === "" ||
      (inv.fecha && inv.fecha.includes(fechaFilter));
    return matchCliente && matchFecha;
  });

  // Función para filtrar clientes en el modal (tomando la propiedad "cliente" de cada factura)
  const filtrarClientes = (texto) => {
    setBuscarTextoC(texto);
    // Filtrar usando la propiedad "nombre"
    const filtrados = clientesFiltrados.filter(
      (cliente) =>
        cliente.nombre &&
        cliente.nombre.toLowerCase().includes(texto.toLowerCase())
    );
    setClientesFiltrados(filtrados);
  };

  // Función para seleccionar un cliente desde el modal de filtro
  const seleccionarCliente = (clienteItem) => {
    setClienteFilter(clienteItem.nombre);
    setModalClienteVisible(false);
    setBuscarTextoC("");
    Keyboard.dismiss();
  };

  // Función para actualizar la fecha seleccionada y usarla como filtro
  const handleDateChange = (event, date) => {
    if (event.type === "set" && date) {
      const adjustedDate = new Date(
        date.getTime() - date.getTimezoneOffset() * 60000
      );
      const formattedDate = adjustedDate.toISOString().split("T")[0];
      setFechaFilter(formattedDate);
      setSelectedDate(date);
    }
    setModalFechaVisible(false);
  };

  // Función para ver detalles de la factura (puedes navegar a otra pantalla)
  const verFactura = async (invoice) => {
    setLoading(true);
    try {
      // Se obtiene el detalle de la factura usando el número de factura
      const detalles = await getDetalleFacturaByNumero(invoice.numero_factura);
      // Se navega pasando tanto la factura como sus detalles
      navigation.navigate("FacturaPdfView", { invoice, detalles });
    } catch (error) {
      console.error("Error al cargar detalles de factura:", error);
      Alert.alert("Error", "No se pudo obtener el detalle de la factura");
    }
    setLoading(false);
  };

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
        <Text style={styles.textTitle}>Consulta de Facturas</Text>
      </View>

      {/* Sección de filtros */}
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

      {/* Lista de Facturas */}
      <FlatList
        data={filteredInvoices}
        keyExtractor={(item) => item.numero_factura.toString()}
        renderItem={({ item }) => (
          <Pressable
            style={styles.invoiceCard}
            onPress={() => verFactura(item)}
          >
            <View style={styles.invoiceRow}>
              <Text style={styles.invoiceLabel}>Factura:</Text>
              <Text style={styles.invoiceValue}>{item.numero_factura}</Text>
            </View>
            <View style={styles.invoiceRow}>
              <Text style={styles.invoiceLabel}>Cliente:</Text>
              <Text style={styles.invoiceValue}>{item.cliente} </Text>
              <Text style={styles.invoiceLabel}>Monto:</Text>
              <Text style={styles.invoiceValue}>${item.monto.toFixed(2)}</Text>
            </View>
            <View style={styles.invoiceRow}>
              <Text style={styles.invoiceLabel}>Fecha:</Text>
              <Text style={styles.invoiceValue}>{item.fecha}</Text>
              <Text style={[styles.invoiceLabel, { marginLeft: 10 }]}>
                Condición:
              </Text>
              <Text style={styles.invoiceValue}>{item.condicion}</Text>
            </View>
          </Pressable>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No se encontraron facturas</Text>
        }
      />

      {/* Modal de filtro por Cliente */}
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
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <Pressable
                  style={styles.itemCliente}
                  onPress={() => seleccionarCliente(item)}
                >
                  <Text style={styles.nombreCliente}>{item.nombre}</Text>
                  <Text style={styles.infoCliente}>
                    {item.telefono} - {item.direccion}
                  </Text>
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

      {/* Modal de filtro por Fecha */}
      {modalFechaVisible && (
  <DateTimePicker
    value={selectedDate}
    mode="date"
    display="default"
    onChange={handleDateChange}
  />
)}

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#0073c6" />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: "#fff" },
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
    marginBottom: 10,
    justifyContent: "space-around",
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
  invoiceCard: {
    backgroundColor: "#fff",
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#eee",
  },
  invoiceRow: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  invoiceLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0073c6",
    marginRight: 5,
  },
  invoiceValue: { fontSize: 16, color: "#333" },
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
    textAlign: "center",
  },
  inputBuscar: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    width: "100%",
  },
  itemCliente: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  nombreCliente: { fontSize: 16, fontWeight: "bold", color: "#0073c6" },
  infoCliente: { fontSize: 14, color: "#333" },
  botonCerrar: {
    backgroundColor: "#0073c6",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  textoBotonCerrar: { color: "#fff", fontWeight: "bold" },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255,255,255,0.6)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
  },
});

export default ConsultaFacturas;
