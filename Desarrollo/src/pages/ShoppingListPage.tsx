import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { shoppingItems } from '@/data/mock/shoppingData';

export default function ShoppingListPage() {
  const [checkedItems, setCheckedItems] = useState<number[]>([]);

  const toggleItem = (id: number) => {
    setCheckedItems(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const total = shoppingItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <AppLayout showLogout activeNav="shopping" contentClassName="pb-32">
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl text-[#2C3E2F] mb-2" style={{ fontWeight: 700 }}>Lista de Compras</h1>
            <p className="text-[#5A6B5C]">Todo lo que necesitas esta semana</p>
          </div>

          <div className="hidden md:flex items-center gap-3 bg-white rounded-full p-3 shadow-sm">
            <button className="text-[#5A6B5C] hover:text-[#44916F]">
              <ChevronLeft size={20} />
            </button>
            <span className="text-[#2C3E2F] px-4" style={{ fontWeight: 600 }}>Abr 20 – 26</span>
            <button className="text-[#5A6B5C] hover:text-[#44916F]">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="bg-white rounded-[32px] shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 ease-in-out overflow-hidden mb-6">
          {shoppingItems.map((item, index) => (
            <div
              key={item.id}
              className={`flex items-center justify-between p-5 md:p-6 hover:bg-[#F5F3ED] transition-colors ${
                index !== shoppingItems.length - 1 ? 'border-b border-[#F5F3ED]' : ''
              }`}
            >
              <div className="flex items-center gap-4 flex-1">
                <input
                  type="checkbox"
                  checked={checkedItems.includes(item.id)}
                  onChange={() => toggleItem(item.id)}
                  className="w-6 h-6 rounded-full accent-[#44916F] cursor-pointer"
                />
                <div className="flex-1">
                  <p className={`text-[#2C3E2F] ${checkedItems.includes(item.id) ? 'line-through opacity-50' : ''}`} style={{ fontWeight: 500 }}>
                    {item.name}
                  </p>
                  <p className="text-[#5A6B5C] text-sm">{item.quantity}</p>
                </div>
              </div>
              <span className={`text-[#2C3E2F] text-lg ${checkedItems.includes(item.id) ? 'opacity-50' : ''}`} style={{ fontWeight: 600 }}>
                ${item.price.toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-[#44916F] to-[#3A7D5F] rounded-[28px] p-6 md:p-8 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 ease-in-out">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 mb-1">Costo Total Estimado</p>
              <p className="text-white text-4xl" style={{ fontWeight: 700 }}>${total.toFixed(2)}</p>
            </div>
            <div className="text-white/90 text-right">
              <p className="text-sm">Presupuesto: $100.00</p>
              <p className="text-sm">${(100 - total).toFixed(2)} restante</p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
