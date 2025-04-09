import { supabase } from './supabase';
import { 
  getClientes, 
  getProductos, 
  getProveedores, 
  getFacturas, 
  getDetalleFacturaByNumero 
} from './sqlMethods';

export const syncWithSupabase = async () => {
  // Sincronizar clientes
  const localClientes = await getClientes();

  for (const cliente of localClientes) {
    const { data, error } = await supabase
      .from('clientes')
      .upsert(cliente);
    if (error) {
      console.error("Error al sincronizar cliente:", cliente, error);
    } 
  }

  // Sincronizar productos
  const localProductos = await getProductos();

  for (const producto of localProductos) {
    const { data, error } = await supabase
      .from('productos')
      .upsert(producto);
    if (error) {
      console.error("Error al sincronizar producto:", producto, error);
    } 
  }

  // Sincronizar proveedores
  const localProveedores = await getProveedores();
  console.log("Local proveedores a sincronizar:", localProveedores);
  for (const proveedor of localProveedores) {
    const { data, error } = await supabase
      .from('proveedores')
      .upsert(proveedor);
    if (error) {
      console.error("Error al sincronizar proveedor:", proveedor, error);
    } 
  }

  // Sincronizar facturas
  const localFacturas = await getFacturas();
  //console.log("Local facturas a sincronizar:", localFacturas);
  for (const factura of localFacturas) {
    const { cliente, ...facturaSinCliente } = factura;
    const { data, error } = await supabase
      .from('facturas')
      .upsert(facturaSinCliente);
    // Resto de la lógica...
  }

  // Sincronizar detalle de facturas
  for (const factura of localFacturas) {
    const detalles = await getDetalleFacturaByNumero(factura.numero_factura);
    //console.log(`Detalles de la factura ${factura.numero_factura} a sincronizar:`, detalles);
    for (const detalle of detalles) {
      const {descripcion, referencia, ...detalleSinInfo} = detalle
      const { data, error } = await supabase
        .from('detallefactura')
        .upsert(detalleSinInfo);
      if (error) {
        
        console.error("Error al sincronizar detalle de factura:", detalle, error);
      } 
    }
  }

  // Consultar y mostrar los datos del servidor para confirmar la sincronización
  const { data: serverClientes, error: errorClientes } = await supabase
    .from('clientes')
    .select('*');
  if (errorClientes) {
    console.error("Error al obtener clientes del servidor:", errorClientes);
  } 

  const { data: serverProductos, error: errorProductos } = await supabase
    .from('productos')
    .select('*');
  if (errorProductos) {
    console.error("Error al obtener productos del servidor:", errorProductos);
  } 

  const { data: serverProveedores, error: errorProveedores } = await supabase
    .from('proveedores')
    .select('*');
  if (errorProveedores) {
    console.error("Error al obtener proveedores del servidor:", errorProveedores);
  } 

  const { data: serverFacturas, error: errorFacturas } = await supabase
    .from('facturas')
    .select('*');
  if (errorFacturas) {
    console.error("Error al obtener facturas del servidor:", errorFacturas);
  } 

  const { data: serverDetalleFactura, error: errorDetalleFactura } = await supabase
    .from('detallefactura')
    .select('*');
  if (errorDetalleFactura) {
    console.error("Error al obtener detalle de factura del servidor:", errorDetalleFactura);
  } 

  return {
    clientes: serverClientes,
    productos: serverProductos,
    proveedores: serverProveedores,
    facturas: serverFacturas,
    detalleFactura: serverDetalleFactura,
  };
};
