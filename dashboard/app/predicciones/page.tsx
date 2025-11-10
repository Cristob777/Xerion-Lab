'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import ChartWrapper from '@/components/ChartWrapper';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  ComposedChart,
} from 'recharts';

interface Forecast {
  fecha: string;
  predicted_value: number;
  confidence_lower: number;
  confidence_upper: number;
  trend: 'up' | 'down' | 'stable';
}

interface Insight {
  id: string;
  type: 'opportunity' | 'warning' | 'info' | 'success';
  category: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  recommendation: string;
}

interface HealthScore {
  score: number;
  status: 'excellent' | 'good' | 'warning' | 'critical';
  factors: Array<{ name: string; score: number; weight: number }>;
}

export default function PrediccionesPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [forecastData, setForecastData] = useState<any>(null);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [healthScore, setHealthScore] = useState<HealthScore | null>(null);
  const [recommendations, setRecommendations] = useState<any>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [forecastRes, insightsRes, healthRes] = await Promise.all([
        fetch('/api/ai/forecast?periods=6&method=linear'),
        fetch('/api/ai/insights'),
        fetch('/api/ai/health-score'),
      ]);

      if (!forecastRes.ok || !insightsRes.ok || !healthRes.ok) {
        throw new Error('Error al cargar predicciones');
      }

      const [forecast, insightsData, health] = await Promise.all([
        forecastRes.json(),
        insightsRes.json(),
        healthRes.json(),
      ]);

      setForecastData(forecast);
      setInsights(insightsData.insights || []);
      setRecommendations(insightsData.recommendations);
      setHealthScore(health);
    } catch (err: any) {
      setError(err.message || 'Error al cargar predicciones');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading && !forecastData) {
    return (
      <DashboardLayout title="Predicciones e Insights IA">
        <LoadingSpinner size="lg" />
      </DashboardLayout>
    );
  }

  if (error && !forecastData) {
    return (
      <DashboardLayout title="Predicciones e Insights IA">
        <ErrorMessage message={error} retry={fetchData} />
      </DashboardLayout>
    );
  }

  // Combinar datos históricos y predicciones
  const chartData = [
    ...(forecastData?.historical_data || []).map((d: any) => ({
      fecha: d.fecha,
      real: d.value,
      tipo: 'Histórico',
    })),
    ...(forecastData?.forecast || []).map((d: Forecast) => ({
      fecha: d.fecha,
      prediccion: d.predicted_value,
      lower: d.confidence_lower,
      upper: d.confidence_upper,
      tipo: 'Predicción',
    })),
  ];

  const getHealthColor = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'bg-success-100 text-success-800 border-success-300';
      case 'good':
        return 'bg-primary-100 text-primary-800 border-primary-300';
      case 'warning':
        return 'bg-warning-100 text-warning-800 border-warning-300';
      case 'critical':
        return 'bg-danger-100 text-danger-800 border-danger-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'success':
        return '✅';
      case 'warning':
        return '⚠️';
      case 'opportunity':
        return '💡';
      case 'info':
      default:
        return 'ℹ️';
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'border-l-success-500 bg-success-50';
      case 'warning':
        return 'border-l-warning-500 bg-warning-50';
      case 'opportunity':
        return 'border-l-primary-500 bg-primary-50';
      case 'info':
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  return (
    <DashboardLayout title="Predicciones e Insights IA">
      <div className="space-y-6">
        {/* Health Score */}
        {healthScore && (
          <div className={`rounded-lg border-2 p-6 ${getHealthColor(healthScore.status)}`}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold">Score de Salud del Negocio</h2>
                <p className="text-sm mt-1">
                  Evaluación automática basada en métricas clave
                </p>
              </div>
              <div className="text-center">
                <div className="text-6xl font-bold">{healthScore.score}</div>
                <div className="text-sm font-medium mt-1 uppercase">
                  {healthScore.status === 'excellent' && 'Excelente'}
                  {healthScore.status === 'good' && 'Bueno'}
                  {healthScore.status === 'warning' && 'Atención'}
                  {healthScore.status === 'critical' && 'Crítico'}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              {healthScore.factors.map((factor, idx) => (
                <div key={idx} className="bg-white rounded p-3">
                  <div className="text-sm font-medium text-gray-700">{factor.name}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full"
                        style={{ width: `${factor.score}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold">{Math.round(factor.score)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Forecast Chart */}
        <ChartWrapper title="Predicción de Ventas (6 meses)">
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="fecha" tick={{ fontSize: 11 }} angle={-45} textAnchor="end" height={80} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(value: any) =>
                  new Intl.NumberFormat('es-CL', {
                    style: 'currency',
                    currency: 'CLP',
                    minimumFractionDigits: 0,
                  }).format(value)
                }
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="real"
                stroke="#0ea5e9"
                strokeWidth={2}
                name="Ventas Reales"
                dot={{ r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="prediccion"
                stroke="#10b981"
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Predicción"
                dot={{ r: 4 }}
              />
              <Area
                type="monotone"
                dataKey="upper"
                stroke="none"
                fill="#10b981"
                fillOpacity={0.1}
                name="Intervalo Superior"
              />
              <Area
                type="monotone"
                dataKey="lower"
                stroke="none"
                fill="#10b981"
                fillOpacity={0.1}
                name="Intervalo Inferior"
              />
            </ComposedChart>
          </ResponsiveContainer>

          {forecastData?.seasonality && (
            <div className="mt-4 p-4 bg-gray-50 rounded">
              <p className="text-sm font-medium text-gray-700">
                Análisis de Estacionalidad
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {forecastData.seasonality.seasonal_pattern}
              </p>
              {forecastData.seasonality.peak_months.length > 0 && (
                <p className="text-sm text-gray-600 mt-1">
                  Meses pico: {forecastData.seasonality.peak_months.map((m: number) => m + 1).join(', ')}
                </p>
              )}
            </div>
          )}
        </ChartWrapper>

        {/* AI Insights */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Insights del Agente de IA
          </h2>

          <div className="space-y-4">
            {insights.length === 0 && (
              <p className="text-gray-500 text-center py-8">
                No hay insights disponibles en este momento
              </p>
            )}

            {insights.map((insight) => (
              <div
                key={insight.id}
                className={`border-l-4 p-4 rounded ${getInsightColor(insight.type)}`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{getInsightIcon(insight.type)}</span>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <h3 className="font-bold text-gray-900">{insight.title}</h3>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          insight.impact === 'high'
                            ? 'bg-danger-100 text-danger-800'
                            : insight.impact === 'medium'
                            ? 'bg-warning-100 text-warning-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {insight.impact === 'high' && 'Alto Impacto'}
                        {insight.impact === 'medium' && 'Impacto Medio'}
                        {insight.impact === 'low' && 'Bajo Impacto'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mt-1">{insight.description}</p>
                    <div className="mt-3 p-3 bg-white rounded border border-gray-200">
                      <p className="text-xs font-medium text-gray-600 mb-1">
                        Recomendación:
                      </p>
                      <p className="text-sm text-gray-800">{insight.recommendation}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recomendaciones */}
        {recommendations && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {['productos', 'clientes', 'inventario'].map((category) => (
              <div key={category} className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 capitalize">
                  {category}
                </h3>
                <ul className="space-y-2">
                  {recommendations[category]?.map((rec: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-primary-600 mt-1">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
