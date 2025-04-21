import { supabase } from './supabase';
import {
  getClientes,
  getProductos,
  getProveedores,
  getFacturas,
  getDetalleFacturaByNumero,
  getAllRecibos,
} from './sqlMethods';

// Helper: Upsert en batch con minimal returning
async function upsertBatch(table, records) {
  if (!records || records.length === 0) return;
  const { error } = await supabase
    .from(table)
    .upsert(records, { returning: 'minimal' });
  if (error) console.error(`Error sincronizando ${table}:`, error);
}

// Sincronizaciones específicas por tabla
export async function syncClientes() {
  const clientes = await getClientes();
  await upsertBatch('clientes', clientes);
}

export async function syncProductos() {
  const productos = await getProductos();
  await upsertBatch('productos', productos);
}

export async function syncProveedores() {
  const proveedores = await getProveedores();
  await upsertBatch('proveedores', proveedores);
}

export async function syncFacturas() {
  const facturas = await getFacturas();
  // eliminamos campo 'cliente' si existe
  const payload = facturas.map(({ cliente, ...f }) => f);
  await upsertBatch('facturas', payload);
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

export async function syncRecibos() {
  const recibos = await getAllRecibos();
  // Eliminamos propiedad 'cliente' que viene del JOIN
  const payload = recibos.map(({ cliente, direccion, ...r }) => r);
  await upsertBatch('recibos', payload);
}

// Sincronización completa (opcional)
export async function syncWithSupabase() {
  await Promise.all([
    syncClientes(),
    syncProductos(),
    syncProveedores(),
    syncFacturas(),
    syncDetalle(),
    syncRecibos(),
  ]);
}
