'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import ChartWrapper from '@/components/ChartWrapper';
import DateFilter from '@/components/DateFilter';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { TopProducto, VentasPorCategoria } from '@/types/database.types';

export default function ProductosPage() {
  const [dateFrom, setDateFrom] = useState('2020-01-01');
  const [dateTo, setDateTo] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [topProductos, setTopProductos] = useState<TopProducto[]>([]);
  const [categorias, setCategorias] = useState<VentasPorCategoria[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [topProductosRes, categoriasRes] = await Promise.all([
        fetch(`/api/productos/top?dateFrom=${dateFrom}&dateTo=${dateTo}&limit=20`),
        fetch(`/api/ventas/categorias?dateFrom=${dateFrom}&dateTo=${dateTo}`),
      ]);

      if (!topProductosRes.ok || !categoriasRes.ok) {
        throw new Error('Error al cargar productos');
      }

      const [topProductosData, categoriasData] = await Promise.all([
        topProductosRes.json(),
        categoriasRes.json(),
      ]);

      setTopProductos(topProductosData);
      setCategorias(categoriasData);
    } catch (err: any) {
      setError(err.message || 'Error al cargar productos');
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

  const filteredProducts =
    selectedCategory === 'Todas'
      ? topProductos
      : topProductos.filter((p) => p.categoria === selectedCategory);

  if (loading && topProductos.length === 0) {
    return (
      <DashboardLayout title="Análisis de Productos">
        <LoadingSpinner size="lg" />
      </DashboardLayout>
    );
  }

  if (error && topProductos.length === 0) {
    return (
      <DashboardLayout title="Análisis de Productos">
        <ErrorMessage message={error} retry={fetchData} />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Análisis de Productos">
      <div className="space-y-6">
        {/* Filters */}
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedCategory('Todas')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === 'Todas'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Todas
            </button>
            {categorias.map((cat) => (
              <button
                key={cat.categoria}
                onClick={() => setSelectedCategory(cat.categoria)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === cat.categoria
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {cat.categoria}
              </button>
            ))}
          </div>
          <DateFilter onDateChange={handleDateChange} />
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-sm font-medium text-gray-600 mb-1">Total Productos</p>
            <p className="text-3xl font-bold text-gray-900">{filteredProducts.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-sm font-medium text-gray-600 mb-1">Ventas Totales</p>
            <p className="text-3xl font-bold text-gray-900">
              {new Intl.NumberFormat('es-CL', {
                style: 'currency',
                currency: 'CLP',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(filteredProducts.reduce((sum, p) => sum + p.total_ventas, 0))}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-sm font-medium text-gray-600 mb-1">Transacciones</p>
            <p className="text-3xl font-bold text-gray-900">
              {filteredProducts.reduce((sum, p) => sum + p.transacciones, 0).toLocaleString('es-CL')}
            </p>
          </div>
        </div>

        {/* Top Products Chart */}
        <ChartWrapper title="Top 20 Productos por Ventas">
          <ResponsiveContainer width="100%" height={500}>
            <BarChart data={filteredProducts.slice(0, 20)} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis
                type="category"
                dataKey="nombre_producto"
                width={200}
                tick={{ fontSize: 10 }}
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
              <Bar dataKey="total_ventas" fill="#0ea5e9" name="Ventas" />
            </BarChart>
          </ResponsiveContainer>
        </ChartWrapper>

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">
              Detalle de Productos {selectedCategory !== 'Todas' && `- ${selectedCategory}`}
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
                    Ventas
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cantidad
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transacciones
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ticket Prom.
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((producto, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {producto.nombre_producto}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {producto.categoria || 'Sin categoría'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      {new Intl.NumberFormat('es-CL', {
                        style: 'currency',
                        currency: 'CLP',
                        minimumFractionDigits: 0,
                      }).format(producto.total_ventas)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      {producto.cantidad_vendida.toLocaleString('es-CL')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      {producto.transacciones.toLocaleString('es-CL')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      {new Intl.NumberFormat('es-CL', {
                        style: 'currency',
                        currency: 'CLP',
                        minimumFractionDigits: 0,
                      }).format(producto.ticket_promedio)}
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
