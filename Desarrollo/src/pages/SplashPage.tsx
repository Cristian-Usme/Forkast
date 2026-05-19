import { useNavigate } from 'react-router';
import Logo from '@/components/common/Logo';

export default function SplashPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F3ED] to-[#E8E5DD] flex flex-col items-center justify-center px-6">
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-lg mx-auto">
        <div className="bg-white rounded-[32px] p-12 mb-8 shadow-lg">
          <Logo size="lg" />
        </div>
        <p className="text-[#5A6B5C] text-center text-lg max-w-md">
          Tu asistente personal de planificación de comidas
        </p>
      </div>

      <div className="w-full max-w-lg mx-auto space-y-4 pb-12">
        <button
          onClick={() => navigate('/register')}
          className="w-full bg-[#44916F] text-white py-4 rounded-full shadow-md hover:bg-[#3A7D5F] transition-colors"
          style={{ fontWeight: 600 }}
        >
          Crear cuenta
        </button>
        <button
          onClick={() => navigate('/login')}
          className="w-full bg-white text-[#44916F] py-4 rounded-full border-2 border-[#44916F] hover:bg-[#F5F3ED] transition-colors"
          style={{ fontWeight: 600 }}
        >
          Iniciar sesión
        </button>
      </div>
    </div>
  );
}
