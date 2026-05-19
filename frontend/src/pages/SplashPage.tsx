import { useNavigate } from 'react-router';
import Logo from '@/components/common/Logo';
import wallpaperGreen from '@/assets/images/wallpaper_green.svg';

export default function SplashPage() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center px-6">
      <div
        className="absolute inset-0 bg-[#E8E5DD] bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${wallpaperGreen})` }}
      />
      <div className="absolute inset-0 backdrop-blur-sm bg-white/10" />
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center w-full max-w-lg mx-auto">
        <div className="w-full rounded-[32px] bg-white/70 backdrop-blur-lg border border-white/70 p-10 md:p-12 shadow-[0_24px_60px_-36px_rgba(44,81,54,0.6)]">
          <div className="flex items-center justify-center mb-6">
            <Logo size="lg" />
          </div>
          <p className="text-[#5A6B5C] text-center text-lg max-w-md mx-auto">
            Tu asistente personal de planificación de comidas
          </p>
          <br />
          <br />
          <div className="relative z-10 w-full max-w-lg mx-auto space-y-4 pb-12">
            <button
              onClick={() => navigate('/register')}
              className="w-full bg-[color:var(--brand)] text-white py-4 rounded-full shadow-md hover:bg-[color:var(--brand-dark)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F5F3ED]"
              style={{ fontWeight: 600 }}
            >
              Crear cuenta
            </button>
            <button
              onClick={() => navigate('/login')}
              className="w-full bg-white text-[color:var(--brand)] py-4 rounded-full border-2 border-[color:var(--brand)] hover:bg-[#F5F3ED] transition-colors"
              style={{ fontWeight: 600 }}
            >
              Iniciar sesión
            </button>
          </div>
        </div>
      </div>


    </div>
  );
}
