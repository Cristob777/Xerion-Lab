import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Try to get from metricas_rotacion_stock table
    const { data, error } = await supabase
      .from('metricas_rotacion_stock')
      .select('*')
      .order('dias_cobertura', { ascending: true })
      .limit(50);

    if (error) {
      console.warn('metricas_rotacion_stock table not found, using fallback');

      // Fallback: calculate from dim_productos
      const { data: productData, error: productError } = await supabase
        .from('dim_productos')
        .select('nombre_producto, categoria_nivel1, stock_actual, rotacion_stock, dias_cobertura')
        .eq('is_current', true)
        .not('stock_actual', 'is', null)
        .order('stock_actual', { ascending: false })
        .limit(50);

      if (productError) throw productError;

      return NextResponse.json(productData || []);
    }

    return NextResponse.json(data || []);
  } catch (error: any) {
    console.error('Error fetching rotación de stock:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch stock rotation' },
      { status: 500 }
    );
  }
}
