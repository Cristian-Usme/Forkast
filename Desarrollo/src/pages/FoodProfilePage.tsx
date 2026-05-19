import { useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import Logo from '@/components/common/Logo';

const dietaryOptions = ['Vegetariano', 'Vegano', 'Sin gluten', 'Sin lácteos', 'Keto', 'Paleo'];

export default function FoodProfilePage() {
  const navigate = useNavigate();
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);

  const togglePreference = (pref: string) => {
    setSelectedPreferences(prev =>
      prev.includes(pref) ? prev.filter(p => p !== pref) : [...prev, pref]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F3ED] to-[#E8E5DD]">
      <div className="p-6 flex items-center gap-4">
        <button onClick={() => navigate('/register')} className="text-[#44916F] hover:bg-white/50 p-2 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </button>
        <Logo size="sm" />
      </div>

      <div className="max-w-4xl mx-auto px-6 pb-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl text-[#2C3E2F] mb-2" style={{ fontWeight: 700 }}>Perfil Alimenticio</h1>
          <p className="text-[#5A6B5C]">¡Bienvenido! Personalicemos tu experiencia</p>
        </div>

        <div className="bg-white rounded-[32px] p-8 shadow-md space-y-6">
          <div>
            <label className="text-[#2C3E2F] mb-3 block text-lg" style={{ fontWeight: 600 }}>Preferencias Dietéticas</label>
            <div className="flex flex-wrap gap-3">
              {dietaryOptions.map(option => (
                <button
                  key={option}
                  onClick={() => togglePreference(option)}
                  className={`px-6 py-3 rounded-full transition-all ${
                    selectedPreferences.includes(option)
                      ? 'bg-[#44916F] text-white shadow-md'
                      : 'bg-[#F5F3ED] text-[#5A6B5C] hover:bg-[#E8E5DD]'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[#2C3E2F] mb-3 block text-lg" style={{ fontWeight: 600 }}>Alergias o Restricciones</label>
            <textarea
              placeholder="Ej: nueces, mariscos..."
              className="w-full bg-[#F5F3ED] rounded-3xl p-4 text-[#2C3E2F] outline-none focus:ring-2 focus:ring-[#44916F]"
              rows={3}
            />
          </div>

          <div>
            <label className="text-[#2C3E2F] mb-3 block text-lg" style={{ fontWeight: 600 }}>Presupuesto Semanal</label>
            <div className="bg-[#F5F3ED] rounded-full p-4">
              <input
                type="number"
                placeholder="$100"
                className="w-full bg-transparent outline-none text-[#2C3E2F]"
              />
            </div>
          </div>

          <div>
            <label className="text-[#2C3E2F] mb-3 block text-lg" style={{ fontWeight: 600 }}>Inventario Actual</label>
            <div className="bg-[#F5F3ED] rounded-full p-4 text-[#5A6B5C]">
              5 artículos en stock
            </div>
          </div>

          <button
            onClick={() => navigate('/recommendations')}
            className="w-full bg-[#44916F] text-white py-4 rounded-full shadow-md hover:bg-[#3A7D5F] transition-colors mt-6"
            style={{ fontWeight: 600 }}
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  );
}
