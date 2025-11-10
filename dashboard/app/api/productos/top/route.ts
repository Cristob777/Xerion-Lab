import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import type { TopProducto } from '@/types/database.types';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const dateFrom = searchParams.get('dateFrom') || '2020-01-01';
    const dateTo = searchParams.get('dateTo') || new Date().toISOString().split('T')[0];
    const limit = parseInt(searchParams.get('limit') || '10');

    const { data, error } = await supabase
      .from('fact_ventas_validas')
      .select('product_id, nombre_producto, categoria_nivel1, venta_neta, cantidad')
      .gte('fecha_venta', dateFrom)
      .lte('fecha_venta', dateTo);

    if (error) throw error;

    // Group by product
    const productMap = new Map<number, {
      nombre: string;
      categoria: string | null;
      ventas: number;
      cantidad: number;
      transacciones: number;
    }>();

    data?.forEach(row => {
      if (!productMap.has(row.product_id)) {
        productMap.set(row.product_id, {
          nombre: row.nombre_producto,
          categoria: row.categoria_nivel1,
          ventas: 0,
          cantidad: 0,
          transacciones: 0,
        });
      }
      const prod = productMap.get(row.product_id)!;
      prod.ventas += row.venta_neta || 0;
      prod.cantidad += row.cantidad || 0;
      prod.transacciones += 1;
    });

    const result: TopProducto[] = Array.from(productMap.entries())
      .map(([product_id, data]) => ({
        product_id,
        nombre_producto: data.nombre,
        categoria: data.categoria,
        total_ventas: data.ventas,
        cantidad_vendida: data.cantidad,
        transacciones: data.transacciones,
        ticket_promedio: data.transacciones > 0 ? data.ventas / data.transacciones : 0,
      }))
      .sort((a, b) => b.total_ventas - a.total_ventas)
      .slice(0, limit);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error fetching top productos:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch top products' },
      { status: 500 }
    );
  }
}
