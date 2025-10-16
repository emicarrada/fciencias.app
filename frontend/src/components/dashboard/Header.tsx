'use client';

import { Bell, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  const pathname = usePathname();
  
  // Mapear rutas a títulos
  const getPageTitle = () => {
    switch (pathname) {
      case '/dashboard/home':
        return 'Inicio';
      case '/dashboard/explore':
        return 'Explorar';
      case '/dashboard/notifications':
        return 'Notificaciones';
      case '/dashboard/profile':
        return 'Perfil';
      default:
        return 'Dashboard';
    }
  };

  return (
    <header className={cn(
      "sticky top-0 z-20 bg-white/70 backdrop-blur-sm border-b border-gray-200 px-4 py-3",
      className
    )}>
      <div className="flex items-center justify-between">
        {/* Logo y título */}
        <div className="flex items-center space-x-3">
          <Image
            src="/logo-fciencias.png"
            alt="FCiencias UNAM"
            width={80}
            height={24}
            className="h-6 w-auto"
          />
          <div className="flex flex-col">
            <span className="text-xs text-gray-500">{getPageTitle()}</span>
          </div>
        </div>

        {/* Acciones del header */}
        <div className="flex items-center space-x-2">
          {/* Notificaciones rápidas */}
          <button className="p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors">
            <Bell size={20} />
          </button>
          
          {/* Menú hamburguesa (futuro) */}
          <button className="p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors">
            <Menu size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}