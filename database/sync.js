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


import { getDB } from './database';


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


// sync.js


/**
 * Trae todos los datos de Supabase y los inserta/actualiza en la DB local.
 */
export async function populateLocalDatabaseFromSupabase() {
  const db = getDB();
  try {
    console.log('🔄 Poblando DB local desde Supabase…');
    await db.execAsync('BEGIN TRANSACTION;');

    // 1) Clientes
    const { data: clientes, error: errCli } = await supabase.from('clientes').select('*');
    if (errCli) throw errCli;
    for (const c of clientes) {
      await db.runAsync(
        `INSERT OR REPLACE INTO Clientes
         (id, nombre, direccion, telefono)
         VALUES (?, ?, ?, ?);`,
        [c.id, c.nombre, c.direccion, c.telefono]
      );
    }

    // 2) Productos
    const { data: productos, error: errProd } = await supabase.from('productos').select('*');
    if (errProd) throw errProd;
    for (const p of productos) {
      await db.runAsync(
        `INSERT OR REPLACE INTO Productos
         (sku, descripcion, referencia, precio, existencia)
         VALUES (?, ?, ?, ?, ?);`,
        [p.sku, p.descripcion, p.referencia, p.precio, p.existencia]
      );
    }

    // 3) Proveedores
    const { data: proveedores, error: errProv } = await supabase.from('proveedores').select('*');
    if (errProv) throw errProv;
    for (const pr of proveedores) {
      await db.runAsync(
        `INSERT OR REPLACE INTO Proveedores
         (id, nombre_proveedor, direccion, telefono)
         VALUES (?, ?, ?, ?);`,
        [pr.id, pr.nombre_proveedor, pr.direccion, pr.telefono]
      );
    }

    // 4) Facturas
    const { data: facturas, error: errFac } = await supabase.from('facturas').select('*');
    if (errFac) throw errFac;
    for (const f of facturas) {
      await db.runAsync(
        `INSERT OR REPLACE INTO Facturas
         (numero_factura, monto, fecha, condicion, cliente_id, pagada, cancelada, saldo)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
        [f.numero_factura, f.monto, f.fecha, f.condicion, f.cliente_id, f.pagada, f.cancelada, f.saldo]
      );
    }

    // 5) DetalleFactura
    const { data: detalles, error: errDet } = await supabase.from('detallefactura').select('*');
    if (errDet) throw errDet;
    for (const d of detalles) {
      await db.runAsync(
        `INSERT OR REPLACE INTO DetalleFactura
         (id, numero_factura, sku, cantidad, precio_unitario)
         VALUES (?, ?, ?, ?, ?);`,
        [d.id, d.numero_factura, d.sku, d.cantidad, d.precio_unitario]
      );
    }

    // 6) RecibosCabecera
    const { data: recibosCab, error: errRecCab } = await supabase.from('reciboscabecera').select('*');
    if (errRecCab) throw errRecCab;
    for (const rc of recibosCab) {
      await db.runAsync(
        `INSERT OR REPLACE INTO RecibosCabecera
         (id, numero_recibo, fecha, cliente_id, monto_total)
         VALUES (?, ?, ?, ?, ?);`,
        [rc.id, rc.numero_recibo, rc.fecha, rc.cliente_id, rc.monto_total]
      );
    }

    // 7) RecibosDetalle
    const { data: recibosDet, error: errRecDet } = await supabase.from('recibosdetalle').select('*');
    if (errRecDet) throw errRecDet;
    for (const rd of recibosDet) {
      await db.runAsync(
        `INSERT OR REPLACE INTO RecibosDetalle
         (id, recibo_id, factura_id, monto_aplicado)
         VALUES (?, ?, ?, ?);`,
        [rd.id, rd.recibo_id, rd.factura_id, rd.monto_aplicado]
      );
    }

    await db.execAsync('COMMIT;');
    console.log('✅ Base local poblada correctamente.');
  } catch (error) {
    await db.execAsync('ROLLBACK;');
    console.error('❌ Error poblando la DB local:', error);
  }
}

