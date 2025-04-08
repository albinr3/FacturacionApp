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
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import * as Network from "expo-network";

// Importar métodos SQL y sincronización con Supabase
import { getProductos, insertProducto, updateProducto } from "../database/sqlMethods";
import { syncWithSupabase } from "../database/sync";
import { getDB } from "../database/database";

const Products = ({ navigation }) => {
  // Estado para la lista de productos obtenida de SQLite
  const [productos, setProductos] = useState([]);
  const [buscarTexto, setBuscarTexto] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [loading, setLoading] = useState(false);
  const [productoActual, setProductoActual] = useState({
    sku: "",
    descripcion: "",
    referencia: "",
    precio: "",
    existencia: "",
    proveedor_id: "",
  });

  

  // Función para cargar los productos desde la base de datos SQLite
  const loadProductos = async () => {
    try {
      const data = await getProductos();
      setProductos(data);
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
    loadProductos();
    checkSync();
  }, []);

  // Función para abrir el modal de creación/edición
  const abrirModal = (producto = null) => {
    if (producto) {
      setProductoActual(producto);
      setModoEdicion(true);
    } else {
      setProductoActual({
        sku: "",
        descripcion: "",
        referencia: "",
        precio: "",
        existencia: "",
        proveedor_id: "",
      });
      setModoEdicion(false);
    }
    setModalVisible(true);
  };

  // Función para guardar o actualizar el producto en SQLite y sincronizar con Supabase
  const guardarProducto = async () => {
    if (!productoActual.descripcion.trim()) {
      Alert.alert("Error", "La descripción no puede estar vacía.");
      return;
    }
    try {
      setLoading(true);
      if (modoEdicion) {
        await updateProducto(
          productoActual.sku,
          productoActual.descripcion,
          productoActual.referencia,
          productoActual.precio,
          productoActual.existencia,
          productoActual.proveedor_id
        );
      } else {
        await insertProducto(
          productoActual.sku,
          productoActual.descripcion,
          productoActual.referencia,
          productoActual.precio,
          productoActual.existencia,
          productoActual.proveedor_id
        );
      }
      await loadProductos();
      await syncWithSupabase();
    } catch (error) {
      console.error("Error guardando producto:", error);
    }
    setLoading(false);
    setModalVisible(false);
  };

  // Filtrar productos según el texto buscado
  const productosFiltrados = productos.filter((item) =>
    `${item.descripcion} ${item.sku} ${item.referencia}`
      .toLowerCase()
      .includes(buscarTexto.toLowerCase())
  );



const migrateProductosAddForeignKey = async () => {
  try {
    const db = getDB();

    // Apaga temporalmente las validaciones de foreign keys
    await db.execAsync("PRAGMA foreign_keys=OFF;");
    await db.execAsync("BEGIN TRANSACTION;");

    // Crear una nueva tabla con la estructura deseada incluyendo la restricción FOREIGN KEY
    await db.execAsync(`
      CREATE TABLE productos_new (
        sku TEXT PRIMARY KEY,
        descripcion TEXT NOT NULL,
        referencia TEXT,
        precio REAL NOT NULL,
        existencia INTEGER NOT NULL,
        proveedor_id INTEGER,
        FOREIGN KEY (proveedor_id) REFERENCES Proveedores(id)
      );
    `);

    // Copiar los datos desde la tabla existente a la nueva,
    // asignando NULL a proveedor_id ya que no existe en la tabla antigua.
    await db.execAsync(`
      INSERT INTO productos_new (sku, descripcion, referencia, precio, existencia, proveedor_id)
      SELECT sku, descripcion, referencia, precio, existencia, NULL FROM productos;
    `);

    // Eliminar la tabla antigua
    await db.execAsync("DROP TABLE productos;");

    // Renombrar la nueva tabla para que tenga el nombre original
    await db.execAsync("ALTER TABLE productos_new RENAME TO productos;");

    await db.execAsync("COMMIT;");
    // Reactivar validaciones de claves foráneas
    await db.execAsync("PRAGMA foreign_keys=ON;");

    console.log("✅ Migración exitosa: la tabla 'productos' ahora tiene la restricción FOREIGN KEY sobre proveedor_id.");
  } catch (error) {
    console.error("❌ Error en migración de productos:", error);
    // En caso de error, intentar rollback
    try {
      await getDB().execAsync("ROLLBACK;");
    } catch (rollbackError) {
      console.error("Error en rollback:", rollbackError);
    }
  }
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
        <Text style={styles.textTitle}>PRODUCTOS</Text>
        <Pressable onPress={() => abrirModal()} style={styles.botonAgregar}>
          <MaterialCommunityIcons name="plus" color="#fff" size={24} />
        </Pressable>

        
       
      </View>

      {/* Buscador */}
      <View style={styles.buscador}>
        <TextInput
          placeholder="Buscar producto..."
          value={buscarTexto}
          onChangeText={setBuscarTexto}
          style={{ flex: 1 }}
        />
        <MaterialCommunityIcons name="magnify" style={styles.iconSearch} />
      </View>

      {/* Lista de productos */}
      <FlatList
        data={productosFiltrados}
        keyExtractor={(item) => item.sku.toString()}
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
                <Text style={styles.cardText}>{item.descripcion}</Text>
                <Text style={[styles.cardText, { fontSize: 13, color: "#555" }]}>
                  SKU: {item.sku} · REF: {item.referencia} · Precio: ${item.precio}
                </Text>
              </View>
            </View>
          </Pressable>
        )}
      />

      {/* Modal para crear/editar producto */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {modoEdicion ? "Editar Producto" : "Nuevo Producto"}
            </Text>
            {["sku", "descripcion", "referencia", "precio", "existencia", "proveedor_id"].map(
              (campo) => (
                <TextInput
                  key={campo}
                  style={styles.input}
                  placeholder={campo.toUpperCase()}
                  value={productoActual[campo]?.toString()}
                  onChangeText={(text) =>
                    setProductoActual((prev) => ({
                      ...prev,
                      [campo]:
                        ["sku", "precio", "existencia", "proveedor_id"].includes(campo)
                          ? Number(text)
                          : text,
                    }))
                  }
                  keyboardType={
                    ["sku", "precio", "existencia", "proveedor_id"].includes(campo)
                      ? "numeric"
                      : "default"
                  }
                />
              )
            )}
            {loading && (
              <ActivityIndicator
                size="large"
                color="#0073c6"
                style={{ marginVertical: 10 }}
              />
            )}
            <View style={{ flexDirection: "row", gap: 10 }}>
              <Pressable
                style={styles.btnCancelar}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.btnText}>Cancelar</Text>
              </Pressable>
              <Pressable style={styles.btnGuardar} onPress={guardarProducto}>
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

export default Products;
