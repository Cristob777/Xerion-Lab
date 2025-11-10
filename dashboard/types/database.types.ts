/**
 * MISPA Database Types
 * Auto-generated from Supabase schema
 */

export interface FactVentasValidas {
  venta_id: number;
  fecha_venta: string;
  anio: number;
  mes: number;
  trimestre: number;
  client_id: number | null;
  nombre_cliente: string | null;
  product_id: number;
  variant_id: number;
  nombre_producto: string;
  marca: string | null;
  categoria_nivel1: string | null;
  categoria_nivel2: string | null;
  categoria_nivel3: string | null;
  cantidad: number;
  precio_unitario: number;
  descuento_porcentaje: number;
  venta_neta: number;
  venta_bruta: number;
  descuento_monto: number;
  office_id: number;
  nombre_oficina: string | null;
}

export interface DimProducto {
  product_id: number;
  variant_id: number;
  nombre_producto: string;
  descripcion: string | null;
  marca: string | null;
  sku: string | null;
  codigo: string | null;
  categoria_nivel1: string | null;
  categoria_nivel2: string | null;
  categoria_nivel3: string | null;
  precio_venta: number | null;
  costo_promedio: number | null;
  margen_bruto: number | null;
  total_ventas: number;
  cantidad_vendida: number;
  numero_transacciones: number;
  ticket_promedio: number | null;
  stock_actual: number | null;
  rotacion_stock: number | null;
  dias_cobertura: number | null;
  valid_from: string;
  valid_to: string | null;
  is_current: boolean;
}

export interface DimCliente {
  client_id: number;
  nombre: string;
  rut: string | null;
  email: string | null;
  telefono: string | null;
  ciudad: string | null;
  comuna: string | null;
  segmento_rfm: string | null;
  score_recency: number | null;
  score_frequency: number | null;
  score_monetary: number | null;
  rfm_score: number | null;
  total_compras: number;
  cantidad_ordenes: number;
  ticket_promedio: number | null;
  primera_compra: string | null;
  ultima_compra: string | null;
  dias_desde_ultima_compra: number | null;
  credit_score: number | null;
  saldo_pendiente: number | null;
  estado_cuenta: string | null;
  clv_estimado: number | null;
  valid_from: string;
  valid_to: string | null;
  is_current: boolean;
}

export interface SegmentacionRFM {
  client_id: number;
  nombre_cliente: string;
  segmento: string;
  recency_score: number;
  frequency_score: number;
  monetary_score: number;
  rfm_score: number;
  dias_ultima_compra: number;
  total_ordenes: number;
  total_gastado: number;
  ticket_promedio: number;
  clv_estimado: number;
  descripcion_segmento: string | null;
}

export interface MetricasConsolidadasDiarias {
  fecha: string;
  total_ventas: number;
  cantidad_transacciones: number;
  ticket_promedio: number;
  clientes_unicos: number;
  productos_vendidos: number;
  categoria_top: string | null;
  producto_top: string | null;
}

export interface MetricasRotacionStock {
  variant_id: number;
  nombre_producto: string;
  categoria: string | null;
  stock_actual: number;
  stock_minimo: number | null;
  ventas_30d: number;
  rotacion_mensual: number | null;
  dias_cobertura: number | null;
  estado_stock: string | null;
}

export interface KPISummary {
  total_ventas: number;
  total_transacciones: number;
  ticket_promedio: number;
  clientes_activos: number;
  productos_activos: number;
  crecimiento_ventas: number;
  crecimiento_transacciones: number;
  crecimiento_clientes: number;
}

export interface VentasPorCategoria {
  categoria: string;
  total_ventas: number;
  porcentaje: number;
  cantidad_productos: number;
  transacciones: number;
}

export interface TopProducto {
  product_id: number;
  nombre_producto: string;
  categoria: string | null;
  total_ventas: number;
  cantidad_vendida: number;
  transacciones: number;
  ticket_promedio: number;
}

export interface TendenciaVentas {
  fecha: string;
  total_ventas: number;
  transacciones: number;
  ticket_promedio: number;
  clientes_unicos: number;
}
