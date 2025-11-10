'use client';

import { formatCurrency, formatNumber, formatPercentage } from '@/lib/supabase';

interface KPICardProps {
  title: string;
  value: number;
  format?: 'currency' | 'number' | 'percentage';
  change?: number;
  icon?: React.ReactNode;
  decimals?: number;
}

export default function KPICard({
  title,
  value,
  format = 'number',
  change,
  icon,
  decimals = 0,
}: KPICardProps) {
  const formatValue = () => {
    switch (format) {
      case 'currency':
        return formatCurrency(value);
      case 'percentage':
        return formatPercentage(value, decimals);
      case 'number':
      default:
        return formatNumber(value, decimals);
    }
  };

  const getChangeColor = () => {
    if (!change) return 'text-gray-600';
    return change >= 0 ? 'text-success-600' : 'text-danger-600';
  };

  const getChangeIcon = () => {
    if (!change) return null;
    return change >= 0 ? '↑' : '↓';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-2">{formatValue()}</p>
          {change !== undefined && (
            <p className={`text-sm font-medium flex items-center gap-1 ${getChangeColor()}`}>
              <span>{getChangeIcon()}</span>
              <span>{formatPercentage(Math.abs(change), 1)}</span>
              <span className="text-gray-500">vs período anterior</span>
            </p>
          )}
        </div>
        {icon && (
          <div className="flex-shrink-0 ml-4 text-primary-500 text-3xl">{icon}</div>
        )}
      </div>
    </div>
  );
}
