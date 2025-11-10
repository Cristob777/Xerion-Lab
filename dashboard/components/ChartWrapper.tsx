'use client';

import { ReactNode } from 'react';

interface ChartWrapperProps {
  title: string;
  children: ReactNode;
  action?: ReactNode;
}

export default function ChartWrapper({ title, children, action }: ChartWrapperProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        {action && <div>{action}</div>}
      </div>
      <div className="w-full">{children}</div>
    </div>
  );
}
