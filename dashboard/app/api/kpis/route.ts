import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import type { KPISummary } from '@/types/database.types';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const dateFrom = searchParams.get('dateFrom') || '2020-01-01';
    const dateTo = searchParams.get('dateTo') || new Date().toISOString().split('T')[0];

    // Get current period metrics
    const { data: currentData, error: currentError } = await supabase
      .from('fact_ventas_validas')
      .select('venta_neta, client_id')
      .gte('fecha_venta', dateFrom)
      .lte('fecha_venta', dateTo);

    if (currentError) throw currentError;

    // Calculate previous period (same duration)
    const currentDate = new Date(dateTo);
    const fromDate = new Date(dateFrom);
    const daysDiff = Math.floor((currentDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24));
    const prevToDate = new Date(fromDate.getTime() - 1);
    const prevFromDate = new Date(prevToDate.getTime() - daysDiff * 24 * 60 * 60 * 1000);

    const { data: prevData, error: prevError } = await supabase
      .from('fact_ventas_validas')
      .select('venta_neta, client_id')
      .gte('fecha_venta', prevFromDate.toISOString().split('T')[0])
      .lte('fecha_venta', prevToDate.toISOString().split('T')[0]);

    if (prevError) throw prevError;

    // Get product count
    const { count: productCount } = await supabase
      .from('dim_productos')
      .select('*', { count: 'exact', head: true })
      .eq('is_current', true);

    // Calculate metrics
    const currentVentas = currentData?.reduce((sum, row) => sum + (row.venta_neta || 0), 0) || 0;
    const currentTransacciones = currentData?.length || 0;
    const currentClientes = new Set(currentData?.map(row => row.client_id).filter(Boolean)).size;

    const prevVentas = prevData?.reduce((sum, row) => sum + (row.venta_neta || 0), 0) || 0;
    const prevTransacciones = prevData?.length || 0;
    const prevClientes = new Set(prevData?.map(row => row.client_id).filter(Boolean)).size;

    const kpis: KPISummary = {
      total_ventas: currentVentas,
      total_transacciones: currentTransacciones,
      ticket_promedio: currentTransacciones > 0 ? currentVentas / currentTransacciones : 0,
      clientes_activos: currentClientes,
      productos_activos: productCount || 0,
      crecimiento_ventas: prevVentas > 0 ? ((currentVentas - prevVentas) / prevVentas) * 100 : 0,
      crecimiento_transacciones: prevTransacciones > 0 ? ((currentTransacciones - prevTransacciones) / prevTransacciones) * 100 : 0,
      crecimiento_clientes: prevClientes > 0 ? ((currentClientes - prevClientes) / prevClientes) * 100 : 0,
    };

    return NextResponse.json(kpis);
  } catch (error: any) {
    console.error('Error fetching KPIs:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch KPIs' },
      { status: 500 }
    );
  }
}
