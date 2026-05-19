import { ChevronLeft, ChevronRight, Edit2, Plus } from 'lucide-react';
import { useNavigate } from 'react-router';
import AppLayout from '@/components/layout/AppLayout';
import { daysOfWeek, meals, menuData } from '@/data/mock/menuData';

export default function WeeklyMenuPage() {
  const navigate = useNavigate();

  return (
    <AppLayout showLogout activeNav="menu" contentClassName="pb-24">
      <div className="max-w-[1600px] mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl text-[#2C3E2F] mb-2" style={{ fontWeight: 700 }}>Menú Semanal</h1>
            <p className="text-[#5A6B5C]">Planifica tus comidas</p>
          </div>

          <div className="flex items-center gap-3 bg-white rounded-full p-3 shadow-sm">
            <button className="text-[#5A6B5C] hover:text-[#44916F]">
              <ChevronLeft size={20} />
            </button>
            <span className="text-[#2C3E2F] px-4" style={{ fontWeight: 600 }}>Abr 20 – 26</span>
            <button className="text-[#5A6B5C] hover:text-[#44916F]">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Desktop View - Table Layout */}
        <div className="hidden md:block bg-white rounded-[32px] p-6 shadow-md overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="p-4 text-left text-[#5A6B5C]"></th>
                {daysOfWeek.map(day => (
                  <th key={day} className="p-4 text-center text-[#2C3E2F]" style={{ fontWeight: 600 }}>
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {meals.map(meal => (
                <tr key={meal} className="border-t border-[#F5F3ED]">
                  <td className="p-4 text-[#2C3E2F]" style={{ fontWeight: 600 }}>{meal}</td>
                  {daysOfWeek.map(day => {
                    const mealData = menuData[day][meal];
                    return (
                      <td key={`${day}-${meal}`} className="p-2">
                        {mealData ? (
                          <div className="min-h-[140px] bg-gradient-to-br from-[#E8F5EE] to-[#F5F3ED] rounded-[20px] p-4 relative group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 ease-in-out">
                            <div className="text-5xl text-center mb-2">{mealData.image}</div>
                            <p className="text-[#2C3E2F] text-center text-sm mb-1" style={{ fontWeight: 600 }}>
                              {mealData.name}
                            </p>
                            <p className="text-[#5A6B5C] text-center text-xs">{mealData.calories}</p>
                            <button className="absolute top-2 right-2 bg-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                              <Edit2 size={14} className="text-[#44916F]" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => navigate('/recommendations')}
                            className="w-full min-h-[140px] bg-[#F5F3ED] hover:bg-[#E8E5DD] rounded-[20px] flex flex-col items-center justify-center transition-all duration-300 ease-in-out"
                          >
                            <Plus size={24} className="text-[#44916F] mb-1" />
                            <span className="text-[#5A6B5C] text-xs">Añadir</span>
                          </button>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View - Card Layout */}
        <div className="md:hidden space-y-4">
          {daysOfWeek.map(day => (
            <div key={day} className="bg-white rounded-[24px] p-5 shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 ease-in-out">
              <h3 className="text-[#2C3E2F] mb-4 text-lg" style={{ fontWeight: 600 }}>{day}</h3>

              <div className="space-y-3">
                {meals.map(meal => {
                  const mealData = menuData[day][meal];
                  return (
                    <div key={meal} className="flex items-center justify-between">
                      <span className="text-[#5A6B5C]">{meal}</span>
                      {mealData ? (
                        <div className="flex items-center gap-2 bg-[#F5F3ED] px-4 py-2 rounded-full">
                          <span className="text-xl">{mealData.image}</span>
                          <span className="text-[#2C3E2F]">{mealData.name}</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => navigate('/recommendations')}
                          className="flex items-center gap-1 text-[#44916F]"
                        >
                          <Plus size={18} />
                          <span>Añadir</span>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => navigate('/shopping')}
          className="w-full md:w-auto md:px-12 bg-[#44916F] text-white py-4 rounded-full shadow-md hover:bg-[#3A7D5F] transition-colors mt-8"
          style={{ fontWeight: 600 }}
        >
          Generar Lista de Compras
        </button>
      </div>
    </AppLayout>
  );
}
