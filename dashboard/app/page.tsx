'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import KPICard from '@/components/KPICard';
import ChartWrapper from '@/components/ChartWrapper';
import DateFilter from '@/components/DateFilter';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type {
  KPISummary,
  VentasPorCategoria,
  TendenciaVentas,
  TopProducto,
} from '@/types/database.types';

const COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function Home() {
  const [dateFrom, setDateFrom] = useState('2020-01-01');
  const [dateTo, setDateTo] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [kpis, setKpis] = useState<KPISummary | null>(null);
  const [categorias, setCategorias] = useState<VentasPorCategoria[]>([]);
  const [tendencias, setTendencias] = useState<TendenciaVentas[]>([]);
  const [topProductos, setTopProductos] = useState<TopProducto[]>([]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [kpisRes, categoriasRes, tendenciasRes, topProductosRes] = await Promise.all([
        fetch(`/api/kpis?dateFrom=${dateFrom}&dateTo=${dateTo}`),
        fetch(`/api/ventas/categorias?dateFrom=${dateFrom}&dateTo=${dateTo}`),
        fetch(`/api/ventas/tendencias?dateFrom=${dateFrom}&dateTo=${dateTo}&groupBy=month`),
        fetch(`/api/productos/top?dateFrom=${dateFrom}&dateTo=${dateTo}&limit=10`),
      ]);

      if (!kpisRes.ok || !categoriasRes.ok || !tendenciasRes.ok || !topProductosRes.ok) {
        throw new Error('Error al cargar datos');
      }

      const [kpisData, categoriasData, tendenciasData, topProductosData] = await Promise.all([
        kpisRes.json(),
        categoriasRes.json(),
        tendenciasRes.json(),
        topProductosRes.json(),
      ]);

      setKpis(kpisData);
      setCategorias(categoriasData);
      setTendencias(tendenciasData);
      setTopProductos(topProductosData);
    } catch (err: any) {
      setError(err.message || 'Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dateFrom, dateTo]);

  const handleDateChange = (from: string, to: string) => {
    setDateFrom(from);
    setDateTo(to);
  };

  if (loading && !kpis) {
    return (
      <DashboardLayout title="Dashboard Principal">
        <LoadingSpinner size="lg" />
      </DashboardLayout>
    );
  }

  if (error && !kpis) {
    return (
      <DashboardLayout title="Dashboard Principal">
        <ErrorMessage message={error} retry={fetchData} />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Dashboard Principal">
      <div className="space-y-6">
        {/* Date Filter */}
        <div className="flex justify-end">
          <DateFilter onDateChange={handleDateChange} />
        </div>

        {/* KPIs */}
        {kpis && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <KPICard
              title="Ventas Totales"
              value={kpis.total_ventas}
              format="currency"
              change={kpis.crecimiento_ventas}
              icon="💰"
            />
            <KPICard
              title="Transacciones"
              value={kpis.total_transacciones}
              format="number"
              change={kpis.crecimiento_transacciones}
              icon="🧾"
            />
            <KPICard
              title="Ticket Promedio"
              value={kpis.ticket_promedio}
              format="currency"
              icon="🎯"
            />
            <KPICard
              title="Clientes Activos"
              value={kpis.clientes_activos}
              format="number"
              change={kpis.crecimiento_clientes}
              icon="👥"
            />
          </div>
        )}

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tendencia de Ventas */}
          <ChartWrapper title="Tendencia de Ventas">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={tendencias}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="fecha" tick={{ fontSize: 12 }} />
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
                  dataKey="total_ventas"
                  stroke="#0ea5e9"
                  strokeWidth={2}
                  name="Ventas"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartWrapper>

          {/* Ventas por Categoría */}
          <ChartWrapper title="Ventas por Categoría">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categorias}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.categoria} (${entry.porcentaje.toFixed(1)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="total_ventas"
                >
                  {categorias.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any) =>
                    new Intl.NumberFormat('es-CL', {
                      style: 'currency',
                      currency: 'CLP',
                      minimumFractionDigits: 0,
                    }).format(value)
                  }
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartWrapper>
        </div>

        {/* Top 10 Productos */}
        <ChartWrapper title="Top 10 Productos Más Vendidos">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={topProductos} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis
                type="category"
                dataKey="nombre_producto"
                width={150}
                tick={{ fontSize: 11 }}
              />
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
              <Bar dataKey="total_ventas" fill="#0ea5e9" name="Ventas Totales" />
            </BarChart>
          </ResponsiveContainer>
        </ChartWrapper>

        {/* Tabla de Categorías */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Resumen por Categoría</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoría
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ventas
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    % Total
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Productos
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transacciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {categorias.map((cat, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {cat.categoria}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      {new Intl.NumberFormat('es-CL', {
                        style: 'currency',
                        currency: 'CLP',
                        minimumFractionDigits: 0,
                      }).format(cat.total_ventas)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      {cat.porcentaje.toFixed(1)}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      {cat.cantidad_productos}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      {cat.transacciones}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
