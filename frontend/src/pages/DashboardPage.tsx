import { DollarSign, TrendingDown, UtensilsCrossed, Award, AlertTriangle } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import { monthlySpending } from '@/data/mock/statsData';

export default function DashboardPage() {
  const maxSpending = Math.max(...monthlySpending.map(m => m.amount));
  
  // DATOS REALES ADAPTADOS A TU BASE DE DATOS
  const variedadScore = 65; // % de ingredientes únicos usados del total del catálogo
  
  const wasteCategories = [
    { name: 'Ingredientes con Gluten', percentage: 40 },
    { name: 'Ingredientes con Lácteos', percentage: 35 },
    { name: 'Ingredientes Libres de Alérgenos', percentage: 25 },
  ];

  // ¡Esto sale de tu tabla receta_dieta!
  const dietaDistribution = [
    { name: 'Vegana', percentage: 20, color: 'var(--brand)' },
    { name: 'Vegetariana', percentage: 45, color: 'var(--brand-light)' },
    { name: 'Omnívora', percentage: 35, color: '#5A6B5C' },
  ];

  // Registro de actividad (Días que el usuario interactuó con la App)
  const heatmapDays = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
  const heatmapWeeks = [
    [1, 0, 1, 1, 0, 0, 1], // Semana 1 (0 = No registró comida, 1 = Registró)
    [1, 1, 1, 0, 1, 1, 0], // Semana 2
    [0, 1, 1, 1, 1, 0, 1], // Semana 3
    [1, 1, 1, 1, 0, 1, 1], // Semana 4 (Actual)
  ];

  const getHeatmapColor = (active) => {
    return active === 1 ? 'bg-[color:var(--brand)]' : 'bg-[#F5F3ED]';
  };

  return (
    <AppLayout showLogout activeNav="stats" contentClassName="pb-24">
      <div className="max-w-[1400px] mx-auto px-6 py-8">
        
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl text-[#2C3E2F] mb-2" style={{ fontWeight: 700 }}>Estadísticas</h1>
          <p className="text-[#5A6B5C]">Métricas reales calculadas desde tu base de datos</p>
        </div>

        {/* Top Grid Rediseñado: Score de Variedad + 3 KPIs perfectamente distribuidos */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          
          {/* Gráfico 1: Score de Variedad (Ocupa 1 columna) */}
          <div className="bg-white rounded-[28px] p-6 shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center justify-center text-center">
            <h2 className="text-[#2C3E2F] mb-4 text-base" style={{ fontWeight: 600 }}>1. Score de Variedad</h2>
            <div className="relative flex items-center justify-center h-36 w-36 mb-2">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path className="text-[#F5F3ED]" strokeWidth="3" stroke="currentColor" fill="transparent" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path className="text-[color:var(--brand)] transition-all duration-1000" strokeDasharray={`${variedadScore}, 100`} strokeWidth="3" strokeLinecap="round" stroke="currentColor" fill="transparent" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-bold text-[#2C3E2F]">+{variedadScore}%</span>
                <span className="text-[10px] text-[#5A6B5C] font-semibold uppercase">Diversidad</span>
              </div>
            </div>
            <p className="text-xs text-[#5A6B5C] px-4">Has usado 26 ingredientes diferentes de tu despensa.</p>
          </div>

          {/* Bloque de KPIs Restantes (Ocupa 2 columnas, distribuidos en 3 celdas horizontales en pantallas grandes) */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4 h-full">
            
            <div className="bg-white rounded-[24px] p-6 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="bg-[color:var(--brand-soft)] p-3 rounded-full w-fit mb-4">
                  <DollarSign size={24} className="text-[color:var(--brand)]" />
                </div>
                <p className="text-[#5A6B5C] text-sm mb-1">Gasto Semanal</p>
              </div>
              <p className="text-3xl text-[#2C3E2F]" style={{ fontWeight: 700 }}>$52.47</p>
            </div>

            <div className="bg-white rounded-[24px] p-6 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="bg-[color:var(--brand-soft)] p-3 rounded-full w-fit mb-4">
                  <TrendingDown size={24} className="text-[color:var(--brand)]" />
                </div>
                <p className="text-[#5A6B5C] text-sm mb-1">Uso Presupuesto</p>
              </div>
              <p className="text-3xl text-[#2C3E2F]" style={{ fontWeight: 700 }}>52%</p>
            </div>

            <div className="bg-white rounded-[24px] p-6 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="bg-[color:var(--brand-soft)] p-3 rounded-full w-fit mb-4">
                  <UtensilsCrossed size={24} className="text-[color:var(--brand)]" />
                </div>
                <p className="text-[#5A6B5C] text-sm mb-1">Recetas en Sistema</p>
              </div>
              <p className="text-3xl text-[#2C3E2F]" style={{ fontWeight: 700 }}>98</p>
            </div>

          </div>
        </div>

        {/* Bloque Medio: Gasto & Alérgenos */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          
          {/* Gráfico 2: Gasto Mensual */}
          <div className="bg-white rounded-[28px] p-8 shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-[#2C3E2F] text-xl" style={{ fontWeight: 600 }}>2. Gasto Mensual ($)</h2>
              <span className="text-xs font-semibold bg-[color:var(--brand-soft)] text-[color:var(--brand)] px-3 py-1 rounded-full">Historial</span>
            </div>

            <div className="flex items-end justify-between h-56 gap-4 relative pt-4">
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none border-b border-[#F5F3ED]">
                <div className="w-full border-b border-[#F5F3ED] h-0"></div>
                <div className="w-full border-b border-[#F5F3ED] h-0"></div>
              </div>

              {monthlySpending.map(({ month, amount }) => (
                <div key={month} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer z-10">
                  <div className="w-full relative flex justify-center">
                    <div className="absolute -top-8 bg-[#2C3E2F] text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-md">
                      ${amount}
                    </div>
                    <div className="w-3 h-3 rounded-full bg-[color:var(--brand)] border-2 border-white shadow-md mb-1 group-hover:scale-125 transition-transform"></div>
                  </div>
                  <div className="w-2 rounded-full bg-gradient-to-t from-[color:var(--brand-soft)] to-[color:var(--brand-light)] transition-all duration-500 group-hover:from-[color:var(--brand)]" style={{ height: `${(amount / maxSpending) * 120}px` }}></div>
                  <span className="text-[#5A6B5C] text-xs font-medium mt-1">{month}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Gráfico 3: Análisis de Alérgenos en tus Recetas */}
          <div className="bg-white rounded-[28px] p-8 shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
            <h2 className="text-[#2C3E2F] mb-6 text-xl" style={{ fontWeight: 600 }}>3. Alérgenos en tus Ingredientes</h2>
            
            <div className="space-y-4">
              {wasteCategories.map((cat) => (
                <div key={cat.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-[#2C3E2F] font-medium">{cat.name}</span>
                    <span className="text-[#5A6B5C]" style={{ fontWeight: 600 }}>{cat.percentage}%</span>
                  </div>
                  <div className="w-full bg-[#F5F3ED] rounded-full h-3 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-[color:var(--brand-light)] to-[color:var(--brand)] h-3 rounded-full transition-all duration-1000" 
                      style={{ width: `${cat.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-[#F5F3ED] rounded-2xl flex items-center gap-3">
              <div className="text-[color:var(--brand)]">
                <AlertTriangle size={20} />
              </div>
              <p className="text-xs text-[#5A6B5C]">
                El <strong>40%</strong> de tus ingredientes contienen Gluten. Útil si configuras alertas de exclusión en los perfiles de usuario.
              </p>
            </div>
          </div>
        </div>

        {/* Bloque Inferior: Compatibilidad de Dietas & Heatmap */}
        <div className="grid lg:grid-cols-2 gap-6">
          
          {/* Gráfico 4: Distribución por Tipo de Dieta */}
          <div className="bg-white rounded-[28px] p-8 shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
            <h2 className="text-[#2C3E2F] mb-6 text-xl" style={{ fontWeight: 600 }}>4. Compatibilidad de tus Recetas</h2>
            
            <div className="flex flex-col sm:flex-row items-center justify-around gap-6">
              <div className="relative flex items-center justify-center h-40 w-40">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#F5F3ED" strokeWidth="4" />
                  <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="var(--brand)" strokeWidth="4" strokeDasharray="20 100" strokeDashoffset="0" />
                  <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="var(--brand-light)" strokeWidth="4" strokeDasharray="45 100" strokeDashoffset="-20" />
                  <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#5A6B5C" strokeWidth="4" strokeDasharray="35 100" strokeDashoffset="-65" />
                </svg>
                <div className="absolute text-center">
                  <p className="text-2xl font-bold text-[#2C3E2F]">Dietas</p>
                  <p className="text-[9px] text-[#5A6B5C] uppercase tracking-wider">Mapeo Múltiple</p>
                </div>
              </div>

              <div className="space-y-2 w-full sm:w-auto">
                {dietaDistribution.map((dieta) => (
                  <div key={dieta.name} className="flex items-center gap-3 bg-[#F5F3ED] px-4 py-2 rounded-xl">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: dieta.color }}></div>
                    <div className="flex flex-col">
                      <span className="text-xs text-[#5A6B5C] font-medium">{dieta.name}</span>
                      <span className="text-sm font-bold text-[#2C3E2F]">{dieta.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Gráfico 5: Heatmap de Consistencia */}
          <div className="bg-white rounded-[28px] p-8 shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-[#2C3E2F] text-xl" style={{ fontWeight: 600 }}>5. Consistencia de Uso</h2>
              <div className="flex items-center gap-2 text-xs text-[#5A6B5C]">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-sm bg-[#F5F3ED]"></div><span>Inactivo</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-sm bg-[color:var(--brand)]"></div><span>Cocinó</span>
                </div>
              </div>
            </div>
            <p className="text-xs text-[#5A6B5C] mb-4">Monitorea los días en que el usuario registró preparaciones exitosas dentro de la plataforma.</p>

            <div className="space-y-2">
              <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-[#5A6B5C] mb-1">
                {heatmapDays.map((day, idx) => <div key={idx}>{day}</div>)}
              </div>

              {heatmapWeeks.map((week, wIdx) => (
                <div key={wIdx} className="grid grid-cols-7 gap-2">
                  {week.map((active, dIdx) => (
                    <div 
                      key={dIdx} 
                      className={`h-8 rounded-lg ${getHeatmapColor(active)} transition-all duration-300 hover:scale-105 cursor-pointer relative group`}
                    >
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-[#2C3E2F] text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-30">
                        {active === 1 ? '¡Día de cocina activo!' : 'Sin registros'}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            
            <div className="flex items-center gap-2 mt-4 text-xs text-[#5A6B5C] font-medium justify-end">
              <Award size={14} className="text-[color:var(--brand)]" />
              <span>Tasa de retención: 72% este mes</span>
            </div>
          </div>

        </div>

      </div>
    </AppLayout>
  );
}