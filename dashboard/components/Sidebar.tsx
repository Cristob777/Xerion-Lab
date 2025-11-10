'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
  { href: '/', label: 'Dashboard', icon: '📊' },
  { href: '/productos', label: 'Productos', icon: '🏷️' },
  { href: '/clientes', label: 'Clientes', icon: '👥' },
  { href: '/inventario', label: 'Inventario', icon: '📦' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">MISPA</h1>
        <p className="text-sm text-gray-400">Business Intelligence</p>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-8 pt-8 border-t border-gray-700">
        <p className="text-xs text-gray-500">© 2025 Xerion Lab</p>
        <p className="text-xs text-gray-500">Cristóbal Cáceres</p>
      </div>
    </aside>
  );
}
