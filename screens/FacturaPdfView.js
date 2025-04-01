import React from "react";
import { StyleSheet, View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const FacturaPdfView = ({ route, navigation }) => {
  const { invoice } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Encabezado de la factura */}
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Factura {invoice.id}</Text>
          <View style={styles.headerDetails}>
            <Text style={styles.subtitle}>Cliente: {invoice.cliente}</Text>
            <Text style={styles.subtitle}>Fecha: {invoice.fecha}</Text>
            <Text style={styles.subtitle}>Condición: {invoice.condicion}</Text>
          </View>
        </View>

        <View style={styles.separator} />

        {/* Sección de Productos */}
        <Text style={styles.sectionTitle}>Productos</Text>
        <View style={styles.productContainer}>
          {invoice.productos.map((prod, index) => (
            <View key={index} style={styles.productRow}>
              <View style={styles.productDescription}>
                <Text style={styles.productLabel}>Producto</Text>
                <Text style={styles.productText}>{prod.descripcion}</Text>
              </View>
              <View style={styles.productInfo}>
                <Text style={styles.productLabel}>Cantidad</Text>
                <Text style={styles.productText}>{prod.cantidad}</Text>
              </View>
              <View style={styles.productInfo}>
                <Text style={styles.productLabel}>Precio</Text>
                <Text style={styles.productText}>${prod.precio.toFixed(2)}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.separator} />

        {/* Total */}
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalValue}>${invoice.monto.toFixed(2)}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fbf9f9" },
  content: { padding: 20 },
  headerContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0073c6",
    marginBottom: 10,
    textAlign: "center",
  },
  headerDetails: {
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    paddingTop: 10,
  },
  subtitle: { fontSize: 16, marginBottom: 5, color: "#555" },
  separator: { borderBottomWidth: 1, borderBottomColor: "#ccc", marginVertical: 15 },
  sectionTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 10, color: "#0073c6" },
  productContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
  productRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  productDescription: {
    flex: 2,
  },
  productInfo: {
    flex: 1,
    alignItems: "center",
  },
  productLabel: { fontSize: 14, fontWeight: "600", color: "#0073c6" },
  productText: { fontSize: 16, color: "#333", marginTop: 2 },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
  totalLabel: { fontSize: 20, fontWeight: "bold", color: "#0073c6", marginRight: 10 },
  totalValue: { fontSize: 20, fontWeight: "bold", color: "#333" },
});

export default FacturaPdfView;
