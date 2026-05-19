import { Calendar } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import { inventoryItems } from '@/data/mock/inventoryData';

export default function InventoryPage() {
  return (
    <AppLayout showLogout activeNav="inventory" contentClassName="pb-24">
      <div className="max-w-[1400px] mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl text-[#2C3E2F] mb-2" style={{ fontWeight: 700 }}>Inventario</h1>
            <p className="text-[#5A6B5C]">Gestiona tus alimentos</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {inventoryItems.map(item => (
            <div key={item.id} className="bg-white rounded-[24px] p-5 shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 ease-in-out">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-[#2C3E2F] text-lg mb-1" style={{ fontWeight: 600 }}>{item.name}</h3>
                  <p className="text-[#5A6B5C]">{item.quantity}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar size={14} className="text-[color:var(--brand)]" />
                  <div className="flex-1">
                    <p className="text-[#5A6B5C]">Comprado</p>
                    <p className="text-[#2C3E2F]">{item.purchased}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}