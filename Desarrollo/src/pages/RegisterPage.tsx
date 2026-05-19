import { useNavigate } from 'react-router';
import { ArrowLeft, Mail, Lock, User } from 'lucide-react';
import { useState } from 'react';
import Logo from '@/components/common/Logo';
import wallpaperGreen from '@/assets/images/wallpaper_green.svg';
import { useAuth } from '@/hooks/useAuth';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    const { error, needsEmailConfirmation } = await signUp(email, password, nombre);

    if (error) {
      setErrorMessage(error.message);
      setIsSubmitting(false);
      return;
    }

    if (needsEmailConfirmation) {
      navigate('/login', {
        state: {
          message: 'Cuenta creada. Revisa tu correo para confirmar y luego inicia sesion.',
        },
      });
      return;
    }

    navigate('/food-profile');
  };

  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col">
      <div
        className="absolute inset-0 bg-[#E8E5DD] bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${wallpaperGreen})` }}
      />
      <div className="absolute inset-0 backdrop-blur-sm bg-white/10" />
      <div className="relative z-10 p-6">
        <button onClick={() => navigate('/')} className="text-[color:var(--brand)] hover:bg-white/50 p-2 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </button>
      </div>

      <div className="relative z-10 flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-lg mx-auto">
          <div className="bg-white/70 backdrop-blur-lg border border-white/70 rounded-[32px] p-6 md:p-8 shadow-[0_24px_60px_-36px_rgba(44,81,54,0.6)]">
            <div className="text-center mb-8">
              <Logo size="md" className="justify-center mb-4" />
              <h1 className="text-3xl text-[#2C3E2F] mb-2" style={{ fontWeight: 700 }}>Crear Cuenta</h1>
              <p className="text-[#5A6B5C]">Únete a Forkast y comienza a planificar</p>
            </div>

            {errorMessage ? (
              <div className="bg-red-50 text-red-700 px-4 py-3 rounded-2xl text-sm shadow-sm">
                {errorMessage}
              </div>
            ) : null}

            <form onSubmit={handleRegister} className="space-y-4">
              <div className="bg-white rounded-full p-4 flex items-center gap-3 shadow-sm focus-within:ring-2 focus-within:ring-[color:var(--brand)]">
                <User size={20} className="text-[#5A6B5C]" />
                <input
                  type="text"
                  placeholder="Nombre completo"
                  className="flex-1 bg-transparent outline-none text-[#2C3E2F]"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                />
              </div>

              <div className="bg-white rounded-full p-4 flex items-center gap-3 shadow-sm focus-within:ring-2 focus-within:ring-[color:var(--brand)]">
                <Mail size={20} className="text-[#5A6B5C]" />
                <input
                  type="email"
                  placeholder="Correo electronico"
                  className="flex-1 bg-transparent outline-none text-[#2C3E2F]"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="bg-white rounded-full p-4 flex items-center gap-3 shadow-sm focus-within:ring-2 focus-within:ring-[color:var(--brand)]">
                <Lock size={20} className="text-[#5A6B5C]" />
                <input
                  type="password"
                  placeholder="Contrasena"
                  className="flex-1 bg-transparent outline-none text-[#2C3E2F]"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[color:var(--brand)] text-white py-4 rounded-full mt-6 shadow-md hover:bg-[color:var(--brand-dark)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F5F3ED]"
                style={{ fontWeight: 600 }}
              >
                {isSubmitting ? 'Creando cuenta...' : 'Registrarse'}
              </button>
            </form>

            <p className="text-center text-[#5A6B5C] mt-6">
              ¿Ya tienes cuenta?{' '}
              <button onClick={() => navigate('/login')} className="text-[color:var(--brand)]" style={{ fontWeight: 600 }}>
                Inicia sesión
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
