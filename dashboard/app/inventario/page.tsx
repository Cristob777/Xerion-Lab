'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import ChartWrapper from '@/components/ChartWrapper';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { MetricasRotacionStock } from '@/types/database.types';

export default function InventarioPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stock, setStock] = useState<any[]>([]);
  const [filter, setFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all');

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/stock/rotacion');
      if (!response.ok) throw new Error('Error al cargar inventario');

      const data = await response.json();
      setStock(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar inventario');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading && stock.length === 0) {
    return (
      <DashboardLayout title="Análisis de Inventario">
        <LoadingSpinner size="lg" />
      </DashboardLayout>
    );
  }

  if (error && stock.length === 0) {
    return (
      <DashboardLayout title="Análisis de Inventario">
        <ErrorMessage message={error} retry={fetchData} />
      </DashboardLayout>
    );
  }

  // Categorize stock levels
  const lowStock = stock.filter((s: any) => {
    const dias = s.dias_cobertura || 0;
    return dias > 0 && dias < 30;
  });
  const mediumStock = stock.filter((s: any) => {
    const dias = s.dias_cobertura || 0;
    return dias >= 30 && dias < 90;
  });
  const highStock = stock.filter((s: any) => {
    const dias = s.dias_cobertura || 0;
    return dias >= 90;
  });
  const noDataStock = stock.filter((s: any) => !s.dias_cobertura);

  const filteredStock =
    filter === 'low'
      ? lowStock
      : filter === 'medium'
      ? mediumStock
      : filter === 'high'
      ? highStock
      : stock;

  const totalStock = stock.reduce((sum, s: any) => sum + (s.stock_actual || 0), 0);
  const avgRotacion = stock.length > 0
    ? stock.reduce((sum, s: any) => sum + (s.rotacion_mensual || 0), 0) / stock.length
    : 0;

  const stockStatusData = [
    { name: 'Bajo Stock (<30d)', value: lowStock.length, color: '#ef4444' },
    { name: 'Stock Medio (30-90d)', value: mediumStock.length, color: '#f59e0b' },
    { name: 'Alto Stock (>90d)', value: highStock.length, color: '#10b981' },
  ];

  return (
    <DashboardLayout title="Análisis de Inventario">
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-sm font-medium text-gray-600 mb-1">Total Productos</p>
            <p className="text-3xl font-bold text-gray-900">{stock.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-danger-500">
            <p className="text-sm font-medium text-gray-600 mb-1">Bajo Stock</p>
            <p className="text-3xl font-bold text-danger-600">{lowStock.length}</p>
            <p className="text-xs text-gray-500 mt-1">Menos de 30 días</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-warning-500">
            <p className="text-sm font-medium text-gray-600 mb-1">Stock Medio</p>
            <p className="text-3xl font-bold text-warning-600">{mediumStock.length}</p>
            <p className="text-xs text-gray-500 mt-1">30-90 días</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-success-500">
            <p className="text-sm font-medium text-gray-600 mb-1">Alto Stock</p>
            <p className="text-3xl font-bold text-success-600">{highStock.length}</p>
            <p className="text-xs text-gray-500 mt-1">Más de 90 días</p>
          </div>
        </div>

        {/* Stock Status Chart */}
        <ChartWrapper title="Distribución de Stock por Días de Cobertura">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stockStatusData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" name="Cantidad de Productos">
                {stockStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartWrapper>

        {/* Filters */}
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'all'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Todos ({stock.length})
          </button>
          <button
            onClick={() => setFilter('low')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'low'
                ? 'bg-danger-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Bajo Stock ({lowStock.length})
          </button>
          <button
            onClick={() => setFilter('medium')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'medium'
                ? 'bg-warning-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Stock Medio ({mediumStock.length})
          </button>
          <button
            onClick={() => setFilter('high')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'high'
                ? 'bg-success-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Alto Stock ({highStock.length})
          </button>
        </div>

        {/* Stock Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">
              Detalle de Inventario
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Producto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoría
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock Actual
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ventas 30d
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rotación
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Días Cobertura
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStock.slice(0, 50).map((item: any, idx) => {
                  const dias = item.dias_cobertura || 0;
                  const estado =
                    dias === 0
                      ? { label: 'Sin datos', color: 'bg-gray-100 text-gray-800' }
                      : dias < 30
                      ? { label: 'Bajo', color: 'bg-danger-100 text-danger-800' }
                      : dias < 90
                      ? { label: 'Medio', color: 'bg-warning-100 text-warning-800' }
                      : { label: 'Alto', color: 'bg-success-100 text-success-800' };

                  return (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {item.nombre_producto}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {item.categoria || item.categoria_nivel1 || 'Sin categoría'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                        {(item.stock_actual || 0).toLocaleString('es-CL')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                        {(item.ventas_30d || 0).toLocaleString('es-CL')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                        {item.rotacion_mensual ? item.rotacion_mensual.toFixed(2) : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                        {dias > 0 ? `${Math.round(dias)} días` : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${estado.color}`}
                        >
                          {estado.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {filteredStock.length > 50 && (
            <div className="px-6 py-4 bg-gray-50 text-sm text-gray-600 text-center">
              Mostrando 50 de {filteredStock.length} productos
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
