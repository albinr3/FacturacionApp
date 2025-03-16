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

const Facturacion = ({ navigation }) => {
  const [visible, setVisible] = useState(false); // Estado del modal
  const [visible2, setVisible2] = useState(false); // Estado del modal
  const [buscarTexto, setBuscarTexto] = useState("");
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [clientesFiltrados, setClientesFiltrados] = useState(clientes);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [productosFiltrados, setProductosFiltrados] = useState(productos);
  const [buscarTextoProducto, setBuscarTextoProducto] = useState("");

  // Lista de productos seleccionados
  const [productos, setProductos] = useState([
    {
      id: "1",
      sku: 2018,
      nombre: "Bocina neodimio",
      ref: "YR-2018",
      precio: 32.8,
      cantidad: 22,
    },
    {
      id: "2",
      sku: 2019,
      nombre: "Sueter XL Blanco",
      ref: "YR-0909",
      precio: 1000,
      cantidad: 15,
    },
    {
      id: "3",
      sku: 3011,
      nombre: "Bocina neodimio",
      ref: "YR-FA-437",
      precio: 32.8,
      cantidad: 22,
    },
    {
      id: "4",
      sku: 4213,
      nombre: "Sueter XL Blanco",
      ref: "YR-10",
      precio: 1000,
      cantidad: 15,
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

  const totalCantidad = productos.reduce((acc, prod) => acc + prod.cantidad, 0);

  const seleccionarCliente = (cliente) => {
    setClienteSeleccionado(cliente); // 🔹 Guarda el cliente seleccionado
    setVisible(false); // 🔹 Cierra el modal
    setBuscarTexto(""); // 🔹 Limpia el texto del buscador
    setClientesFiltrados(clientes); // 🔹 Restablece la lista completa de clientes
    Keyboard.dismiss(); // 🔹 Oculta el teclado y quita el foco del TextInput
  };

  // Función para filtrar clientes en el modal
  const filtrarClientes = (texto) => {
    setBuscarTexto(texto);

    // 🔹 Filtra la lista de clientes en tiempo real
    const filtrados = clientes.filter((cliente) =>
      cliente.nombre.toLowerCase().includes(texto.toLowerCase())
    );

    setClientesFiltrados(filtrados);
  };

  const seleccionarProducto = (producto) => {
    setProductoSeleccionado(producto); // 🔹 Guarda el cliente seleccionado
    setVisible2(false); // 🔹 Cierra el modal
    setBuscarTextoProducto(""); // 🔹 Limpia el texto del buscador
    setProductosFiltrados(productos); // 🔹 Restablece la lista completa de clientes
    Keyboard.dismiss(); // 🔹 Oculta el teclado y quita el foco del TextInput
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
          value={buscarTexto}
          onChangeText={(texto) => {
            setBuscarTexto(texto);
            setVisible(true); // 🔹 Solo abre el modal
            filtrarClientes(texto); // 🔹 Filtra directamente al escribir
          }}
        ></TextInput>
        <Pressable onPress={() => setVisible(true)} style={styles.buscadorIcon}>
          <Modal visible={visible} animationType="slide" transparent={true}>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                {/* 🔹 Aquí se busca a los clientes */}
                <TextInput
                  style={styles.inputBuscar}
                  placeholder="Buscar cliente..."
                  value={buscarTexto}
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
        <Pressable style={[styles.botones, { backgroundColor: "white" }]}>
          <MaterialCommunityIcons
            name="plus"
            style={styles.iconAdd}
          ></MaterialCommunityIcons>
          <Text style={[styles.textBotones, { color: "black" }]}>
            Selec. Producto
          </Text>

          <Modal visible={visible2} animationType="slide" transparent={true}>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                {/* 🔹 Aquí se busca a los clientes */}
                <TextInput
                  style={styles.inputBuscar}
                  placeholder="Buscar cliente..."
                  value={buscarTexto}
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
                  onPress={() => setVisible2(false)}
                >
                  <Text style={styles.textoBotonCerrar}>Cerrar</Text>
                </Pressable>
              </View>
            </View>
          </Modal>
        </Pressable>
        <Pressable style={styles.botones}>
          <MaterialCommunityIcons
            name="newspaper-variant-multiple"
            style={styles.iconResumen}
          ></MaterialCommunityIcons>
          <Text style={styles.textBotones}> Resumen</Text>
        </Pressable>
      </View>

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
          data={productos}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <View style={styles.row}>
              <Text style={[styles.cell, styles.cellNumero]}>{index + 1}</Text>
              <Text style={[styles.cell, styles.cellDescripcion]}>
                {item.nombre}
              </Text>
              <Text style={[styles.cell, styles.cellPrecio]}>
                {item.cantidad}
              </Text>
              <Text style={[styles.cell, styles.cellCantidad]}>
                ${item.precio.toFixed(2)}
              </Text>
            </View>
          )}
        />

        {/* Fila de Totales */}
        <View style={[styles.row, styles.totalRow]}>
          <Text style={[styles.cell, styles.cellNumero, styles.totalText]}>
            {productos.length}
          </Text>
          <Text style={[styles.cell, styles.cellDescripcion, styles.totalText]}>
            Total
          </Text>
          <Text style={[styles.cell, styles.cellCantidad, styles.totalText]}>
            {totalCantidad}
          </Text>
          <Text style={[styles.cell, styles.cellPrecio, styles.totalText]}>
            $2,065.10
          </Text>
        </View>
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
  },
  totalText: {
    fontWeight: "bold",
    color: "#0073c6",
  },

  cellNumero: { flex: 0.5, textAlign: "left" }, // Hace que la columna # sea más pequeña
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
  nombreCliente: {
    fontSize: 18,
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
  },
  textoBotonCerrar: {
    color: "white",
    fontWeight: "bold",
  },
});

export default Facturacion;
