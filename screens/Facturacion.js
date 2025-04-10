import React, { useState, useRef, useEffect } from "react";
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
  KeyboardAvoidingView,
} from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ScreenOrientation from "expo-screen-orientation";
import * as Network from "expo-network";


// Importar métodos SQL y sincronización con Supabase
import {
  getClientes,
  getProductos,
  createFacturaConDetalles,
  updateProducto
} from "../database/sqlMethods";
import { syncWithSupabase } from "../database/sync";

const Facturacion = ({ navigation }) => {

  // 1. Creamos la referencia
  const inputRef = useRef(null);
  const [textoBusqueda, setTextoBusqueda] = useState("");

 

  // Estados para modales y búsqueda
  const [visible, setVisible] = useState(false); // Modal para seleccionar cliente
  const [visible2, setVisible2] = useState(false); // Modal para seleccionar producto
  const [visibleModalResumen, setVisibleModalResumen] = useState(false); // Modal de resumen
  const [buscarTextoC, setBuscarTextoC] = useState("");
  const [buscarTextoProducto, setBuscarTextoProducto] = useState("");


   // 2. Cuando `visible` sea true, forzamos el focus (con pequeño delay si hace falta)
   useEffect(() => {
    if (visible) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [visible]);

  // Estados para clientes y productos cargados desde SQLite
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);

  // Estados para listas filtradas
  const [clientesFiltrados, setClientesFiltrados] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);

  // Selección actual de cliente y productos
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [productosSeleccionados, setProductosSeleccionados] = useState([]);
  const [cantidadesProductos, setCantidadesProductos] = useState({});

  // Estado para ActivityIndicator
  const [loading, setLoading] = useState(false);

  // Función para cargar clientes desde SQLite
  const loadClientes = async () => {
    try {
      const data = await getClientes();
      setClientes(data);
      setClientesFiltrados(data);
    } catch (err) {
      console.error("Error cargando clientes:", err);
    }
  };

  // Función para cargar productos desde SQLite
  const loadProductos = async () => {
    try {
      const data = await getProductos();
      setProductos(data);
      setProductosFiltrados(data);
    } catch (err) {
      console.error("Error cargando productos:", err);
    }
  };

  // Función para verificar conectividad y sincronizar con Supabase
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
    loadClientes();
    loadProductos();
    checkSync();
  }, []);

  // Función para seleccionar un cliente en el modal
  const seleccionarCliente = (cliente) => {
    setClienteSeleccionado(cliente);
    setVisible(false);
    setBuscarTextoC("");
    setClientesFiltrados(clientes);
    Keyboard.dismiss();
  };

  // Función para filtrar clientes según búsqueda
  const filtrarClientes = (texto) => {
    setBuscarTextoC(texto);
    const filtrados = clientes.filter((cliente) =>
      cliente.nombre.toLowerCase().includes(texto.toLowerCase())
    );
    setClientesFiltrados(filtrados);
  };

  // Función para filtrar productos según búsqueda
  const filtrarProductos = (texto) => {
    setBuscarTextoProducto(texto);
    if (texto.trim() === "") {
      setProductosFiltrados(productos);
    } else {
      const filtrados = productos.filter((producto) =>
        producto.descripcion.toLowerCase().includes(texto.toLowerCase())
      );
      setProductosFiltrados(filtrados);
    }
  };

  // Función para actualizar la cantidad de un producto (usando sku como clave)
  const actualizarCantidadProducto = (sku, valor) => {
    const cantidad = parseInt(valor, 10) || 0;
    // Buscamos el producto por su sku en el array de productos
    const producto = productos.find(p => p.sku.toString() === sku.toString());
    
    if (producto && cantidad > producto.existencia) {
      Alert.alert(
        "Cantidad Excedida",
        "La cantidad ingresada supera la existencia disponible."
      );
      return;
    }
  
    setCantidadesProductos({
      ...cantidadesProductos,
      [sku]: cantidad,
    });
  };
  
  const incrementarCantidadProducto = (sku) => {
    const cantidadActual = cantidadesProductos[sku] || 0;
    // Buscamos el producto para verificar su existencia
    const producto = productos.find(p => p.sku.toString() === sku.toString());
  
    if (producto && (cantidadActual + 1 > producto.existencia)) {
      Alert.alert(
        "Cantidad Excedida",
        "No puedes seleccionar más que la existencia disponible."
      );
      return;
    }
  
    setCantidadesProductos({
      ...cantidadesProductos,
      [sku]: cantidadActual + 1,
    });
  };

  // Función para seleccionar productos (asignando la cantidad final)
  const handleSeleccionarProductos = () => {
    const productosConCantidades = Object.keys(cantidadesProductos)
      .map((sku) => {
        const productoOriginal = productos.find(
          (p) => p.sku.toString() === sku.toString()
        );
        if (!productoOriginal) return null;
        return {
          ...productoOriginal,
          cantidad: cantidadesProductos[sku],
        };
      })
      .filter(Boolean)
      .filter((prod) => prod.cantidad > 0);

    setProductosSeleccionados(productosConCantidades);
    setVisible2(false);
  };

  // Función para procesar y guardar la factura con la condición elegida
