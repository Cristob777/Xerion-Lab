/**
 * AI Insights Agent - MISPA Dashboard
 * Genera insights automáticos y recomendaciones basadas en datos
 */

interface Insight {
  id: string;
  type: 'opportunity' | 'warning' | 'info' | 'success';
  category: 'ventas' | 'productos' | 'clientes' | 'inventario';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  recommendation: string;
  metric?: number;
  trend?: 'up' | 'down' | 'stable';
}

interface DataSummary {
  totalVentas: number;
  totalTransacciones: number;
  ticketPromedio: number;
  crecimientoVentas: number;
  topProductos: Array<{ nombre: string; ventas: number }>;
  topCategorias: Array<{ nombre: string; ventas: number }>;
  clientesActivos: number;
  stockBajo: number;
}

/**
 * Generar insights automáticos basados en los datos
 */
export function generateInsights(data: DataSummary): Insight[] {
  const insights: Insight[] = [];
  let insightId = 1;

  // 1. Análisis de crecimiento de ventas
  if (data.crecimientoVentas > 20) {
    insights.push({
      id: `insight-${insightId++}`,
      type: 'success',
      category: 'ventas',
      title: 'Crecimiento excepcional de ventas',
      description: `Las ventas han crecido un ${data.crecimientoVentas.toFixed(1)}% respecto al período anterior.`,
      impact: 'high',
      recommendation:
        'Analizar qué productos o categorías están impulsando este crecimiento y aumentar el stock de estos items.',
      metric: data.crecimientoVentas,
      trend: 'up',
    });
  } else if (data.crecimientoVentas < -10) {
    insights.push({
      id: `insight-${insightId++}`,
      type: 'warning',
      category: 'ventas',
      title: 'Decrecimiento en ventas',
      description: `Las ventas han disminuido un ${Math.abs(data.crecimientoVentas).toFixed(
        1
      )}% respecto al período anterior.`,
      impact: 'high',
      recommendation:
        'Revisar estrategia de precios, realizar promociones o campañas de marketing para reactivar ventas.',
      metric: data.crecimientoVentas,
      trend: 'down',
    });
  }

  // 2. Análisis de ticket promedio
  if (data.ticketPromedio < 50000) {
    insights.push({
      id: `insight-${insightId++}`,
      type: 'opportunity',
      category: 'ventas',
      title: 'Oportunidad de aumentar ticket promedio',
      description: `El ticket promedio actual es de $${data.ticketPromedio.toLocaleString(
        'es-CL'
      )} CLP.`,
      impact: 'medium',
      recommendation:
        'Implementar estrategias de upselling y cross-selling. Ofrecer bundles o paquetes de productos complementarios.',
      metric: data.ticketPromedio,
    });
  }

  // 3. Análisis de productos top
  if (data.topProductos.length > 0) {
    const topProduct = data.topProductos[0];
    const concentracion =
      (topProduct.ventas / data.totalVentas) * 100;

    if (concentracion > 30) {
      insights.push({
        id: `insight-${insightId++}`,
        type: 'warning',
        category: 'productos',
        title: 'Alta concentración en un solo producto',
        description: `El producto "${topProduct.nombre}" representa el ${concentracion.toFixed(
          1
        )}% de las ventas totales.`,
        impact: 'medium',
        recommendation:
          'Diversificar la oferta de productos para reducir dependencia de un solo item. Esto mitiga riesgos.',
        metric: concentracion,
      });
    }
  }

  // 4. Análisis de stock bajo
  if (data.stockBajo > 10) {
    insights.push({
      id: `insight-${insightId++}`,
      type: 'warning',
      category: 'inventario',
      title: 'Múltiples productos con stock bajo',
      description: `Hay ${data.stockBajo} productos con menos de 30 días de cobertura.`,
      impact: 'high',
      recommendation:
        'Realizar pedidos de reposición urgente para evitar quiebres de stock y pérdida de ventas.',
      metric: data.stockBajo,
    });
  } else if (data.stockBajo > 0) {
    insights.push({
      id: `insight-${insightId++}`,
      type: 'info',
      category: 'inventario',
      title: 'Algunos productos con stock bajo',
      description: `Hay ${data.stockBajo} productos que requieren reposición próximamente.`,
      impact: 'medium',
      recommendation: 'Planificar reposición de inventario en las próximas semanas.',
      metric: data.stockBajo,
    });
  }

  // 5. Análisis de categorías
  if (data.topCategorias.length >= 2) {
    const cat1 = data.topCategorias[0];
    const cat2 = data.topCategorias[1];
    const ratio = cat1.ventas / cat2.ventas;

    if (ratio > 3) {
      insights.push({
        id: `insight-${insightId++}`,
        type: 'opportunity',
        category: 'productos',
        title: 'Desbalance entre categorías',
        description: `La categoría "${cat1.nombre}" vende ${ratio.toFixed(
          1
        )}x más que "${cat2.nombre}".`,
        impact: 'medium',
        recommendation: `Potenciar la categoría "${cat2.nombre}" con promociones o mejorar su visibilidad en tienda.`,
        metric: ratio,
      });
    }
  }

  // 6. Análisis de base de clientes
  if (data.clientesActivos < 50) {
    insights.push({
      id: `insight-${insightId++}`,
      type: 'warning',
      category: 'clientes',
      title: 'Base de clientes limitada',
      description: `Solo ${data.clientesActivos} clientes activos en el período actual.`,
      impact: 'high',
      recommendation:
        'Implementar campañas de adquisición de clientes y programas de fidelización.',
      metric: data.clientesActivos,
    });
  }

  // 7. Análisis de volumen de transacciones
  if (data.totalTransacciones < 100) {
    insights.push({
      id: `insight-${insightId++}`,
      type: 'info',
      category: 'ventas',
      title: 'Bajo volumen de transacciones',
      description: `Se registraron ${data.totalTransacciones} transacciones en el período.`,
      impact: 'medium',
      recommendation:
        'Aumentar frecuencia de compra mediante programas de lealtad o descuentos por volumen.',
      metric: data.totalTransacciones,
    });
  }

  // 8. Insight positivo si todo va bien
  if (
    data.crecimientoVentas > 0 &&
    data.crecimientoVentas < 20 &&
    data.stockBajo === 0
  ) {
    insights.push({
      id: `insight-${insightId++}`,
      type: 'success',
      category: 'ventas',
      title: 'Operación saludable',
      description: 'Las métricas clave muestran un desempeño sólido y consistente.',
      impact: 'low',
      recommendation:
        'Mantener la estrategia actual y buscar oportunidades de optimización incremental.',
      trend: 'stable',
    });
  }

  return insights;
}

