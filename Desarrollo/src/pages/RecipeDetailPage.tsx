import { useNavigate } from 'react-router';
import { ArrowLeft, Clock, Users, Flame } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';

const ingredients = [
  '2 tazas de vegetales mixtos',
  '1 cucharada de aceite de oliva',
  '2 dientes de ajo picados',
  '1 cucharada de salsa de soja',
  '1 cucharadita de aceite de sésamo',
  'Sal y pimienta al gusto'
];

const steps = [
  'Calentar el aceite de oliva en una sartén grande a fuego medio-alto.',
  'Añadir el ajo y saltear por 30 segundos hasta que esté fragante.',
  'Agregar los vegetales mixtos y saltear por 5-7 minutos.',
  'Añadir la salsa de soja y el aceite de sésamo, mezclar para cubrir.',
  'Sazonar con sal y pimienta. Servir caliente.'
];

export default function RecipeDetailPage() {
  const navigate = useNavigate();

  return (
    <AppLayout showLogout>
      <div className="max-w-4xl mx-auto">
        <div className="relative">
          <div className="w-full h-80 md:h-96 bg-gradient-to-br from-[#E8F5EE] to-[#BFDACC] flex items-center justify-center text-9xl">
            🥗
          </div>
          <button
            onClick={() => navigate('/recommendations')}
            className="absolute top-6 left-6 bg-white/90 hover:bg-white p-3 rounded-full shadow-md transition-colors"
          >
            <ArrowLeft size={24} className="text-[#44916F]" />
          </button>
        </div>

        <div className="px-6 py-8">
          <h1 className="text-4xl text-[#2C3E2F] mb-4" style={{ fontWeight: 700 }}>Salteado de Vegetales</h1>

          <div className="flex flex-wrap gap-6 mb-8">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full">
              <Clock size={20} className="text-[#44916F]" />
              <span className="text-[#5A6B5C]">20 min</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full">
              <Users size={20} className="text-[#44916F]" />
              <span className="text-[#5A6B5C]">2 porciones</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full">
              <Flame size={20} className="text-[#44916F]" />
              <span className="text-[#5A6B5C]">320 kcal</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-[28px] p-6 shadow-md">
              <h2 className="text-[#2C3E2F] mb-4 text-xl" style={{ fontWeight: 600 }}>Ingredientes</h2>
              <ul className="space-y-3">
                {ingredients.map((ingredient, index) => (
                  <li key={index} className="text-[#5A6B5C] flex gap-3">
                    <span className="text-[#44916F] text-xl">•</span>
                    {ingredient}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-[28px] p-6 shadow-md">
              <h2 className="text-[#2C3E2F] mb-4 text-xl" style={{ fontWeight: 600 }}>Preparación</h2>
              <ol className="space-y-4">
                {steps.map((step, index) => (
                  <li key={index} className="text-[#5A6B5C] flex gap-3">
                    <span className="bg-[#44916F] text-white w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ fontWeight: 600 }}>
                      {index + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <button
            onClick={() => navigate('/menu')}
            className="w-full md:w-auto md:px-12 bg-[#44916F] text-white py-4 rounded-full shadow-md hover:bg-[#3A7D5F] transition-colors"
            style={{ fontWeight: 600 }}
          >
            Añadir al menú semanal
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
