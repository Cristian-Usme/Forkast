import { useNavigate } from 'react-router';
import { Home, Calendar, ShoppingCart, Package, BarChart3 } from 'lucide-react';
import type { BottomNavProps } from '@/types';

export default function BottomNav({ active }: BottomNavProps) {
  const navigate = useNavigate();

  const navItems = [
    { id: 'home', icon: Home, label: 'Inicio', path: '/recommendations' },
    { id: 'menu', icon: Calendar, label: 'Menú', path: '/menu' },
    { id: 'shopping', icon: ShoppingCart, label: 'Compras', path: '/shopping' },
    { id: 'inventory', icon: Package, label: 'Inventario', path: '/inventory' },
    { id: 'stats', icon: BarChart3, label: 'Estadísticas', path: '/stats' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-[#E8E5DD] px-4 py-3 z-50">
      <div className="flex items-center justify-between max-w-[1400px] mx-auto">
        {navItems.map(({ id, icon: Icon, label, path }) => (
          <button
            key={id}
            onClick={() => navigate(path)}
            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-2xl hover:bg-[#F5F3ED] transition-colors ${
              active === id ? 'text-[color:var(--brand)]' : 'text-[#5A6B5C]'
            }`}
          >
            <Icon size={24} className={active === id ? 'text-[color:var(--brand)]' : 'text-[#5A6B5C]'} />
            <span className="text-xs">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
