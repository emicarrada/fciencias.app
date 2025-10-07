'use client';

import { Sidebar } from '@/components/dashboard/Sidebar';
import { Header } from '@/components/dashboard/Header';
import { FooterNav } from '@/components/dashboard/FooterNav';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Sidebar desktop - fijo a la izquierda */}
      <Sidebar className="hidden md:flex" />

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col md:ml-60">
        {/* Header móvil */}
        <Header className="md:hidden" />
        
        {/* Área principal de contenido */}
        <main className="flex-1 pb-20 md:pb-0 overflow-auto">
          {children}
        </main>
      </div>

      {/* Navegación inferior móvil - fija al fondo */}
      <FooterNav className="md:hidden" />
    </div>
  );
}