import { useNavigate } from 'react-router';
import { Clock, DollarSign } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';

const recipes = [
  { id: 1, name: 'Salteado de Vegetales', time: '20 min', cost: '$8', calories: '320 kcal', image: '🥗' },
  { id: 2, name: 'Salmón a la Parrilla', time: '25 min', cost: '$12', calories: '450 kcal', image: '🐟' },
  { id: 3, name: 'Pasta Primavera', time: '30 min', cost: '$7', calories: '380 kcal', image: '🍝' },
  { id: 4, name: 'Tacos de Pollo', time: '15 min', cost: '$9', calories: '410 kcal', image: '🌮' },
  { id: 5, name: 'Bowl Buddha', time: '20 min', cost: '$10', calories: '395 kcal', image: '🥙' },
  { id: 6, name: 'Ensalada César', time: '10 min', cost: '$6', calories: '280 kcal', image: '🥗' },
];

const filters = ['Todos', 'Rápido', 'Económico', 'Saludable', 'Popular'];

export default function RecommendationsPage() {
  const navigate = useNavigate();

  return (
    <AppLayout showLogout activeNav="home" contentClassName="pb-24">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl text-[#2C3E2F] mb-2" style={{ fontWeight: 700 }}>Recomendaciones Semanales</h1>
          <p className="text-[#5A6B5C]">Personalizadas para ti</p>
        </div>

        <div className="mb-6">
          <div className="flex gap-3 overflow-x-auto pb-2">
            {filters.map(filter => (
              <button
                key={filter}
                className={`px-6 py-3 rounded-full whitespace-nowrap transition-all ${
                  filter === 'Todos'
                    ? 'bg-[#44916F] text-white shadow-md'
                    : 'bg-white text-[#5A6B5C] hover:bg-[#E8E5DD]'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map(recipe => (
            <div
              key={recipe.id}
              className="bg-white rounded-[28px] p-6 shadow-md hover:shadow-lg transition-all cursor-pointer"
              onClick={() => navigate('/recipe/1')}
            >
              <div className="w-full aspect-square bg-gradient-to-br from-[#E8F5EE] to-[#F5F3ED] rounded-[24px] flex items-center justify-center text-7xl mb-4">
                {recipe.image}
              </div>
              <h3 className="text-[#2C3E2F] mb-3 text-xl" style={{ fontWeight: 600 }}>{recipe.name}</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-[#F5F3ED] text-[#5A6B5C] px-3 py-1 rounded-full text-sm">{recipe.calories}</span>
              </div>
              <div className="flex items-center justify-between text-[#5A6B5C] mb-4">
                <div className="flex items-center gap-1">
                  <Clock size={16} />
                  <span>{recipe.time}</span>
                </div>
                <div className="flex items-center gap-1">
                  <DollarSign size={16} />
                  <span>{recipe.cost}</span>
                </div>
              </div>
              <button className="w-full bg-[#44916F] text-white py-3 rounded-full hover:bg-[#3A7D5F] transition-colors">
                Añadir al menú
              </button>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
