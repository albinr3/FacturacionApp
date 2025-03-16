import React, { useState } from "react";
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
import { SafeAreaView } from "react-native-safe-area-context";
import { Keyboard } from "react-native";

// Importa Picker si lo usaras, pero aquí usamos checkboxes

// Lista de clientes de ejemplo, cada uno con facturas pendientes
const clientes = [
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
];

const CuentasPorCobrar = ({navigation}) => {
  // Estados para manejo del modal y búsqueda de clientes
  const [visible, setVisible] = useState(true);
  const [buscarTexto, setBuscarTexto] = useState("");
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [clientesFiltrados, setClientesFiltrados] = useState(clientes);

  // Estado para manejar cuáles facturas se han seleccionado para cobrar.
  // Usamos un objeto donde la clave es el número de factura y el valor es true/false.
  const [facturasSeleccionadas, setFacturasSeleccionadas] = useState({});

  // Función para filtrar clientes en el modal
  const filtrarClientes = (texto) => {
    setBuscarTexto(texto);

    // 🔹 Filtra la lista de clientes en tiempo real
    const filtrados = clientes.filter((cliente) =>
      cliente.nombre.toLowerCase().includes(texto.toLowerCase())
    );

    setClientesFiltrados(filtrados);
  };

  // Función para seleccionar un cliente y cerrar el modal
  const seleccionarCliente = (cliente) => {
    setClienteSeleccionado(cliente);
    setVisible(false);
    setBuscarTexto("");
    setClientesFiltrados(clientes);
    // Reinicia la selección de facturas al cambiar de cliente
    setFacturasSeleccionadas({});
    Keyboard.dismiss(); // 🔹 Oculta el teclado y quita el foco del TextInput
  };

  // Función para alternar la selección de una factura
  const toggleFactura = (numero) => {
    setFacturasSeleccionadas({
      ...facturasSeleccionadas,
      [numero]: !facturasSeleccionadas[numero],
    });
  };

  // Calcula el total a cobrar sumando el monto de las facturas seleccionadas
  const totalCobrar =
    clienteSeleccionado && clienteSeleccionado.facturas
      ? clienteSeleccionado.facturas
          .filter((factura) => facturasSeleccionadas[factura.numero])
          .reduce((acc, factura) => acc + factura.monto, 0)
      : 0;

  return (
    <SafeAreaView style={styles.container}>
      {/* Encabezado */}
      <View style={styles.headerConfig}>
        <Pressable onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons
            name="keyboard-backspace"
            style={styles.iconTitle}
          />
        </Pressable>

        <Text style={styles.textTitle}>CUENTAS POR COBRAR</Text>
        <MaterialCommunityIcons name="cash-multiple" style={styles.iconTitle} />
      </View>

      {/* Datos del Cliente */}
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <MaterialCommunityIcons
            name="account-circle"
            style={styles.iconFac}
          />
        </View>
        <View style={styles.headerText}>
          <View style={styles.textBox}>
            <View style={styles.itemTextbox}>
              <MaterialCommunityIcons name="account" style={styles.iconData} />
              <Text style={styles.text}>
                {clienteSeleccionado
                  ? clienteSeleccionado.nombre
                  : "Seleccione un Cliente"}
              </Text>
            </View>
            <View style={styles.itemTextbox}>
              <MaterialCommunityIcons name="phone" style={styles.iconData} />
              <Text style={styles.text}>
                {clienteSeleccionado ? clienteSeleccionado.telefono : "---"}
              </Text>
            </View>
            <View style={styles.itemTextbox}>
              <MaterialCommunityIcons name="store" style={styles.iconData} />
              <Text style={styles.text}>
                {clienteSeleccionado ? clienteSeleccionado.direccion : "---"}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Buscador de Clientes (abre el modal tanto al escribir como al tocar el ícono) */}
      <View style={styles.buscador}>
        <TextInput
          style={{ flex: 1 }}
          placeholder="Buscar Cliente"
          value={buscarTexto}
          onChangeText={(texto) => {
            setBuscarTexto(texto);
            setVisible(true); // 🔹 Abre el modal al escribir
            filtrarClientes(texto); // 🔹 Filtra directamente al escribir
          }}
        />

        <Pressable onPress={() => setVisible(true)} style={styles.buscadorIcon}>
          <MaterialCommunityIcons
            name="account-search-outline"
            style={styles.iconSearch}
          />
        </Pressable>
      </View>

      {/* Modal de Búsqueda de Clientes */}
      <Modal visible={visible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              style={styles.inputBuscar}
              placeholder="Buscar cliente..."
              value={buscarTexto} // 🔹 Mantiene sincronizado el texto con el buscador principal
              onChangeText={filtrarClientes} // 🔹 Filtra en tiempo real
            />

            <FlatList
              data={clientesFiltrados}
              keyExtractor={(item) => item.id}
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
              onPress={() => setVisible(false)}
            >
              <Text style={styles.textoBotonCerrar}>Cerrar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Lista de Facturas del Cliente Seleccionado */}
      <View style={styles.listaFacturas}>
        {clienteSeleccionado &&
        clienteSeleccionado.facturas &&
        clienteSeleccionado.facturas.length > 0 ? (
          <>
            <Text style={styles.subtitulo}>Facturas Pendientes</Text>
            <FlatList
              data={clienteSeleccionado?.facturas || []}
              keyExtractor={(item) => item.numero}
              renderItem={({ item }) => (
                <View style={styles.facturaContainer}>
                  <View>
                    {/* Primera fila: Factura */}
                    <View style={styles.facturaRow}>
                      <Text style={styles.facturaLabel}>Factura: </Text>
                      <Text style={styles.facturaInfo}>{item.numero}</Text>
                    </View>

                    {/* Segunda fila: Monto y Fecha */}
                    <View style={styles.facturaRow}>
                      <Text style={styles.facturaLabel}>Monto: </Text>
                      <Text style={styles.facturaInfo}>
                        ${item.monto.toFixed(2)}
                      </Text>

                      <Text style={[styles.facturaLabel, { marginLeft: 10 }]}>
                        Fecha:{" "}
                      </Text>
                      <Text style={styles.facturaInfo}>{item.fecha}</Text>
                    </View>
                  </View>

                  {/* Checkbox de selección */}
                  <Pressable
                    onPress={() => toggleFactura(item.numero)}
                    style={styles.checkboxContainer}
                  >
                    <MaterialCommunityIcons
                      name={
                        facturasSeleccionadas[item.numero]
                          ? "checkbox-marked-outline"
                          : "checkbox-blank-outline"
                      }
                      style={styles.checkbox}
                    />
                  </Pressable>
                </View>
              )}
            />
          </>
        ) : (
          <Text style={styles.subtitulo}>No hay facturas pendientes</Text>
        )}
      </View>

      {/* Cuadro Total a Cobrar */}
      <View style={styles.cuadroTotal}>
        <Text style={styles.totalTexto}>Total a Cobrar:</Text>
        <Text style={styles.totalMonto}>${totalCobrar.toFixed(2)}</Text>
      </View>

      {/* Botón Guardar */}
      <Pressable style={styles.botonGuardar}>
        <MaterialCommunityIcons
          name="content-save"
          style={styles.iconGuardar}
        />
        <Text style={styles.buttonText}>Guardar</Text>
      </Pressable>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 5, backgroundColor: "white" },
  headerConfig: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
    marginBottom: 14,
  },

  facturaContainer: {
    padding: 10,
    backgroundColor: "#fff",
    marginVertical: 5,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // 🔹 Separa la info y el checkbox
  },
  iconTitle: { color: "#0073c6", fontSize: 28 },
  textTitle: { fontSize: 19, fontWeight: "bold" },
  header: { flexDirection: "row" },
  headerIcon: {
    padding: 10,
    borderRadius: 14,
    backgroundColor: "#0073c6",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  iconFac: { fontSize: 64, color: "white" },
  headerText: {},
  textBox: {
    minHeight: 60,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 3.84,
    elevation: 5,
  },
  itemTextbox: { flexDirection: "row", alignItems: "center" },
  iconData: { color: "#0073c6", fontSize: 16, marginRight: 2 },
  text: { fontSize: 16, minWidth: 232, textAlignVertical: "center" },
  buscador: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 2,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 8,
  },
  buscadorIcon: {
    borderRadius: 60,
    backgroundColor: "#0073c6",
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    height: 40,
  },
  iconSearch: { fontSize: 30, color: "white" },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
  },
  inputBuscar: {
    width: "100%",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginBottom: 10,
  },
  itemCliente: {
    width: "100%",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  nombreCliente: { fontSize: 18, fontWeight: "bold" },
  infoCliente: { fontSize: 14, color: "#555" },
  botonCerrar: {
    backgroundColor: "#0073c6",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  textoBotonCerrar: { color: "white", fontWeight: "bold" },
  listaFacturas: { flex: 1, marginTop: 10 },
  subtitulo: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },

  facturaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5, // 🔹 Espacio entre filas
  },

  checkboxContainer: {
    justifyContent: "center", // 🔹 Centra el checkbox verticalmente
    alignItems: "flex-end", // 🔹 Lo coloca al final (derecha)
    width: 50, // 🔹 Define un ancho fijo para mantenerlo alineado
  },

  facturaInfo: {
    fontSize: 16,
    color: "#333",
  },
  facturaLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0073c6",
  },
  facturaText: { fontSize: 16 },
  checkbox: {
    fontSize: 28,
    color: "#0073c6",
  },
  cuadroTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f0f8ff",
    padding: 10,
    borderRadius: 10,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  totalTexto: { fontSize: 18, fontWeight: "bold", color: "#0073c6" },
  totalMonto: { fontSize: 18, fontWeight: "bold", color: "#0073c6" },
  botonGuardar: {
    backgroundColor: "#0073c6",
    paddingVertical: 12,
    paddingHorizontal: 30,
    position: "absolute",
    bottom: 62,
    alignSelf: "center",
    borderRadius: 30,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    flexDirection: "row",
    alignItems: "center",
  },
  iconGuardar: { fontSize: 24, color: "white" },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 2,
  },
});

export default CuentasPorCobrar;
