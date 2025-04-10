import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  Modal,
  Keyboard,
} from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Network from "expo-network";

// Se importan los métodos SQL en vez de usar datos estáticos
import { getClientes, getFacturas, updateFactura } from "../database/sqlMethods";
import { syncWithSupabase } from "../database/sync";

const CuentasPorCobrar = ({ navigation }) => {

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
  // Estados para el modal y búsqueda de clientes
  //
  //
  const [visible, setVisible] = useState(true);
  const [buscarTexto, setBuscarTexto] = useState("");
  // Estados para clientes (obtenidos de la base de datos) y el filtrado en el modal
  const [clientes, setClientes] = useState([]);
  const [clientesFiltrados, setClientesFiltrados] = useState([]);

  // El cliente actualmente seleccionado
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);

  // Facturas del cliente seleccionado, que se cargarán desde SQL
  const [facturasCliente, setFacturasCliente] = useState([]);

  // Estado para manejar la selección de facturas (checkbox)
  const [facturasSeleccionadas, setFacturasSeleccionadas] = useState({});

  // Función para cargar clientes desde SQLite mediante getClientes()
  const loadClientes = async () => {
    try {
      const data = await getClientes();
      setClientes(data);
      setClientesFiltrados(data);
    } catch (err) {
      console.error("Error cargando clientes:", err);
    }
  };

  // Función para filtrar clientes en tiempo real usando el texto ingresado
  //
  const filtrarClientes = (texto) => {
    setBuscarTexto(texto);
    const filtrados = clientes.filter((cliente) =>
      cliente.nombre.toLowerCase().includes(texto.toLowerCase())
    );
    setClientesFiltrados(filtrados);
  };

  // Al seleccionar un cliente desde el modal: // • Se guarda el cliente seleccionado
  // • Se cierra el modal
  // • Se reinicia el texto de búsqueda y la selección de facturas
  // • Se cargan las facturas asociadas al cliente usando getFacturas()
  const seleccionarCliente = async (cliente) => {
    setClienteSeleccionado(cliente);
    setVisible(false);
    setBuscarTexto("");
    setClientesFiltrados(clientes);
    setFacturasSeleccionadas({});
    Keyboard.dismiss();
    try {
      const allFacturas = await getFacturas();
      const facturasDelCliente = allFacturas.filter(
        (factura) =>
          factura.cliente_id === cliente.id &&
          factura.pagada == 0
      );

      setFacturasCliente(facturasDelCliente);
    } catch (err) {
      console.error("Error cargando facturas para el cliente:", err);
      setFacturasCliente([]);
    }
  };

  // Alterna la selección de una factura (usando el número de factura como clave)
  const toggleFactura = (numero_factura) => {
    setFacturasSeleccionadas({
      ...facturasSeleccionadas,
      [numero_factura]: !facturasSeleccionadas[numero_factura],
    });
  };

  // Calcula el total a cobrar sumando el monto de las facturas seleccionadas
  const totalCobrar =
    facturasCliente && facturasCliente.length > 0
      ? facturasCliente
          .filter((factura) => facturasSeleccionadas[factura.numero_factura])
          .reduce((acc, factura) => acc + factura.monto, 0)
      : 0;

  useEffect(() => {
    loadClientes();
  }, []);

  // Función para actualizar las facturas seleccionadas a "pagada"
const guardarPagos = async () => {
  // Recorremos las facturas del cliente y actualizamos las que están seleccionadas.
  try {
    for (const factura of facturasCliente) {
      // Si la factura fue seleccionada en el objeto facturasSeleccionadas
      if (facturasSeleccionadas[factura.numero_factura]) {
        // Llamamos a updateFactura pasando los datos existentes pero poniendo pagada = 1
        await updateFactura(
          factura.numero_factura,
          factura.monto,
          factura.fecha,
          factura.condicion,
          factura.cliente_id,
          1 // pagada en 1, es decir, true
        );
      }
    }
    alert('Éxito: Las facturas seleccionadas han sido marcadas como pagadas.');

    //Sincronizamos con supabase
    checkSync()
    // Actualizamos la lista de facturas pendientes filtrando nuevamente
    const allFacturas = await getFacturas();
    const facturasActualizadas = allFacturas.filter(
      (factura) =>
        factura.cliente_id === clienteSeleccionado.id && factura.pagada == 0
    );
    setFacturasCliente(facturasActualizadas);

  } catch (error) {
    console.error("Error al actualizar facturas:", error);
    alert("Error: No se pudo marcar las facturas como pagadas.");
  }
};


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
      {/* Buscador de Clientes (abre el modal al escribir o al tocar el ícono) */}
      <View style={styles.buscador}>
        <TextInput
          style={{ flex: 1 }}
          placeholder="Buscar Cliente"
          value={buscarTexto}
          onChangeText={(texto) => {
            setBuscarTexto(texto);
            setVisible(true);
            filtrarClientes(texto);
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
              value={buscarTexto}
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
              onPress={() => setVisible(false)}
            >
              <Text style={styles.textoBotonCerrar}>Cerrar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      {/* Lista de Facturas del Cliente Seleccionado */}
      <View style={styles.listaFacturas}>
        {clienteSeleccionado && facturasCliente.length > 0 ? (
          <>
            <Text style={styles.subtitulo}>Facturas Pendientes</Text>
            <FlatList
              data={facturasCliente}
              keyExtractor={(item) => item.numero_factura.toString()}
              renderItem={({ item }) => (
                <View style={styles.facturaContainer}>
                  <View>
                    {/* Fila de la factura */}
                    <View style={styles.facturaRow}>
                      <Text style={styles.facturaLabel}>Factura: </Text>
                      <Text style={styles.facturaInfo}>
                        {item.numero_factura}
                      </Text>
                    </View>
                    {/* Monto y Fecha */}
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
                    onPress={() => toggleFactura(item.numero_factura)}
                    style={styles.checkboxContainer}
                  >
                    <MaterialCommunityIcons
                      name={
                        facturasSeleccionadas[item.numero_factura]
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
        <Text style={styles.totalMonto}>
          $
          {totalCobrar.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </Text>
      </View>
      {/* Botón Guardar */}
      <Pressable style={styles.botonGuardar} onPress={()=>guardarPagos()}>
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
    justifyContent: "space-between",
  },
  iconTitle: { color: "#0073c6", fontSize: 28 },
  textTitle: { fontSize: 19, fontWeight: "bold" },
  header: { flexDirection: "row" },
  headerText: {
    flex: 1,
  },
  headerIcon: {
    padding: 10,
    borderRadius: 14,
    backgroundColor: "#0073c6",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  iconFac: { fontSize: 64, color: "white" },

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
  text: {
    fontSize: 16,
    flexShrink: 1,
    flexWrap: "wrap",
    textAlignVertical: "center",
  },
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
  facturaRow: { flexDirection: "row", alignItems: "center", marginBottom: 5 },
  checkboxContainer: {
    justifyContent: "center",
    alignItems: "flex-end",
    width: 50,
  },
  facturaInfo: { fontSize: 16, color: "#333" },
  facturaLabel: { fontSize: 16, fontWeight: "bold", color: "#0073c6" },
  facturaText: { fontSize: 16 },
  checkbox: { fontSize: 28, color: "#0073c6" },
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
