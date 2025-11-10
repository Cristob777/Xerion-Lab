'use client';

import { useState } from 'react';
import { getDateRange } from '@/lib/supabase';

interface DateFilterProps {
  onDateChange: (dateFrom: string, dateTo: string) => void;
}

export default function DateFilter({ onDateChange }: DateFilterProps) {
  const [selectedRange, setSelectedRange] = useState<string>('month');

  const ranges = [
    { value: 'today', label: 'Hoy' },
    { value: 'week', label: '7 días' },
    { value: 'month', label: '30 días' },
    { value: 'quarter', label: '90 días' },
    { value: 'year', label: '1 año' },
    { value: 'all', label: 'Todo' },
  ];

  const handleRangeChange = (range: string) => {
    setSelectedRange(range);
    const { start, end } = getDateRange(range as any);
    onDateChange(start, end);
  };

  return (
    <div className="flex items-center gap-2 bg-white rounded-lg shadow px-4 py-2">
      <span className="text-sm font-medium text-gray-700">Período:</span>
      <div className="flex gap-1">
        {ranges.map((range) => (
          <button
            key={range.value}
            onClick={() => handleRangeChange(range.value)}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              selectedRange === range.value
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {range.label}
          </button>
        ))}
      </div>
    </div>
  );
}
