import React, { useState } from "react";
import { Button, View, Text } from "react-native";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

const FacturaPdfView = ({ route, navigation }) => {
  // Extrae invoice de route.params
  const { invoice, detalles } = route.params;
  const [pdfPath, setPdfPath] = useState(null);

  const generarPDF = async () => {
    console.log("Invoice recibido:", invoice);
    console.log("Detalle recibido:", detalles);


   


    // Se construye el HTML de la factura usando los datos
    const htmlContent = `<!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          .company-header { text-align: center; margin-bottom: 20px; }
          .company-header h2 { margin: 0; font-size: 22px; }
          .company-details { font-size: 18px; margin-top: 5px; line-height: 2px; }
          .header { border-bottom: 1px solid #ccc; font-size: 18px; margin-bottom: 20px; padding-bottom: 10px; }
          h1 { color: #0073c6; text-align: center; }
          .section { margin-bottom: 20px; }
          .producto { display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 18px; }
          .producto.header { font-weight: bold; border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-bottom: 10px; }
          .producto span { flex: 1; }

          /* Centrar el contenido de la columna de Referencia (2do) y Cantidad (3er) */
          .producto span:nth-child(2),
          .producto span:nth-child(3) {
            text-align: center;
          }
        </style>
      </head>
      <body>
        <!-- Encabezado de la empresa -->
        <div class="company-header">
          <h2>Importadora Fidodido SRL</h2>
          <div class="company-details">
            <p>La Rosa, Moca, Espaillat, Rep. Dom</p>
            <p>Teléfono: 809-578-1310 | RNC: 13190948</p>
          </div>
        </div>
        <!-- Encabezado de la factura -->
        <div class="header">
          <h1>Factura ${invoice.numero_factura}</h1>
          <p><strong>Cliente:</strong> ${invoice.cliente} (${
      invoice.cliente_id
    })</p>
          <p><strong>Fecha:</strong> ${invoice.fecha}</p>
          <p><strong>Condición:</strong> ${invoice.condicion}</p>
        </div>
        <!-- Sección de productos -->
        <div class="section">
          <h2>Productos</h2>
          <!-- Encabezado de columnas -->
          <div class="producto header">
            <span>Descripción</span>
            <span>Referencia</span>
            <span>Cantidad</span>
            <span>Precio</span>
            <span>Subtotal</span>
          </div>
          ${detalles
            .map(
              (prod) => `
                <div class="producto">
                  <span>${prod.descripcion}</span>
                  <span>${prod.referencia}</span>
                  <span>${prod.cantidad}</span>
                  <span>$${prod.precio_unitario.toFixed(2)}</span>
                  <span>$${(prod.cantidad * prod.precio_unitario).toFixed(
                    2
                  )}</span>
                </div>
              `
            )
            .join("")}
        </div>
        <!-- Total -->
        <div class="section" style="text-align: right;">
          <h2>Total: $${invoice.monto.toFixed(2)}</h2>
        </div>
      </body>
    </html>
  `;

    try {

      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      console.log("PDF URI generado:", uri);
      setPdfPath(uri);

      const sharingAvailable = await Sharing.isAvailableAsync();

      if (sharingAvailable) {
        await Sharing.shareAsync(uri);
 
      } else {
        console.log("El compartir PDF no está disponible en esta plataforma.");
      }
    } catch (error) {
      console.error("Error al generar el PDF:", error);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Button title="Generar PDF" onPress={generarPDF} />
      {pdfPath && (
        <Text style={{ marginTop: 10 }}>PDF generado en: {pdfPath}</Text>
      )}
    </View>
  );
};

export default FacturaPdfView;
