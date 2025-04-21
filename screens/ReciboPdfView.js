import React, { useState } from "react";
import { Button, View, Text, StyleSheet } from "react-native";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";

const ReciboPdfView = ({ route }) => {
  const { recibo } = route.params;
  const [pdfPath, setPdfPath] = useState(null);

  const formatCurrency = (num) =>
    `$${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const numeroALetras = (num) => {
    return '***DOSCIENTOS OCHENTA Y UN MIL SEISCIENTOS DIECISÉIS***';
  };

  const generarPDF = async () => {
    try {
      const fechaObj = new Date(recibo.fecha);
      const dia = String(fechaObj.getDate()).padStart(2, '0');
      const mes = String(fechaObj.getMonth() + 1).padStart(2, '0');
      const anio = fechaObj.getFullYear();
      const fechaFormateada = `${dia}/${mes}/${anio}`;
      const horaFormateada = fechaObj.toLocaleTimeString('en-US', { hour12: false });

      const htmlContent = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <style>
    @page { size: A4 landscape; margin: 10mm; }
    body { font-family: Arial, sans-serif; background: #f2f2f2; margin: 0; padding: 0; }
    .container { width: 100%; margin: 0 auto; background: #fff; padding: 20px; border-radius: 6px; box-shadow: 0 1px 5px rgba(0,0,0,0.1); box-sizing: border-box; }
    .header { display: flex; justify-content: space-between; margin-bottom: 12px; }
    .company h2 { margin: 0; font-size: 20px; color: #0073c6; }
    .company p { margin: 2px 0; font-size: 12px; color: #555; }
    .meta { text-align: right; font-size: 12px; }
    .meta p { margin: 2px 0; }
    .title { text-align: center; font-size: 16px; font-weight: bold; margin: 10px 0; }
    table.details {border-collapse: collapse; margin-bottom: 8px; font-size: 12px; /* retire table-layout para ajuste automático */ }
    table.details td { padding: 4px 6px; vertical-align: top; }
    table.details .label { font-weight: bold; color: #0073c6; text-align: left; white-space: nowrap; /* ancho automático */ }
    table.details .value { text-align: left; font-size: 18px; white-space: nowrap; /* ancho automático */ }
    table.movements { width: 100%; border-collapse: collapse; margin-bottom: 10px; font-size: 12px; }
    table.movements th, table.movements td { border: 1px solid #333; padding: 4px 6px; text-align: center; }
    table.movements th { background: #e8f4ff; }
    .amount-words { font-size: 12px; margin-bottom: 6px; }
    .payment { font-size: 12px; margin-bottom: 16px; }
    .footer { display: flex; justify-content: space-between; margin-top: 20px; font-size: 12px; }
    .signature { flex: 1; text-align: center; border-top: 1px solid #333; padding-top: 4px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="company">
        <h2>Importadora Fidodido S.R.L.</h2>
        <p>Calle La Rosa #20, Moca, Espaillat, R.D.</p>
        <p>RNC: ${recibo.rnc || '...'}</p>
      </div>
      <div class="meta">
        <p><strong>FECHA:</strong> ${fechaFormateada}</p>
        <p><strong>HORA:</strong> ${horaFormateada}</p>
        <p><strong>RECIBO N°:</strong> ${recibo.numero_recibo}</p>
      </div>
    </div>
    <div class="title">RECIBO DE INGRESOS</div>
    <table class="details">
      <tr>
        <td class="label">CLIENTE:</td><td class="value">${recibo.cliente || recibo.cliente_id}</td>
     
      </tr>
      <tr>
        <td class="label">DIRECCIÓN:</td><td class="value">${recibo.direccion || ''}</td>

      </tr>
    </table>
    <div class="amount-words"><strong>MONTO RECIBO:</strong> ${formatCurrency(recibo.monto)} — ${numeroALetras(recibo.monto)}</div>
    <table class="movements">
      <tr>
        <th>DOCUMENTO</th><th>FECHA</th><th>VALOR FACTURA</th><th>VALOR PAGADO</th><th>DESCUENTO</th><th>CONCEPTO</th><th>BALANCE</th>
      </tr>
      <tr>
        <td>${recibo.factura_id}</td>
        <td>${fechaFormateada}</td>
        <td>${formatCurrency(recibo.factura_valor || recibo.monto)}</td>
        <td>${formatCurrency(recibo.monto)}</td>
        <td>${formatCurrency(0)}</td>
        <td>Pago</td>
        <td>${formatCurrency(0)}</td>
      </tr>
    </table>
    <div class="payment"><strong>FORMA DE PAGO:</strong> ${recibo.forma_pago || ''}</div>
    <div class="footer">
      
      <div class="signature">REALIZADO POR: ${recibo.usuario || ''}</div>
    </div>
  </div>
</body>
</html>`;

      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      const filename = `Recibo_${recibo.numero_recibo}.pdf`;
      const newUri = FileSystem.documentDirectory + filename;
      await FileSystem.moveAsync({ from: uri, to: newUri });
      setPdfPath(newUri);

      const compartir = await Sharing.isAvailableAsync();
      if (compartir) await Sharing.shareAsync(newUri);
    } catch (error) {
      console.error('Error al generar el PDF del recibo:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Generar Recibo PDF" onPress={generarPDF} />
      {pdfPath && <Text style={styles.pathText}>PDF guardado en: {pdfPath}</Text>}
    </View>
  );
};

export default ReciboPdfView;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', justifyContent: 'center', padding: 20 },
  pathText: { marginTop: 15, fontSize: 14, color: '#555' },
});