/**
 * Generar recomendaciones específicas por categoría
 */
export function generateRecommendations(
  category: 'productos' | 'clientes' | 'inventario',
  data: any
): string[] {
  const recommendations: string[] = [];

  switch (category) {
    case 'productos':
      recommendations.push(
        'Analizar productos de bajo rendimiento y considerar descontinuarlos',
        'Identificar productos complementarios para estrategias de cross-selling',
        'Optimizar precios basándose en elasticidad de demanda',
        'Lanzar productos nuevos en categorías de alto crecimiento'
      );
      break;

    case 'clientes':
      recommendations.push(
        'Implementar programa de puntos o cashback para clientes frecuentes',
        'Reactivar clientes inactivos con ofertas personalizadas',
        'Segmentar comunicaciones según perfil RFM',
        'Ofrecer descuentos por referidos para aumentar base de clientes'
      );
      break;

    case 'inventario':
      recommendations.push(
        'Implementar sistema de reorden automático basado en rotación',
        'Negociar mejores términos con proveedores de productos de alta rotación',
        'Liquidar inventario de baja rotación para liberar capital',
        'Optimizar niveles de stock según estacionalidad histórica'
      );
      break;
  }

  return recommendations;
}

/**
 * Calcular score de salud del negocio (0-100)
 */
export function calculateHealthScore(data: DataSummary): {
  score: number;
  status: 'excellent' | 'good' | 'warning' | 'critical';
  factors: Array<{ name: string; score: number; weight: number }>;
} {
  const factors = [
    {
      name: 'Crecimiento de Ventas',
      score: Math.min(100, Math.max(0, 50 + data.crecimientoVentas)),
      weight: 0.3,
    },
    {
      name: 'Ticket Promedio',
      score: Math.min(100, (data.ticketPromedio / 100000) * 100),
      weight: 0.2,
    },
    {
      name: 'Base de Clientes',
      score: Math.min(100, (data.clientesActivos / 200) * 100),
      weight: 0.2,
    },
    {
      name: 'Stock Saludable',
      score: Math.max(0, 100 - data.stockBajo * 5),
      weight: 0.15,
    },
    {
      name: 'Volumen de Transacciones',
      score: Math.min(100, (data.totalTransacciones / 500) * 100),
      weight: 0.15,
    },
  ];

  const totalScore = factors.reduce(
    (sum, factor) => sum + factor.score * factor.weight,
    0
  );

  let status: 'excellent' | 'good' | 'warning' | 'critical';
  if (totalScore >= 80) status = 'excellent';
  else if (totalScore >= 60) status = 'good';
  else if (totalScore >= 40) status = 'warning';
  else status = 'critical';

  return {
    score: Math.round(totalScore),
    status,
    factors,
  };
}
