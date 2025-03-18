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
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Keyboard } from "react-native";
import * as ScreenOrientation from 'expo-screen-orientation';


const Facturacion = ({ navigation }) => {
  const [visible, setVisible] = useState(false); // Estado del modal
  const [visible2, setVisible2] = useState(false); // Estado del modal
  const [visible3, setVisible3] = useState(false); // Estado del modal
  const [buscarTextoC, setBuscarTextoC] = useState("");
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [clientesFiltrados, setClientesFiltrados] = useState(clientes);
  const [productosFiltrados, setProductosFiltrados] = useState(productos);
  const [buscarTextoProducto, setBuscarTextoProducto] = useState("");
  const [productosSeleccionados, setProductosSeleccionados] = useState([]);

  const [cantidadesProductos, setCantidadesProductos] = useState({});

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
      descripcion: "Teclado y Mouse Inalámbrico",
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

  const clientes = [
    {
      id: "1",
      nombre: "Juan Pérez",
      telefono: "809-555-1234",
      direccion: "Calle 10, Santo Domingo",
    },
    {
      id: "2",
      nombre: "María González",
      telefono: "829-888-5678",
      direccion: "Av. Principal, Santiago",
    },
    {
      id: "3",
      nombre: "Carlos Ramírez",
      telefono: "849-777-9123",
      direccion: "Calle B, La Vega",
    },
    {
      id: "4",
      nombre: "Ana López",
      telefono: "809-333-4567",
      direccion: "Calle C, San Cristóbal",
    },
    {
      id: "5",
      nombre: "Pedro Martínez",
      telefono: "829-222-7890",
      direccion: "Av. Duarte, Puerto Plata",
    },
  ];

  const seleccionarCliente = (cliente) => {
    setClienteSeleccionado(cliente); // 🔹 Guarda el cliente seleccionado
    setVisible(false); // 🔹 Cierra el modal
    setBuscarTextoC(""); // 🔹 Limpia el texto del buscador
    setClientesFiltrados(clientes); // 🔹 Restablece la lista completa de clientes
    Keyboard.dismiss(); // 🔹 Oculta el teclado y quita el foco del TextInput
  };

  // Función para filtrar clientes en el modal
  const filtrarClientes = (texto) => {
    setBuscarTextoC(texto);

    // 🔹 Filtra la lista de clientes en tiempo real
    const filtrados = clientes.filter((cliente) =>
      cliente.nombre.toLowerCase().includes(texto.toLowerCase())
    );

    setClientesFiltrados(filtrados);
  };

  // Función para filtrar productos en el modal
  const filtrarProductos = (texto) => {
    setBuscarTextoProducto(texto);
    if (texto.trim() === "") {
      // Si el texto está vacío, mostramos todos los productos
      setProductosFiltrados(productos);
    } else {
      // Filtramos los productos según el texto ingresado
      const filtrados = productos.filter((producto) =>
        producto.descripcion.toLowerCase().includes(texto.toLowerCase())
      );
      setProductosFiltrados(filtrados);
    }
  };

  // Función para actualizar la cantidad de un producto manualmente
  const actualizarCantidadProducto = (id, valor) => {
    // Convertimos el valor a número (si es posible)
    const cantidad = parseInt(valor, 10) || 0;
    setCantidadesProductos({
      ...cantidadesProductos,
      [id]: cantidad,
    });
  };

  // Función para incrementar la cantidad en 1
  const incrementarCantidadProducto = (id) => {
    setCantidadesProductos({
      ...cantidadesProductos,
      [id]: (cantidadesProductos[id] || 0) + 1,
    });
  };

  const handleSeleccionarProductos = () => {
    // 1) Recorremos el diccionario (cantidadesProductos),
    // 2) localizamos cada producto original en "productos"
    // 3) copiamos sus datos pero con la cantidad final
    // 4) filtramos solo los que tengan cantidad > 0

    const productosConCantidades = Object.keys(cantidadesProductos)
      .map((id) => {
        // Buscamos el producto en el array principal
        const productoOriginal = productos.find(
          (p) => p.id.toString() === id.toString()
        );

        if (!productoOriginal) return null;

        return {
          ...productoOriginal,
          cantidad: cantidadesProductos[id], // Ajustamos la cantidad
        };
      })
      .filter(Boolean) // eliminamos los null
      .filter((prod) => prod.cantidad > 0); // solo los que tengan cantidad > 0

    // Actualizamos el estado de productosSeleccionados
    setProductosSeleccionados(productosConCantidades);

    // Cerramos el modal
    setVisible2(false);
  };

  return (
    <SafeAreaView style={styles.container}>
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
        ></MaterialCommunityIcons>
      </View>

      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <MaterialCommunityIcons
            name="script-text-outline"
            style={styles.iconFac}
          ></MaterialCommunityIcons>
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
      <View style={styles.buscador}>
        <TextInput
          editable
          placeholder="Buscar Cliente"
          style={{ flex: 1 }}
          value={buscarTextoC}
          onChangeText={(texto) => {
            setBuscarTextoC(texto);
            setVisible(true); // 🔹 Solo abre el modal
            setClientesFiltrados(clientes);
            filtrarClientes(texto); // 🔹 Filtra directamente al escribir
          }}
        ></TextInput>
        <Pressable
          onPress={() => {
            setVisible(true);
            setClientesFiltrados(clientes);
          }}
          style={styles.buscadorIcon}
        >
          {/* modal clientes */}
          <Modal visible={visible} animationType="slide" transparent={true}>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                {/* 🔹 Aquí se busca a los clientes */}
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

          <MaterialCommunityIcons
            name="account-search-outline"
            style={styles.iconSearch}
          ></MaterialCommunityIcons>
        </Pressable>
      </View>
      <View style={styles.viewBotones}>
        <Pressable
          onPress={() => {
            setVisible2(true);
            setBuscarTextoProducto(""); // Limpia el texto de búsqueda
            setProductosFiltrados(productos); // Restaura la lista completa}
          }}
          style={[styles.botones, { backgroundColor: "white" }]}
        >
          <MaterialCommunityIcons
            name="plus"
            style={styles.iconAdd}
          ></MaterialCommunityIcons>
          <Text style={[styles.textBotones, { color: "black" }]}>
            Selec. Producto
          </Text>

          <Modal visible={visible2} animationType="slide" transparent={true}>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent2}>
                {/* Barra de búsqueda fija */}
                <View style={styles.searchContainer}>
                  <TextInput
                    style={styles.inputBuscar2}
                    placeholder="Buscar producto..."
                    value={buscarTextoProducto}
                    onChangeText={filtrarProductos}
                  />
                </View>
                {/* FlatList para los productos */}
                <FlatList
                  removeClippedSubviews={false}
                  data={productosFiltrados}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => {
                    const cantidad = cantidadesProductos[item.id] || 0;

                    return (
                      <View style={styles.itemRow}>
                        <View style={{ flex: 3 }}>
                          <Text
                            style={[styles.nombreCliente, { fontSize: 14 }]}
                          >
                            ({item.sku}) {item.descripcion}
                          </Text>
                          <Text style={[styles.infoCliente, { fontSize: 12 }]}>
                            REF: {item.ref} Precio: ${item.precio} Exist.:{" "}
                            {item.existencia}
                          </Text>
                        </View>
                        <View style={styles.itemQuantity}>
                          <TextInput
                            style={styles.quantityInput}
                            keyboardType="numeric"
                            value={String(cantidad)}
                            onChangeText={(text) =>
                              actualizarCantidadProducto(item.id, text)
                            }
                          />
                          <Pressable
                            onPress={() => incrementarCantidadProducto(item.id)}
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
            
            await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE); // 🔹 Cambia a horizontal
            setVisible3(true);
          }}
        >
          <MaterialCommunityIcons
            name="newspaper-variant-multiple"
            style={styles.iconResumen}
          ></MaterialCommunityIcons>
          <Text style={styles.textBotones}> Resumen</Text>

          <Modal animationType="slide" visible={visible3}>
            <View style={styles.grid}>
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
                    styles.cellDescripcion,
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

              {/* Lista de productos */}
              <FlatList
                data={productosSeleccionados}
                keyExtractor={(item) => item.id}
                renderItem={({ item, index }) => (
                  <View style={styles.row}>
                    <Text style={[styles.cell, styles.cellNumero]}>
                      {index + 1}
                    </Text>
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
                // Fila de Totales
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
                        styles.cellCantidad,
                        styles.totalText,
                      ]}
                    >
                      {
                        // Suma total de cantidades
                        productosSeleccionados.reduce(
                          (acc, prod) => acc + prod.cantidad,
                          0
                        )
                      }
                    </Text>
                    <Text
                      style={[styles.cell, styles.cellPrecio, styles.totalText]}
                    >
                      {
                        // Suma total de precios (cantidad * precio)
                        "$" +
                          productosSeleccionados
                            .reduce(
                              (acc, prod) => acc + prod.cantidad * prod.precio,
                              0
                            )
                            .toFixed(2)
                      }
                    </Text>
                  </View>
                }
              />
            </View>
          </Modal>
        </Pressable>
      </View>

      {/* Grid de productos */}
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

        {/* Lista de productos */}
        <FlatList
          data={productosSeleccionados}
          keyExtractor={(item) => item.id}
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
          // Fila de Totales
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
                {
                  // Suma total de cantidades
                  productosSeleccionados.reduce(
                    (acc, prod) => acc + prod.cantidad,
                    0
                  )
                }
              </Text>
              <Text style={[styles.cell, styles.cellPrecio, styles.totalText]}>
                {
                  // Suma total de precios (cantidad * precio)
                  "$" +
                    productosSeleccionados
                      .reduce(
                        (acc, prod) => acc + prod.cantidad * prod.precio,
                        0
                      )
                      .toFixed(2)
                }
              </Text>
            </View>
          }
        />
      </View>

      <Pressable style={styles.botonGuardar}>
        <MaterialCommunityIcons
          name="content-save"
          style={styles.iconResumen}
        ></MaterialCommunityIcons>
        <Text style={styles.buttonText}>Guardar</Text>
      </Pressable>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
  },
  headerIcon: {
    padding: 10,
    borderRadius: 14,
    backgroundColor: "#0073c6",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  iconFac: {
    fontSize: 64,
    color: "white",
  },
  headerText: {},
  textBox: {
    minHeight: 60, // 🔹 Mantiene el tamaño mínimo del TextBox
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    justifyContent: "center", // 🔹 Centra el contenido verticalmente
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 3.84,
    elevation: 5,
  },
  itemTextbox: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconData: {
    color: "#0073c6",
    fontSize: 16,
    marginRight: 2,
  },
  text: {
    fontSize: 16,
    minWidth: 232, // 🔹 Evita que el TextBox se haga muy pequeño en textos cortos
    textAlignVertical: "center", // 🔹 Asegura alineación correcta
  },
  textTitle: {
    fontSize: 19,
    fontWeight: "bold",
  },
  iconSearch: {
    fontSize: 30,
    color: "white",
  },
  buscador: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 2,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 10,
    backgroundColor: "#fff", // 🔹 Necesario para que la sombra se vea en iOS
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3, // 🔹 Aumenta la altura para que la sombra sea más visible
    },
    shadowOpacity: 0.4, // 🔹 Reduce la opacidad para que no sea tan fuerte
    shadowRadius: 4, // 🔹 Ajusta el radio de la sombra
    elevation: 8, // 🔹 Para Android
  },

  buscadorIcon: {
    borderRadius: 60,
    backgroundColor: "#0073c6",
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center",
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
    alignContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,

    elevation: 9,
    flexDirection: "row",
  },
  textBotones: {
    color: "white",
    fontWeight: "600",
  },
  iconAdd: {
    color: "#0073c6",
    fontSize: 20,
    fontWeight: "bold",
  },
  iconResumen: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
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
  cell: {
    flex: 1,
    textAlign: "center",
    fontSize: 16,
  },
  headerText: {
    color: "#fff",
    fontWeight: "bold",
  },
  totalRow: {
    backgroundColor: "#f1f1f1",
    paddingVertical: 8,
    marginTop: 6,
  },
  totalText: {
    fontWeight: "bold",
    color: "#0073c6",
  },

  cellNumero: { flex: 0.5, textAlign: "left", color: "gray" }, // Hace que la columna # sea más pequeña
  cellDescripcion: { flex: 2, textAlign: "left" }, // Más espacio para la descripción
  cellCantidad: { flex: 1, textAlign: "center" }, // Tamaño normal para Cantidad
  cellPrecio: { flex: 1, textAlign: "center" }, // Tamaño normal para Precio
  headerConfig: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
    marginBottom: 14,
  },
  iconTitle: {
    color: "#0073c6",
    fontSize: 28,
  },
  botonGuardar: {
    borderRadius: 1,
    backgroundColor: "#0073c6",
    paddingVertical: 12,
    paddingHorizontal: 30,
    position: "absolute",
    bottom: 20,
    alignSelf: "center", // 🔹 Centrar el botón horizontalmente
    borderRadius: 30,
    elevation: 3, // Sombra en Android
    shadowColor: "#000", // Sombra en iOS
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
    // Fija la altura de la barra de búsqueda
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
  inputBuscar2: {
    width: "100%",
    height: "100%",
    fontSize: 16,
  },
  itemCliente: {
    width: "100%",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  nombreCliente: {
    fontSize: 16,
    fontWeight: "bold",
  },
  infoCliente: {
    fontSize: 14,
    color: "#555",
  },
  botonCerrar: {
    backgroundColor: "#0073c6",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: "center",
  },
  textoBotonCerrar: {
    color: "white",
    fontWeight: "bold",
  },
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
    paddingVertical: 0, // Puedes ajustar el padding según convenga
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
});

export default Facturacion;
