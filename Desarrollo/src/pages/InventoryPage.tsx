import { Plus, Calendar, AlertCircle } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import { inventoryItems } from '@/data/mock/inventoryData';

export default function InventoryPage() {
  return (
    <AppLayout showLogout activeNav="inventory" contentClassName="pb-24">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl text-[#2C3E2F] mb-2" style={{ fontWeight: 700 }}>Inventario</h1>
            <p className="text-[#5A6B5C]">Gestiona tus alimentos</p>
          </div>
          <button className="bg-[#44916F] hover:bg-[#3A7D5F] p-4 rounded-full shadow-md transition-colors">
            <Plus size={24} className="text-white" />
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {inventoryItems.map(item => (
            <div key={item.id} className={`bg-white rounded-[24px] p-5 shadow-md hover:shadow-lg transition-all ${item.warning ? 'ring-2 ring-red-400/50' : ''}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-[#2C3E2F] text-lg mb-1" style={{ fontWeight: 600 }}>{item.name}</h3>
                  <p className="text-[#5A6B5C]">{item.quantity}</p>
                </div>
                {item.warning && (
                  <AlertCircle size={20} className="text-red-500 flex-shrink-0" />
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar size={14} className="text-[#44916F]" />
                  <div className="flex-1">
                    <p className="text-[#5A6B5C]">Comprado</p>
                    <p className="text-[#2C3E2F]">{item.purchased}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <AlertCircle size={14} className={item.warning ? 'text-red-500' : 'text-[#44916F]'} />
                  <div className="flex-1">
                    <p className="text-[#5A6B5C]">Vence</p>
                    <p className={item.warning ? 'text-red-500' : 'text-[#2C3E2F]'} style={{ fontWeight: item.warning ? 600 : 400 }}>
                      {item.expires}
                    </p>
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
