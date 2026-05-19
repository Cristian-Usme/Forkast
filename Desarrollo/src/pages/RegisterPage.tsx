import { useNavigate } from 'react-router';
import { ArrowLeft, Mail, Lock, User } from 'lucide-react';
import Logo from '@/components/common/Logo';

export default function RegisterPage() {
  const navigate = useNavigate();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/food-profile');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F3ED] to-[#E8E5DD] flex flex-col">
      <div className="p-6">
        <button onClick={() => navigate('/')} className="text-[#44916F] hover:bg-white/50 p-2 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-lg mx-auto">
          <div className="text-center mb-8">
            <Logo size="md" className="justify-center mb-4" />
            <h1 className="text-3xl text-[#2C3E2F] mb-2" style={{ fontWeight: 700 }}>Crear Cuenta</h1>
            <p className="text-[#5A6B5C]">Únete a Forkast y comienza a planificar</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="bg-white rounded-full p-4 flex items-center gap-3 shadow-sm">
              <User size={20} className="text-[#5A6B5C]" />
              <input
                type="text"
                placeholder="Nombre completo"
                className="flex-1 bg-transparent outline-none text-[#2C3E2F]"
                required
              />
            </div>

            <div className="bg-white rounded-full p-4 flex items-center gap-3 shadow-sm">
              <Mail size={20} className="text-[#5A6B5C]" />
              <input
                type="email"
                placeholder="Correo electrónico"
                className="flex-1 bg-transparent outline-none text-[#2C3E2F]"
                required
              />
            </div>

            <div className="bg-white rounded-full p-4 flex items-center gap-3 shadow-sm">
              <Lock size={20} className="text-[#5A6B5C]" />
              <input
                type="password"
                placeholder="Contraseña"
                className="flex-1 bg-transparent outline-none text-[#2C3E2F]"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#44916F] text-white py-4 rounded-full mt-6 shadow-md hover:bg-[#3A7D5F] transition-colors"
              style={{ fontWeight: 600 }}
            >
              Registrarse
            </button>
          </form>

          <p className="text-center text-[#5A6B5C] mt-6">
            ¿Ya tienes cuenta?{' '}
            <button onClick={() => navigate('/login')} className="text-[#44916F]" style={{ fontWeight: 600 }}>
              Inicia sesión
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
