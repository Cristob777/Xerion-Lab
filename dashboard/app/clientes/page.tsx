'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import ChartWrapper from '@/components/ChartWrapper';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import type { SegmentacionRFM, DimCliente } from '@/types/database.types';

const SEGMENT_COLORS: Record<string, string> = {
  Champions: '#10b981',
  'Loyal Customers': '#0ea5e9',
  'Potential Loyalist': '#8b5cf6',
  'Recent Customers': '#f59e0b',
  'At Risk': '#ef4444',
  'Need Attention': '#f97316',
  'About to Sleep': '#dc2626',
  'Hibernating': '#991b1b',
  'Lost': '#7f1d1d',
};

export default function ClientesPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [clientes, setClientes] = useState<(SegmentacionRFM | DimCliente)[]>([]);
  const [selectedSegment, setSelectedSegment] = useState<string>('Todos');

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/clientes/segmentacion');
      if (!response.ok) throw new Error('Error al cargar clientes');

      const data = await response.json();
      setClientes(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar clientes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading && clientes.length === 0) {
    return (
      <DashboardLayout title="Análisis de Clientes">
        <LoadingSpinner size="lg" />
      </DashboardLayout>
    );
  }

  if (error && clientes.length === 0) {
    return (
      <DashboardLayout title="Análisis de Clientes">
        <ErrorMessage message={error} retry={fetchData} />
      </DashboardLayout>
    );
  }

  // Calculate segment distribution
  const segmentMap = new Map<string, { count: number; total: number }>();
  clientes.forEach((cliente: any) => {
    const segment = cliente.segmento || cliente.segmento_rfm || 'Sin Segmento';
    if (!segmentMap.has(segment)) {
      segmentMap.set(segment, { count: 0, total: 0 });
    }
    const seg = segmentMap.get(segment)!;
    seg.count += 1;
    seg.total += cliente.total_gastado || cliente.total_compras || 0;
  });

  const segmentData = Array.from(segmentMap.entries()).map(([name, data]) => ({
    name,
    value: data.count,
    total: data.total,
  })).sort((a, b) => b.value - a.value);

  const filteredClientes =
    selectedSegment === 'Todos'
      ? clientes
      : clientes.filter((c: any) => (c.segmento || c.segmento_rfm) === selectedSegment);

  const totalClientes = clientes.length;
  const totalCompras = clientes.reduce(
    (sum, c: any) => sum + (c.total_gastado || c.total_compras || 0),
    0
  );
  const ticketPromedio = totalClientes > 0 ? totalCompras / totalClientes : 0;

  return (
    <DashboardLayout title="Análisis de Clientes">
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-sm font-medium text-gray-600 mb-1">Total Clientes</p>
            <p className="text-3xl font-bold text-gray-900">{totalClientes}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-sm font-medium text-gray-600 mb-1">Compras Totales</p>
            <p className="text-3xl font-bold text-gray-900">
              {new Intl.NumberFormat('es-CL', {
                style: 'currency',
                currency: 'CLP',
                minimumFractionDigits: 0,
              }).format(totalCompras)}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-sm font-medium text-gray-600 mb-1">Ticket Promedio</p>
            <p className="text-3xl font-bold text-gray-900">
              {new Intl.NumberFormat('es-CL', {
                style: 'currency',
                currency: 'CLP',
                minimumFractionDigits: 0,
              }).format(ticketPromedio)}
            </p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Segment Distribution */}
          <ChartWrapper title="Distribución por Segmento">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={segmentData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name} (${entry.value})`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {segmentData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={SEGMENT_COLORS[entry.name] || '#6b7280'}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartWrapper>

          {/* Segment Value */}
          <ChartWrapper title="Valor por Segmento">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={segmentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={100} />
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
                <Bar dataKey="total" fill="#0ea5e9" name="Valor Total" />
              </BarChart>
            </ResponsiveContainer>
          </ChartWrapper>
        </div>

        {/* Segment Filters */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setSelectedSegment('Todos')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedSegment === 'Todos'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Todos ({totalClientes})
          </button>
          {segmentData.map((seg) => (
            <button
              key={seg.name}
              onClick={() => setSelectedSegment(seg.name)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedSegment === seg.name
                  ? 'text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
              style={{
                backgroundColor:
                  selectedSegment === seg.name ? SEGMENT_COLORS[seg.name] || '#6b7280' : undefined,
              }}
            >
              {seg.name} ({seg.value})
            </button>
          ))}
        </div>

        {/* Clients Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">
              Detalle de Clientes {selectedSegment !== 'Todos' && `- ${selectedSegment}`}
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Segmento
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Gastado
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Órdenes
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ticket Prom.
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    RFM Score
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredClientes.slice(0, 50).map((cliente: any, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {cliente.nombre_cliente || cliente.nombre || `Cliente ${cliente.client_id}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className="px-2 py-1 rounded-full text-xs font-medium text-white"
                        style={{
                          backgroundColor:
                            SEGMENT_COLORS[cliente.segmento || cliente.segmento_rfm || ''] || '#6b7280',
                        }}
                      >
                        {cliente.segmento || cliente.segmento_rfm || 'Sin Segmento'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      {new Intl.NumberFormat('es-CL', {
                        style: 'currency',
                        currency: 'CLP',
                        minimumFractionDigits: 0,
                      }).format(cliente.total_gastado || cliente.total_compras || 0)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      {cliente.total_ordenes || cliente.cantidad_ordenes || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      {new Intl.NumberFormat('es-CL', {
                        style: 'currency',
                        currency: 'CLP',
                        minimumFractionDigits: 0,
                      }).format(cliente.ticket_promedio || 0)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      {cliente.rfm_score || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredClientes.length > 50 && (
            <div className="px-6 py-4 bg-gray-50 text-sm text-gray-600 text-center">
              Mostrando 50 de {filteredClientes.length} clientes
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
