import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TextInput,
  Pressable,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import DateTimePicker from "@react-native-community/datetimepicker";

// Datos de ejemplo
const sampleInvoices = [
  {
    id: "F001",
    cliente: "Juan Pérez",
    telefono: "809-578-0929",
    direccion: "la rosa",
    monto: 150.75,
    fecha: "2024-03-10",
    condicion: "Crédito",
    productos: [
      { descripcion: "Bocina neodimio", cantidad: 2, precio: 32.8 },
      { descripcion: "Cable HDMI", cantidad: 1, precio: 15 },
    ],
  },
  {
    id: "F002",
    cliente: "María González",
    telefono: "809-578-0929",
    direccion: "la rosa",
    monto: 900.5,
    fecha: "2024-03-15",
    condicion: "Contado",
    productos: [{ descripcion: "Sueter XL Blanco", cantidad: 1, precio: 1000 }],
  },
  {
    id: "F003",
    cliente: "Carlos Ramírez",
    telefono: "809-578-0929",
    direccion: "la rosa",
    monto: 650.0,
    fecha: "2024-03-18",
    condicion: "Crédito",
    productos: [
      { descripcion: "Teclado mecánico RGB", cantidad: 1, precio: 850 },
    ],
  },
  {
    id: "F004",
    cliente: "Ana López",
    telefono: "809-578-0929",
    direccion: "la rosa",
    monto: 1320.0,
    fecha: "2024-03-20",
    condicion: "Contado",
    productos: [
      { descripcion: "Monitor LED 24 pulgadas", cantidad: 1, precio: 4200 },
    ],
  },
  {
    id: "F005",
    cliente: "Pedro Martínez",
    telefono: "809-578-0929",
    direccion: "la rosa",
    monto: 245.75,
    fecha: "2024-03-22",
    condicion: "Crédito",
    productos: [
      { descripcion: "Mouse inalámbrico", cantidad: 1, precio: 320.75 },
    ],
  },
  {
    id: "F006",
    cliente: "Laura Fernández",
    telefono: "809-578-0929",
    direccion: "la rosa",
    monto: 1180.0,
    fecha: "2024-03-25",
    condicion: "Contado",
    productos: [
      { descripcion: "Smartwatch Deportivo", cantidad: 1, precio: 1850 },
    ],
  },
  {
    id: "F007",
    cliente: "Ricardo Gómez",
    telefono: "809-578-0929",
    direccion: "la rosa",
    monto: 540.0,
    fecha: "2024-03-26",
    condicion: "Crédito",
    productos: [
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
    ],
  },
];

const ConsultaFacturas = ({ navigation }) => {
  // Estados para la lista principal de facturas
  const [invoices, setInvoices] = useState(sampleInvoices);
  const [clienteFilter, setClienteFilter] = useState("");
  const [fechaFilter, setFechaFilter] = useState("");
  const [modalClienteVisible, setModalClienteVisible] = useState(false);
  const [modalFechaVisible, setModalFechaVisible] = useState(false);

  // Estados para el filtro de clientes en el modal
  const [buscarTextoC, setBuscarTextoC] = useState("");
  const [clientesFiltrados, setClientesFiltrados] = useState(sampleInvoices);

  // Estado para la fecha seleccionada en el DateTimePicker
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Filtrado de las facturas en la lista principal
  const filteredInvoices = invoices.filter((inv) => {
    const matchCliente =
      clienteFilter.trim() === "" ||
      inv.cliente.toLowerCase().includes(clienteFilter.toLowerCase());
    const matchFecha =
      fechaFilter.trim() === "" || inv.fecha.includes(fechaFilter);
    return matchCliente && matchFecha;
  });

  // Función para filtrar clientes en el modal
  const filtrarClientes = (texto) => {
    setBuscarTextoC(texto);
    const filtrados = sampleInvoices.filter((cliente) =>
      cliente.cliente.toLowerCase().includes(texto.toLowerCase())
    );
    setClientesFiltrados(filtrados);
  };

  // Función para seleccionar un cliente desde el modal
  const seleccionarCliente = (clienteItem) => {
    setClienteFilter(clienteItem.cliente);
    setModalClienteVisible(false);
    setBuscarTextoC("");
    setClientesFiltrados(sampleInvoices);
  };

  // Función para actualizar la fecha seleccionada y el filtro,
  // y cerrar el modal automáticamente
  const handleDateChange = (event, date) => {
    if (event.type === "set" && date) {
      setSelectedDate(date);
      // Ajuste para compensar el timezone offset
      const adjustedDate = new Date(
        date.getTime() - date.getTimezoneOffset() * 60000
      );
      const formattedDate = adjustedDate.toISOString().split("T")[0];
      setFechaFilter(formattedDate);
      setModalFechaVisible(false);
    } else {
      // Si se cancela la selección, se cierra el modal
      setModalFechaVisible(false);
    }
  };

  // Función para ver detalles de la factura
  const verFactura = (invoice) => {
    navigation.navigate("FacturaPdfView", { invoice });
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

      {/* Lista de facturas */}
      <FlatList
        data={filteredInvoices}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable
            style={styles.invoiceCard}
            onPress={() => verFactura(item)}
          >
            <View style={styles.invoiceRow}>
              <Text style={styles.invoiceLabel}>Factura:</Text>
              <Text style={styles.invoiceValue}>{item.id}</Text>
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

      {/* Modal de filtro por cliente */}
      <Modal visible={modalClienteVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filtrar por Cliente</Text>
            <TextInput
              style={styles.inputBuscar}
              placeholder="Buscar cliente..."
              value={buscarTextoC}
              onChangeText={filtrarClientes}
            />
            <FlatList
              data={clientesFiltrados}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <Pressable
                  style={styles.itemCliente}
                  onPress={() => seleccionarCliente(item)}
                >
                  <Text style={styles.nombreCliente}>{item.cliente}</Text>
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

      {/* Modal de filtro por fecha */}
      <Modal visible={modalFechaVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filtrar por Fecha</Text>
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          </View>
        </View>
      </Modal>
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
  invoiceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
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
  btnModalCerrar: {
    backgroundColor: "#0073c6",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
    width: "100%",
  },
  btnModalText: { color: "#fff", fontWeight: "bold" },
});

export default ConsultaFacturas;
