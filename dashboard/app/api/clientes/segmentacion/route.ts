import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Try to get from segmentacion_rfm table first
    const { data: rfmData, error: rfmError } = await supabase
      .from('segmentacion_rfm')
      .select('*')
      .order('total_gastado', { ascending: false });

    if (rfmError) {
      console.warn('segmentacion_rfm table not found, falling back to dim_clientes');

      // Fallback to dim_clientes
      const { data: clientesData, error: clientesError } = await supabase
        .from('dim_clientes')
        .select('*')
        .eq('is_current', true)
        .order('total_compras', { ascending: false });

      if (clientesError) throw clientesError;

      return NextResponse.json(clientesData || []);
    }

    return NextResponse.json(rfmData || []);
  } catch (error: any) {
    console.error('Error fetching segmentación RFM:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch customer segmentation' },
      { status: 500 }
    );
  }
}
