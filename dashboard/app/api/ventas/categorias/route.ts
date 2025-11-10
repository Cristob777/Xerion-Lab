import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import type { VentasPorCategoria } from '@/types/database.types';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const dateFrom = searchParams.get('dateFrom') || '2020-01-01';
    const dateTo = searchParams.get('dateTo') || new Date().toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('fact_ventas_validas')
      .select('categoria_nivel1, venta_neta, product_id')
      .gte('fecha_venta', dateFrom)
      .lte('fecha_venta', dateTo);

    if (error) throw error;

    // Group by category
    const categoryMap = new Map<string, { ventas: number; productos: Set<number>; transacciones: number }>();

    data?.forEach(row => {
      const cat = row.categoria_nivel1 || 'Sin Categoría';
      if (!categoryMap.has(cat)) {
        categoryMap.set(cat, { ventas: 0, productos: new Set(), transacciones: 0 });
      }
      const catData = categoryMap.get(cat)!;
      catData.ventas += row.venta_neta || 0;
      if (row.product_id) catData.productos.add(row.product_id);
      catData.transacciones += 1;
    });

    const totalVentas = Array.from(categoryMap.values()).reduce((sum, cat) => sum + cat.ventas, 0);

    const result: VentasPorCategoria[] = Array.from(categoryMap.entries()).map(([categoria, data]) => ({
      categoria,
      total_ventas: data.ventas,
      porcentaje: totalVentas > 0 ? (data.ventas / totalVentas) * 100 : 0,
      cantidad_productos: data.productos.size,
      transacciones: data.transacciones,
    })).sort((a, b) => b.total_ventas - a.total_ventas);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error fetching ventas por categoría:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch sales by category' },
      { status: 500 }
    );
  }
}
