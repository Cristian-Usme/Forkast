import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router';
import Logo from '@/components/common/Logo';
import { useAuth } from '@/hooks/useAuth';

interface HeaderProps {
  showLogout?: boolean;
}

export default function Header({ showLogout = false }: HeaderProps) {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    const { error } = await signOut();
    if (error) {
      console.error('Failed to sign out:', error);
    }
    navigate('/', { replace: true });
  };

  return (
    <header className="bg-white border-b border-[#E8E5DD] px-6 py-4">
      <div className="max-w-[1600px] mx-auto w-full flex items-center justify-between">
        <Logo size="sm" />

        {showLogout && (
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#F5F3ED] hover:bg-[#E8E5DD] text-[color:var(--brand)] transition-all duration-300 ease-in-out"
          >
            <LogOut size={18} />
            <span className="hidden md:inline">Cerrar sesión</span>
          </button>
        )}
      </div>
    </header>
  );
}
