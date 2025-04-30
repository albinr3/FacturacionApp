import { supabase } from './supabase';
import {
  getClientes,
  getProductos,
  getProveedores,
  getFacturas,
  getDetalleFacturaByNumero,
  getAllRecibosDetalle,
  getAllRecibosCabecera
} from './sqlMethods';

// Helper: Upsert en batch con minimal returning
// sync.js (o donde lo tengas definido)
// helper genérico
async function upsertBatch(table, records, conflictKeys = ['id']) {
  if (!records?.length) return;
  console.log(`🔄 Upserting ${records.length} registros en "${table}"…`);

  const { data, error } = await supabase
    .from(table)
    .upsert(records, {
      onConflict: conflictKeys,
      returning: 'minimal'
    });

  if (error) {
    console.error(`❌ Error sincronizando "${table}":`, error);
    throw error;
  }
  console.log(`✅ "${table}" sincronizado correctamente.`);
  return data;
}





// Sincronizaciones específicas por tabla
export async function syncClientes() {
  const clientes = await getClientes();
  await upsertBatch('clientes', clientes);
}

export async function syncProductos() {
  const productos = await getProductos();
  await upsertBatch('productos', productos, ['sku']);
}

export async function syncProveedores() {
  const proveedores = await getProveedores();
  await upsertBatch('proveedores', proveedores);
}

export async function syncFacturas() {
  const facturas = await getFacturas();
  // eliminamos campo 'cliente' si existe
  const payload = facturas.map(({ cliente, ...f }) => f);
  // indicamos que la clave de conflicto es `numero_factura`
  await upsertBatch('facturas', payload, ['numero_factura']);
}

export async function syncDetalle() {
  const facturas = await getFacturas();
  let allDetalles = [];
  for (const f of facturas) {
    const detalles = await getDetalleFacturaByNumero(f.numero_factura);
    detalles.forEach(({ descripcion, referencia, ...d }) => {
      allDetalles.push(d);
    });
  }
  await upsertBatch('detallefactura', allDetalles);
}

export async function syncRecibosCabecera() {
  const reciboscabecera = await getAllRecibosCabecera();
  // Descartamos columnas extra que no existan en Supabase
  const payload = reciboscabecera.map(({ cliente, direccion, ...c }) => c);
  const { error } = await supabase
    .from('reciboscabecera')
    .upsert(payload, { onConflict: ['id'], returning: 'minimal' });
  if (error) console.error('Error sincronizando RecibosCabecera:', error);
}

export async function syncRecibosDetalle() {
  const recibosdetalle = await getAllRecibosDetalle();
  const payload = recibosdetalle.map(({ factura, ...d }) => d);
  const { error } = await supabase
    .from('recibosdetalle')
    .upsert(payload, { onConflict: ['id'], returning: 'minimal' });
  if (error) console.error('Error sincronizando RecibosDetalle:', error);
}

// Sincronización completa (opcional)
export async function syncWithSupabase() {
  await syncClientes();
  await syncProductos();
  await syncProveedores();
  await syncFacturas();
  await syncDetalle();
  await syncRecibosCabecera();
  await syncRecibosDetalle();
}

