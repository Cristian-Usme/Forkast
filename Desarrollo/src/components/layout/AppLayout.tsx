import type { ReactNode } from 'react';
import type { BottomNavItemId } from '@/types';
import BottomNav from '@/components/layout/BottomNav';
import Header from '@/components/layout/Header';

interface AppLayoutProps {
  children: ReactNode;
  showLogout?: boolean;
  activeNav?: BottomNavItemId;
  contentClassName?: string;
}

export default function AppLayout({
  children,
  showLogout = false,
  activeNav,
  contentClassName = ''
}: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F3ED] to-[#E8E5DD] flex flex-col">
      <Header showLogout={showLogout} />
      <div className={`flex-1 overflow-y-auto ${contentClassName}`}>{children}</div>
      {activeNav ? <BottomNav active={activeNav} /> : null}
    </div>
  );
}
