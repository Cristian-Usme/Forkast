import { Clock, DollarSign, TrendingDown, UtensilsCrossed } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import { monthlySpending } from '@/data/mock/statsData';

export default function DashboardPage() {
  const maxSpending = Math.max(...monthlySpending.map(m => m.amount));

  return (
    <AppLayout showLogout activeNav="stats" contentClassName="pb-24">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl text-[#2C3E2F] mb-2" style={{ fontWeight: 700 }}>Estadísticas</h1>
          <p className="text-[#5A6B5C]">Tus métricas de un vistazo</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-[24px] p-6 shadow-md hover:shadow-lg transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-[#E8F5EE] p-3 rounded-full">
                <Clock size={24} className="text-[#44916F]" />
              </div>
            </div>
            <p className="text-[#5A6B5C] mb-1">Tiempo Promedio</p>
            <p className="text-3xl text-[#2C3E2F]" style={{ fontWeight: 700 }}>24 min</p>
          </div>

          <div className="bg-white rounded-[24px] p-6 shadow-md hover:shadow-lg transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-[#E8F5EE] p-3 rounded-full">
                <DollarSign size={24} className="text-[#44916F]" />
              </div>
            </div>
            <p className="text-[#5A6B5C] mb-1">Esta Semana</p>
            <p className="text-3xl text-[#2C3E2F]" style={{ fontWeight: 700 }}>$52.47</p>
          </div>

          <div className="bg-white rounded-[24px] p-6 shadow-md hover:shadow-lg transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-[#E8F5EE] p-3 rounded-full">
                <TrendingDown size={24} className="text-[#44916F]" />
              </div>
            </div>
            <p className="text-[#5A6B5C] mb-1">Uso Presupuesto</p>
            <p className="text-3xl text-[#2C3E2F]" style={{ fontWeight: 700 }}>52%</p>
          </div>

          <div className="bg-white rounded-[24px] p-6 shadow-md hover:shadow-lg transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-[#E8F5EE] p-3 rounded-full">
                <UtensilsCrossed size={24} className="text-[#44916F]" />
              </div>
            </div>
            <p className="text-[#5A6B5C] mb-1">Comidas Guardadas</p>
            <p className="text-3xl text-[#2C3E2F]" style={{ fontWeight: 700 }}>18</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-[28px] p-8 shadow-md">
            <h2 className="text-[#2C3E2F] mb-6 text-xl" style={{ fontWeight: 600 }}>Gasto Mensual</h2>

            <div className="flex items-end justify-between h-64 gap-6">
              {monthlySpending.map(({ month, amount }) => (
                <div key={month} className="flex-1 flex flex-col items-center gap-3">
                  <div className="w-full rounded-t-2xl relative bg-gradient-to-t from-[#44916F] to-[#5AA67F]" style={{ height: `${(amount / maxSpending) * 100}%`, minHeight: '20%' }}>
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-[#2C3E2F] text-sm" style={{ fontWeight: 600 }}>
                      ${amount}
                    </div>
                  </div>
                  <span className="text-[#5A6B5C] text-sm">{month}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between mt-8 pt-6 border-t border-[#F5F3ED]">
              <span className="text-[#5A6B5C]">Total este mes</span>
              <span className="text-[#2C3E2F] text-2xl" style={{ fontWeight: 700 }}>$220</span>
            </div>
          </div>

          <div className="bg-white rounded-[28px] p-8 shadow-md">
            <h2 className="text-[#2C3E2F] mb-6 text-xl" style={{ fontWeight: 600 }}>Estado del Presupuesto</h2>

            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-3">
                  <span className="text-[#5A6B5C]">Presupuesto Semanal</span>
                  <span className="text-[#2C3E2F]" style={{ fontWeight: 600 }}>$100</span>
                </div>
                <div className="w-full bg-[#F5F3ED] rounded-full h-4">
                  <div className="bg-gradient-to-r from-[#44916F] to-[#5AA67F] h-4 rounded-full transition-all" style={{ width: '52%' }}></div>
                </div>
                <p className="text-[#5A6B5C] mt-3">$52 gastado de $100</p>
              </div>

              <div className="bg-gradient-to-br from-[#E8F5EE] to-[#F5F3ED] rounded-2xl p-6">
                <p className="text-[#2C3E2F] text-lg mb-2" style={{ fontWeight: 600 }}>¡Buen trabajo!</p>
                <p className="text-[#5A6B5C]">Estás $47.53 por debajo del presupuesto esta semana</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-[#F5F3ED] rounded-2xl">
                  <span className="text-[#5A6B5C]">Promedio diario</span>
                  <span className="text-[#2C3E2F]" style={{ fontWeight: 600 }}>$7.50</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-[#F5F3ED] rounded-2xl">
                  <span className="text-[#5A6B5C]">Ahorro proyectado</span>
                  <span className="text-[#44916F]" style={{ fontWeight: 600 }}>$48/semana</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
