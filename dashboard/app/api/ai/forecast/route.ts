import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { generateForecast, detectSeasonality } from '@/lib/forecasting';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const periods = parseInt(searchParams.get('periods') || '6');
    const method = (searchParams.get('method') || 'linear') as 'linear' | 'moving_average';

    // Obtener datos históricos de ventas
    const { data: ventasData, error } = await supabase
      .from('fact_ventas_validas')
      .select('fecha_venta, venta_neta')
      .order('fecha_venta', { ascending: true });

    if (error) throw error;

    // Agrupar ventas por mes
    const monthlyData = new Map<string, number>();
    ventasData?.forEach((row) => {
      const month = row.fecha_venta.substring(0, 7); // YYYY-MM
      if (!monthlyData.has(month)) {
        monthlyData.set(month, 0);
      }
      monthlyData.set(month, monthlyData.get(month)! + (row.venta_neta || 0));
    });

    const dataPoints = Array.from(monthlyData.entries())
      .map(([fecha, value]) => ({
        fecha: `${fecha}-01`,
        value,
      }))
      .sort((a, b) => a.fecha.localeCompare(b.fecha));

    // Generar predicciones
    const forecast = generateForecast(dataPoints, periods, method);

    // Detectar estacionalidad
    const seasonality = detectSeasonality(dataPoints);

    return NextResponse.json({
      historical_data: dataPoints,
      forecast,
      seasonality,
      metadata: {
        periods,
        method,
        data_points: dataPoints.length,
      },
    });
  } catch (error: any) {
    console.error('Error generating forecast:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate forecast' },
      { status: 500 }
    );
  }
}
