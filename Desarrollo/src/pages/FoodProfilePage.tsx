import { useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import Logo from '@/components/common/Logo';
import wallpaperGreen from '@/assets/images/wallpaper_green.svg';

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
    <div className="relative min-h-screen overflow-hidden">
      <div
        className="absolute inset-0 bg-[#E8E5DD] bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${wallpaperGreen})` }}
      />
      <div className="absolute inset-0 backdrop-blur-sm bg-white/10" />
      <div className="relative z-10 p-6 flex items-center gap-4">
        <button onClick={() => navigate('/register')} className="text-[color:var(--brand)] hover:bg-white/50 p-2 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </button>
        <div className="rounded-2xl bg-white border border-white/70 px-4 py-2 shadow-sm">
          <Logo size="sm" />
        </div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 pb-12">
        <div className="text-center mb-8">
          <div className="inline-block rounded-[30px] bg-white border border-white/70 px-9 py-6 shadow-sm">
            <h1 className="text-3xl text-[#2C3E2F] mb-2" style={{ fontWeight: 700 }}>Perfil Alimenticio</h1>
            <p className="text-[#5A6B5C]">¡Bienvenido! Personalicemos tu experiencia</p>
          </div>
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
                      ? 'bg-[color:var(--brand)] text-white shadow-md'
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
              className="w-full bg-[#F5F3ED] rounded-3xl p-4 text-[#2C3E2F] outline-none focus:ring-2 focus:ring-[color:var(--brand)]"
              rows={3}
            />
          </div>

          <div>
            <label className="text-[#2C3E2F] mb-3 block text-lg" style={{ fontWeight: 600 }}>Presupuesto Semanal</label>
            <div className="bg-[#F5F3ED] rounded-full p-4 focus-within:ring-2 focus-within:ring-[color:var(--brand)]">
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
            className="w-full bg-[color:var(--brand)] text-white py-4 rounded-full shadow-md hover:bg-[color:var(--brand-dark)] transition-colors mt-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F5F3ED]"
            style={{ fontWeight: 600 }}
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  );
}
