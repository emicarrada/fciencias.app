'use client';

import { Home, Search, Bell, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  
  const navigationLinks = [
    { 
      href: '/dashboard/home', 
      icon: Home, 
      label: 'Inicio',
      description: 'Feed principal'
    },
    { 
      href: '/dashboard/explore', 
      icon: Search, 
      label: 'Explorar',
      description: 'Descubre contenido'
    },
    { 
      href: '/dashboard/notifications', 
      icon: Bell, 
      label: 'Notificaciones',
      description: 'Actividad reciente'
    },
    { 
      href: '/dashboard/profile', 
      icon: User, 
      label: 'Perfil',
      description: 'Tu cuenta'
    },
  ];

  return (
    <aside className={cn(
      "fixed left-0 top-0 h-screen w-60 border-r border-gray-200 bg-white flex flex-col justify-between shadow-sm z-30",
      className
    )}>
      <div className="p-6">
        {/* Logo/Brand */}
        <div className="mb-8">
          <Link href="/dashboard/home" className="flex items-center space-x-2">
            <Image
              src="/logo-fciencias.png"
              alt="FCiencias UNAM"
              width={140}
              height={42}
              className="h-8 w-auto"
            />
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col space-y-1">
          {navigationLinks.map(({ href, icon: Icon, label, description }) => {
            const isActive = pathname === href;
            
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                  isActive 
                    ? "bg-blue-50 text-blue-700 font-semibold shadow-sm" 
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <Icon 
                  size={20} 
                  className={cn(
                    "transition-colors",
                    isActive ? "text-blue-600" : "text-gray-500 group-hover:text-gray-700"
                  )}
                />
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{label}</span>
                  {!isActive && (
                    <span className="text-xs text-gray-500 group-hover:text-gray-600">
                      {description}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User section */}
      <div className="p-6 border-t border-gray-100">
        <div className="flex items-center space-x-3 p-3 rounded-xl bg-gray-50">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">U</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">Usuario</p>
            <p className="text-xs text-gray-500 truncate">Facultad de Ciencias</p>
          </div>
        </div>
      </div>
    </aside>
  );
}