// Dentro de tu función processFactura, luego de crear la factura:
const processFactura = async (condicion) => {
  const pagada = condicion === "Contado" ? 1 : 0;
  setLoading(true);
  try {
    // Calcular el monto total
    const monto = productosSeleccionados.reduce(
      (acc, prod) => acc + prod.precio * prod.cantidad,
      0
    );
    // Obtener la fecha actual en formato YYYY-MM-DD
    const fecha = new Date();
    const fechaLocal = fecha.toLocaleDateString('en-CA');
    
    // Insertar la factura y sus detalles
    const numero_factura = await createFacturaConDetalles(
      monto,
      fechaLocal,
      condicion,
      clienteSeleccionado.id,
      productosSeleccionados,
      pagada
    );

    // Actualizar la existencia de cada producto facturado
    for (const producto of productosSeleccionados) {
      // Calcula la nueva existencia, asegurándote que no sea negativa.
      const nuevaExistencia = producto.existencia - producto.cantidad;
      
      // Actualizar el producto en la base de datos.
      // La función updateProducto recibe: sku, descripcion, referencia, precio, nueva existencia y proveedor_id
      await updateProducto(
        producto.sku,
        producto.descripcion,
        producto.referencia,
        producto.precio,
        nuevaExistencia >= 0 ? nuevaExistencia : 0,  // Evitamos números negativos
        producto.proveedor_id
      );
    }

    // Sincronización (si tenés lógica de sincronización)
    await syncWithSupabase();

    Alert.alert(
      "Éxito",
      "Factura guardada correctamente. Factura N°: " + numero_factura
    );

    // Reiniciamos los estados pertinentes
    setClienteSeleccionado(null);
    setProductosSeleccionados([]);
    setCantidadesProductos({});
  } catch (error) {
    console.error("Error al guardar factura:", error);
    Alert.alert("Error", "No se pudo guardar la factura");
  }
  setLoading(false);
};


  // Función para guardar la factura, solicitando primero la condición
  const guardarFactura = () => {
    if (!clienteSeleccionado) {
      Alert.alert("Error", "Debe seleccionar un cliente");
      return;
    }
    if (productosSeleccionados.length === 0) {
      Alert.alert("Error", "Debe seleccionar al menos un producto");
      return;
    }
    // Mostrar un diálogo para escoger la condición de pago
    Alert.alert(
      "Condición de Pago",
      "¿Desea que la factura sea a contado o a crédito?",
      [
        { text: "Contado", onPress: () => processFactura("Contado") },
        { text: "Crédito", onPress: () => processFactura("Credito") },
        { text: "Cancelar", style: "cancel" },

      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Encabezado de Facturación */}
      <View style={styles.headerConfig}>
        <Pressable onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons
            name="keyboard-backspace"
            style={styles.iconTitle}
          />
        </Pressable>
        <Text style={styles.textTitle}>FACTURACION</Text>
        <MaterialCommunityIcons
          name="snowflake-variant"
          style={styles.iconTitle}
        />
      </View>
      {/* Información del Cliente Seleccionado */}
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <MaterialCommunityIcons
            name="script-text-outline"
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
      {/* Buscador de Clientes */}
      <View style={styles.buscador}>
        <Pressable onPress={() => setVisible(true)} style={{width:"85%"}}>
          <TextInput
            editable={false}
            placeholder="Buscar Cliente"
            style={{ flex: 1 }}
            value={buscarTextoC}
            onChangeText={(texto) => {
              setBuscarTextoC(texto);
              setVisible(true);
              setClientesFiltrados(clientes);
              filtrarClientes(texto);
            }}
          />
        </Pressable>

        <Pressable
          onPress={() => {
            setVisible(true);
            setClientesFiltrados(clientes);
          }}
          style={styles.buscadorIcon}
        >
          <MaterialCommunityIcons
            name="account-search-outline"
            style={styles.iconSearch}
          />
        </Pressable>

        {/* Modal Clientes */}
        <Modal visible={visible} animationType="slide" transparent={true}>
          <View
            style={styles.modalContainer}
           
          >
            <View style={styles.modalContent}>
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
                    {item.direccion} - {item.telefono}
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
      </View>
      {/* Botón para seleccionar productos */}
      <View style={styles.viewBotones}>
        <Pressable
          onPress={() => {
            setVisible2(true);
            setBuscarTextoProducto("");
            setProductosFiltrados(productos);
          }}
          style={[styles.botones, { backgroundColor: "white" }]}
        >
          <MaterialCommunityIcons name="plus" style={styles.iconAdd} />
          <Text style={[styles.textBotones, { color: "black" }]}>
            Selec. Producto
          </Text>

          {/* Modal de selección de productos */}
          <Modal visible={visible2} animationType="slide" transparent={true}>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent2}>
                <View style={styles.searchContainer}>
                  <TextInput
                    style={styles.inputBuscar2}
                    placeholder="Buscar producto..."
                    value={buscarTextoProducto}
                    onChangeText={filtrarProductos}
                  />
                </View>
                <FlatList
                  removeClippedSubviews={false}
                  data={productosFiltrados}
                  keyExtractor={(item) => item.sku.toString()}
                  renderItem={({ item }) => {
                    const cantidad = cantidadesProductos[item.sku] || 0;
                    return (
                      <View style={styles.itemRow}>
                        <View style={{ flex: 3 }}>
                          <Text
                            style={[styles.nombreCliente, { fontSize: 14 }]}
                          >
                            ({item.sku}) {item.descripcion}
                          </Text>
                          <Text style={[styles.infoCliente, { fontSize: 12 }]}>
                            REF: {item.referencia} Precio: ${item.precio}{" "}
                            Exist.: {item.existencia}
                          </Text>
                        </View>
                        <View style={styles.itemQuantity}>
                          <TextInput
                            style={styles.quantityInput}
                            keyboardType="numeric"
                            value={String(cantidadesProductos[item.sku] || 0)}
                            onChangeText={(text) =>
                              actualizarCantidadProducto(item.sku, text)
                            }
                          />
                          <Pressable
                            onPress={() =>
                              incrementarCantidadProducto(item.sku)
                            }
                            style={styles.plusButton}
                          >
                            <MaterialCommunityIcons
                              name="plus"
                              size={20}
                              color="#0073c6"
                            />
                          </Pressable>
                        </View>
                      </View>
                    );
                  }}
                  style={{ flex: 1 }}
                />
                <Pressable
                  style={styles.botonCerrar}
                  onPress={handleSeleccionarProductos}
                >
                  <Text style={styles.textoBotonCerrar}>Seleccionar</Text>
                </Pressable>
              </View>
            </View>
          </Modal>
        </Pressable>
        <Pressable
          style={styles.botones}
          onPress={async () => {
            await ScreenOrientation.lockAsync(
              ScreenOrientation.OrientationLock.LANDSCAPE
            );
            setVisibleModalResumen(true);
          }}
        >
          <MaterialCommunityIcons
            name="newspaper-variant-multiple"
            style={styles.iconResumen}
          />
          <Text style={styles.textBotones}> Resumen</Text>

          <Modal
            animationType="slide"
            visible={visibleModalResumen}
            onRequestClose={() => setVisible(false)}
          >
            <View style={styles.headerConfig}>
              <Pressable
                onPress={async () => {
                  await ScreenOrientation.lockAsync(
                    ScreenOrientation.OrientationLock.PORTRAIT
                  );
                  setVisibleModalResumen(false);
                }}
              >
                <MaterialCommunityIcons
                  name="keyboard-backspace"
                  style={styles.iconTitle}
                />
              </Pressable>
              <Text style={styles.textTitle}>RESUMEN</Text>
              <MaterialCommunityIcons
                name="snowflake-variant"
                style={styles.iconTitle}
              />
            </View>
            <View style={[styles.grid, { marginTop: 5 }]}>
              <View style={styles.headerRow}>
                <Text
                  style={[styles.cell, styles.cellNumero, styles.headerText]}
                >
                  SKU
                </Text>
                <Text
                  style={[
                    styles.cell,
                    styles.cellDescripcion,
                    styles.headerText,
                  ]}
                >
                  Descripción
                </Text>
                <Text
                  style={[
                    styles.cell,
                    styles.cellReferencia,
                    styles.headerText,
                  ]}
                >
                  Referencia
                </Text>
                <Text
                  style={[styles.cell, styles.cellCantidad, styles.headerText]}
                >
                  Cantidad
                </Text>
                <Text
                  style={[styles.cell, styles.cellPrecio, styles.headerText]}
                >
                  Precio
                </Text>
                <Text
                  style={[styles.cell, styles.cellPrecio, styles.headerText]}
                >
                  Subtotal
                </Text>
              </View>
              <FlatList
                data={productosSeleccionados}
                keyExtractor={(item) => item.sku.toString()}
                renderItem={({ item, index }) => (
                  <View style={styles.row}>
                    <Text style={[styles.cell, styles.cellNumero]}>
                      {item.sku}
                    </Text>
                    <Text style={[styles.cell, styles.cellDescripcion]}>
                      {item.descripcion}
                    </Text>
                    <Text style={[styles.cell, styles.cellReferencia]}>
                      {item.referencia}
                    </Text>
                    <Text style={[styles.cell, styles.cellPrecio]}>
                      {item.cantidad}
                    </Text>
                    <Text style={[styles.cell, styles.cellCantidad]}>
                      ${item.precio.toFixed(2)}
                    </Text>
                    <Text style={[styles.cell, styles.cellCantidad]}>
                      ${(item.precio * item.cantidad).toFixed(2)}
                    </Text>
                  </View>
                )}
                ListFooterComponent={
                  <View style={[styles.row, styles.totalRow]}>
                    <Text
                      style={[styles.cell, styles.cellNumero, styles.totalText]}
                    >
                      {productosSeleccionados.length}
                    </Text>
                    <Text
                      style={[
                        styles.cell,
                        styles.cellDescripcion,
                        styles.totalText,
                      ]}
                    >
                      Total
                    </Text>
                    <Text
                      style={[
                        styles.cell,
                        styles.cellReferencia,
                        styles.totalText,
                      ]}
                    >
                      {/* Vacío */}
                    </Text>
                    <Text
                      style={[
                        styles.cell,
                        styles.cellCantidad,
                        styles.totalText,
                      ]}
                    >
                      {productosSeleccionados.reduce(
                        (acc, prod) => acc + prod.cantidad,
                        0
                      )}
                    </Text>
                    <Text
                      style={[
                        styles.cell,
                        styles.cellCantidad,
                        styles.totalText,
                      ]}
                    >
                      {/* Vacío */}
                    </Text>
                    <Text
                      style={[styles.cell, styles.cellPrecio, styles.totalText]}
                    >
                      {"$" +
                        productosSeleccionados
                          .reduce(
                            (acc, prod) => acc + prod.cantidad * prod.precio,
                            0
                          )
                          .toFixed(2)}
                    </Text>
                  </View>
                }
              />
            </View>
          </Modal>
        </Pressable>
      </View>
      {/* Grid de productos seleccionados para la factura */}
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
        <FlatList
          data={productosSeleccionados}
          keyExtractor={(item) => item.sku.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.row}>
              <Text style={[styles.cell, styles.cellNumero]}>{index + 1}</Text>
              <Text style={[styles.cell, styles.cellDescripcion]}>
                {item.descripcion}
              </Text>
              <Text style={[styles.cell, styles.cellPrecio]}>
                {item.cantidad}
              </Text>
              <Text style={[styles.cell, styles.cellCantidad]}>
                ${item.precio.toFixed(2)}
              </Text>
            </View>
          )}
          ListFooterComponent={
            <View style={[styles.row, styles.totalRow]}>
              <Text style={[styles.cell, styles.cellNumero, styles.totalText]}>
                {productosSeleccionados.length}
              </Text>
              <Text
                style={[styles.cell, styles.cellDescripcion, styles.totalText]}
              >
                Total
              </Text>
              <Text
                style={[styles.cell, styles.cellCantidad, styles.totalText]}
              >
                {productosSeleccionados.reduce(
                  (acc, prod) => acc + prod.cantidad,
                  0
                )}
              </Text>
              <Text style={[styles.cell, styles.cellPrecio, styles.totalText]}>
                {"$" +
                  productosSeleccionados
                    .reduce((acc, prod) => acc + prod.cantidad * prod.precio, 0)
                    .toFixed(2)}
              </Text>
            </View>
          }
        />
      </View>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#0073c6" />
        </View>
      )}

      <Pressable style={styles.botonGuardar} onPress={() => guardarFactura()}>
        <MaterialCommunityIcons
          name="content-save"
          style={styles.iconResumen}
        />
        <Text style={styles.buttonText}>Guardar</Text>
      </Pressable>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 5, backgroundColor: "white" },
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
  headerText: { flex: 1},
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
  textTitle: { fontSize: 19, fontWeight: "bold" },
  iconSearch: { fontSize: 30, color: "white" },
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
    paddingVertical: 10,
    paddingHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 9,
    flexDirection: "row",
  },
  textBotones: { color: "white", fontWeight: "600" },
  iconAdd: { color: "#0073c6", fontSize: 20, fontWeight: "bold" },
  iconResumen: { color: "white", fontSize: 20, fontWeight: "bold" },
  grid: {
    marginTop: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 3,
    padding: 5,
    flex: 1,
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
  cell: { flex: 1, textAlign: "center", fontSize: 16 },
  totalRow: { backgroundColor: "#f1f1f1", paddingVertical: 8, marginTop: 6 },
  totalText: { fontWeight: "bold", color: "#0073c6" },
  cellNumero: { flex: 0.5, textAlign: "left", color: "gray" },
  cellDescripcion: { flex: 2, textAlign: "left" },
  cellReferencia: { flex: 1.5, textAlign: "left" },
  cellCantidad: { flex: 1, textAlign: "center" },
  cellPrecio: { flex: 1, textAlign: "center" },
  headerConfig: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
    marginBottom: 14,
  },
  iconTitle: { color: "#0073c6", fontSize: 28 },
  botonGuardar: {
    backgroundColor: "#0073c6",
    paddingVertical: 12,
    paddingHorizontal: 30,
    position: "absolute",
    bottom: 20,
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
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 2,
  },
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
  modalContent2: {
    width: "90%",
    height: "90%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
  },
  searchContainer: {
    height: 50,
    justifyContent: "center",
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  inputBuscar: {
    width: "100%",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginBottom: 10,
  },
  inputBuscar2: { width: "100%", height: "100%", fontSize: 16 },
  itemCliente: {
    width: "100%",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  nombreCliente: { fontSize: 16, fontWeight: "bold" },
  infoCliente: { fontSize: 14, color: "#555" },
  botonCerrar: {
    backgroundColor: "#0073c6",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: "center",
  },
  textoBotonCerrar: { color: "white", fontWeight: "bold" },
  itemQuantity: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  quantityInput: {
    width: 30,
    height: 30,
    borderWidth: 1,
    borderColor: "#ccc",
    textAlign: "center",
    borderRadius: 4,
    marginRight: 4,
    paddingVertical: 0,
  },
  plusButton: {
    padding: 4,
    borderWidth: 1,
    borderColor: "#0073c6",
    borderRadius: 4,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    justifyContent: "space-between",
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255,255,255,0.6)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999, // Se asegura que se muestre sobre todo
  },
});

export default Facturacion;
