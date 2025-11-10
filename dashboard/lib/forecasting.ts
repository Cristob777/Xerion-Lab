/**
 * Forecasting Engine - MISPA Dashboard
 * Predicciones de ventas usando regresión lineal y promedio móvil
 */

interface DataPoint {
  fecha: string;
  value: number;
}

interface ForecastResult {
  fecha: string;
  predicted_value: number;
  confidence_lower: number;
  confidence_upper: number;
  trend: 'up' | 'down' | 'stable';
}

interface SeasonalityResult {
  has_seasonality: boolean;
  seasonal_pattern: string;
  peak_months: number[];
  low_months: number[];
}

/**
 * Calcular regresión lineal simple
 */
function linearRegression(data: DataPoint[]): { slope: number; intercept: number } {
  const n = data.length;
  if (n === 0) return { slope: 0, intercept: 0 };

  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumXX = 0;

  data.forEach((point, index) => {
    const x = index;
    const y = point.value;
    sumX += x;
    sumY += y;
    sumXY += x * y;
    sumXX += x * x;
  });

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  return { slope, intercept };
}

/**
 * Calcular promedio móvil
 */
function movingAverage(data: DataPoint[], window: number = 3): number[] {
  const result: number[] = [];
  for (let i = 0; i < data.length; i++) {
    if (i < window - 1) {
      result.push(data[i].value);
    } else {
      const sum = data.slice(i - window + 1, i + 1).reduce((acc, p) => acc + p.value, 0);
      result.push(sum / window);
    }
  }
  return result;
}

/**
 * Detectar estacionalidad
 */
export function detectSeasonality(data: DataPoint[]): SeasonalityResult {
  if (data.length < 12) {
    return {
      has_seasonality: false,
      seasonal_pattern: 'Datos insuficientes',
      peak_months: [],
      low_months: [],
    };
  }

  // Agrupar por mes
  const monthlyData = new Map<number, number[]>();
  data.forEach((point) => {
    const month = new Date(point.fecha).getMonth();
    if (!monthlyData.has(month)) {
      monthlyData.set(month, []);
    }
    monthlyData.get(month)!.push(point.value);
  });

  // Calcular promedios mensuales
  const monthlyAverages = Array.from(monthlyData.entries()).map(([month, values]) => ({
    month,
    avg: values.reduce((a, b) => a + b, 0) / values.length,
  }));

  const avgSales = monthlyAverages.reduce((sum, m) => sum + m.avg, 0) / monthlyAverages.length;
  const variance =
    monthlyAverages.reduce((sum, m) => sum + Math.pow(m.avg - avgSales, 2), 0) /
    monthlyAverages.length;
  const stdDev = Math.sqrt(variance);

  // Detectar picos y valles
  const threshold = 0.5 * stdDev;
  const peakMonths = monthlyAverages.filter((m) => m.avg > avgSales + threshold).map((m) => m.month);
  const lowMonths = monthlyAverages.filter((m) => m.avg < avgSales - threshold).map((m) => m.month);

  const has_seasonality = peakMonths.length > 0 || lowMonths.length > 0;

  return {
    has_seasonality,
    seasonal_pattern: has_seasonality
      ? 'Patrón estacional detectado'
      : 'Sin patrón estacional claro',
    peak_months: peakMonths,
    low_months: lowMonths,
  };
}

/**
 * Generar predicciones para N días/meses futuros
 */
export function generateForecast(
  data: DataPoint[],
  periods: number = 6,
  method: 'linear' | 'moving_average' = 'linear'
): ForecastResult[] {
  if (data.length === 0) return [];

  const { slope, intercept } = linearRegression(data);
  const movingAvg = movingAverage(data, 3);

  // Calcular error estándar para intervalos de confianza
  const predictions = data.map((_, index) => slope * index + intercept);
  const errors = data.map((point, index) => point.value - predictions[index]);
  const mse = errors.reduce((sum, err) => sum + err * err, 0) / errors.length;
  const stdError = Math.sqrt(mse);

  const results: ForecastResult[] = [];
  const lastDate = new Date(data[data.length - 1].fecha);

  for (let i = 1; i <= periods; i++) {
    const nextDate = new Date(lastDate);
    nextDate.setMonth(lastDate.getMonth() + i);

    let predictedValue: number;
    if (method === 'linear') {
      predictedValue = slope * (data.length + i - 1) + intercept;
    } else {
      // Promedio de los últimos 3 valores
      const lastValues = data.slice(-3).map((p) => p.value);
      predictedValue = lastValues.reduce((a, b) => a + b, 0) / lastValues.length;
      // Aplicar tendencia
      predictedValue += slope * i;
    }

    // Intervalos de confianza (95%)
    const confidenceInterval = 1.96 * stdError * Math.sqrt(1 + 1 / data.length);

    results.push({
      fecha: nextDate.toISOString().split('T')[0],
      predicted_value: Math.max(0, predictedValue),
      confidence_lower: Math.max(0, predictedValue - confidenceInterval),
      confidence_upper: predictedValue + confidenceInterval,
      trend: slope > 100 ? 'up' : slope < -100 ? 'down' : 'stable',
    });
  }

  return results;
}

/**
 * Calcular métricas de accuracy del modelo
 */
export function calculateAccuracy(
  actual: DataPoint[],
  predicted: number[]
): {
  mae: number;
  mape: number;
  rmse: number;
} {
  if (actual.length === 0 || actual.length !== predicted.length) {
    return { mae: 0, mape: 0, rmse: 0 };
  }

  let sumAbsError = 0;
  let sumPercentError = 0;
  let sumSquaredError = 0;

  actual.forEach((point, index) => {
    const error = Math.abs(point.value - predicted[index]);
    sumAbsError += error;
    sumPercentError += (error / point.value) * 100;
    sumSquaredError += Math.pow(error, 2);
  });

  const mae = sumAbsError / actual.length;
  const mape = sumPercentError / actual.length;
  const rmse = Math.sqrt(sumSquaredError / actual.length);

  return { mae, mape, rmse };
}
