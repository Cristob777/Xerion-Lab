import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { calculateHealthScore } from '@/lib/ai-agent';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const dateFrom = searchParams.get('dateFrom') || '2020-01-01';
    const dateTo = searchParams.get('dateTo') || new Date().toISOString().split('T')[0];

    // Obtener datos
    const [ventasRes, stockRes] = await Promise.all([
      supabase
        .from('fact_ventas_validas')
        .select('venta_neta, client_id, categoria_nivel1')
        .gte('fecha_venta', dateFrom)
        .lte('fecha_venta', dateTo),

      supabase
        .from('dim_productos')
        .select('dias_cobertura')
        .eq('is_current', true)
        .not('dias_cobertura', 'is', null)
        .lt('dias_cobertura', 30),
    ]);

    if (ventasRes.error) throw ventasRes.error;

    // Período anterior
    const currentDate = new Date(dateTo);
    const fromDate = new Date(dateFrom);
    const daysDiff = Math.floor(
      (currentDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    const prevToDate = new Date(fromDate.getTime() - 1);
    const prevFromDate = new Date(prevToDate.getTime() - daysDiff * 24 * 60 * 60 * 1000);

    const { data: prevVentasData } = await supabase
      .from('fact_ventas_validas')
      .select('venta_neta')
      .gte('fecha_venta', prevFromDate.toISOString().split('T')[0])
      .lte('fecha_venta', prevToDate.toISOString().split('T')[0]);

    // Calcular métricas
    const totalVentas =
      ventasRes.data?.reduce((sum, row) => sum + (row.venta_neta || 0), 0) || 0;
    const totalTransacciones = ventasRes.data?.length || 0;
    const ticketPromedio =
      totalTransacciones > 0 ? totalVentas / totalTransacciones : 0;
    const clientesActivos = new Set(
      ventasRes.data?.map((row) => row.client_id).filter(Boolean)
    ).size;

    const prevTotalVentas =
      prevVentasData?.reduce((sum, row) => sum + (row.venta_neta || 0), 0) || 0;
    const crecimientoVentas =
      prevTotalVentas > 0 ? ((totalVentas - prevTotalVentas) / prevTotalVentas) * 100 : 0;

    const stockBajo = stockRes.data?.length || 0;

    // Agrupar categorías
    const categoriasMap = new Map<string, number>();
    ventasRes.data?.forEach((row) => {
      const cat = row.categoria_nivel1 || 'Sin Categoría';
      if (!categoriasMap.has(cat)) {
        categoriasMap.set(cat, 0);
      }
      categoriasMap.set(cat, categoriasMap.get(cat)! + (row.venta_neta || 0));
    });

    const topCategorias = Array.from(categoriasMap.entries())
      .map(([nombre, ventas]) => ({ nombre, ventas }))
      .sort((a, b) => b.ventas - a.ventas);

    // Calcular health score
    const healthScore = calculateHealthScore({
      totalVentas,
      totalTransacciones,
      ticketPromedio,
      crecimientoVentas,
      topProductos: [],
      topCategorias,
      clientesActivos,
      stockBajo,
    });

    return NextResponse.json(healthScore);
  } catch (error: any) {
    console.error('Error calculating health score:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to calculate health score' },
      { status: 500 }
    );
  }
}
