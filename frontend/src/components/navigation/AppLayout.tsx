'use client';

import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

export default function AppLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // Determinar si estamos en una ruta de la app principal
  const isAppRoute = pathname?.startsWith('/feed') || 
                     pathname?.startsWith('/perfil') || 
                     pathname?.startsWith('/tienda') || 
                     pathname?.startsWith('/publicar') ||
                     pathname?.startsWith('/dashboard') ||
                     pathname?.startsWith('/anuncios') ||
                     pathname?.startsWith('/comunidades') ||
                     pathname?.startsWith('/eventos');

  return (
    <div className={`min-h-screen flex flex-col ${isAppRoute ? 'md:ml-64 pb-20 md:pb-0' : ''}`}>
      {children}
    </div>
  );
}
