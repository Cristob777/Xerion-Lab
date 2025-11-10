import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { generateInsights, generateRecommendations } from '@/lib/ai-agent';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const dateFrom = searchParams.get('dateFrom') || '2020-01-01';
    const dateTo = searchParams.get('dateTo') || new Date().toISOString().split('T')[0];

    // Obtener datos para generar insights
    const [ventasRes, productosRes, stockRes] = await Promise.all([
      // Ventas actuales
      supabase
        .from('fact_ventas_validas')
        .select('venta_neta, client_id, product_id, nombre_producto, categoria_nivel1')
        .gte('fecha_venta', dateFrom)
        .lte('fecha_venta', dateTo),

      // Top productos
      supabase
        .from('fact_ventas_validas')
        .select('nombre_producto, venta_neta')
        .gte('fecha_venta', dateFrom)
        .lte('fecha_venta', dateTo),

      // Stock bajo
      supabase
        .from('dim_productos')
        .select('dias_cobertura')
        .eq('is_current', true)
        .not('dias_cobertura', 'is', null)
        .lt('dias_cobertura', 30),
    ]);

    if (ventasRes.error) throw ventasRes.error;

    // Calcular período anterior para comparación
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

    // Agrupar productos
    const productsMap = new Map<string, number>();
    productosRes.data?.forEach((row) => {
      const nombre = row.nombre_producto;
      if (!productsMap.has(nombre)) {
        productsMap.set(nombre, 0);
      }
      productsMap.set(nombre, productsMap.get(nombre)! + (row.venta_neta || 0));
    });

    const topProductos = Array.from(productsMap.entries())
      .map(([nombre, ventas]) => ({ nombre, ventas }))
      .sort((a, b) => b.ventas - a.ventas)
      .slice(0, 5);

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

    const stockBajo = stockRes.data?.length || 0;

    // Generar insights
    const insights = generateInsights({
      totalVentas,
      totalTransacciones,
      ticketPromedio,
      crecimientoVentas,
      topProductos,
      topCategorias,
      clientesActivos,
      stockBajo,
    });

    // Generar recomendaciones por categoría
    const recommendations = {
      productos: generateRecommendations('productos', {}),
      clientes: generateRecommendations('clientes', {}),
      inventario: generateRecommendations('inventario', {}),
    };

    return NextResponse.json({
      insights,
      recommendations,
      summary: {
        total_insights: insights.length,
        high_impact: insights.filter((i) => i.impact === 'high').length,
        warnings: insights.filter((i) => i.type === 'warning').length,
        opportunities: insights.filter((i) => i.type === 'opportunity').length,
      },
    });
  } catch (error: any) {
    console.error('Error generating insights:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate insights' },
      { status: 500 }
    );
  }
}
