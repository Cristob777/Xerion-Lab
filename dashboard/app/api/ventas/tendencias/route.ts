import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import type { TendenciaVentas } from '@/types/database.types';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const dateFrom = searchParams.get('dateFrom') || '2020-01-01';
    const dateTo = searchParams.get('dateTo') || new Date().toISOString().split('T')[0];
    const groupBy = searchParams.get('groupBy') || 'day'; // day, week, month

    const { data, error } = await supabase
      .from('fact_ventas_validas')
      .select('fecha_venta, venta_neta, client_id')
      .gte('fecha_venta', dateFrom)
      .lte('fecha_venta', dateTo)
      .order('fecha_venta', { ascending: true });

    if (error) throw error;

    // Group data by period
    const groupedData = new Map<string, { ventas: number; transacciones: number; clientes: Set<number> }>();

    data?.forEach(row => {
      let key: string;
      const date = new Date(row.fecha_venta);

      if (groupBy === 'month') {
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      } else if (groupBy === 'week') {
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        key = weekStart.toISOString().split('T')[0];
      } else {
        key = row.fecha_venta;
      }

      if (!groupedData.has(key)) {
        groupedData.set(key, { ventas: 0, transacciones: 0, clientes: new Set() });
      }

      const group = groupedData.get(key)!;
      group.ventas += row.venta_neta || 0;
      group.transacciones += 1;
      if (row.client_id) group.clientes.add(row.client_id);
    });

    const result: TendenciaVentas[] = Array.from(groupedData.entries()).map(([fecha, data]) => ({
      fecha,
      total_ventas: data.ventas,
      transacciones: data.transacciones,
      ticket_promedio: data.transacciones > 0 ? data.ventas / data.transacciones : 0,
      clientes_unicos: data.clientes.size,
    })).sort((a, b) => a.fecha.localeCompare(b.fecha));

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error fetching tendencias:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch trends' },
      { status: 500 }
    );
  }
}
