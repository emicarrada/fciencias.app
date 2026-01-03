'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function BottomNav() {
  const pathname = usePathname();

  // Solo mostrar navbar en rutas de la app principal
  const shouldShowNav = pathname?.startsWith('/feed') || 
                        pathname?.startsWith('/perfil') || 
                        pathname?.startsWith('/tienda') || 
                        pathname?.startsWith('/publicar') ||
                        pathname?.startsWith('/dashboard') ||
                        pathname?.startsWith('/anuncios') ||
                        pathname?.startsWith('/comunidades') ||
                        pathname?.startsWith('/eventos');

  if (!shouldShowNav) {
    return null;
  }

  const navItems = [
    {
      name: 'Inicio',
      href: '/feed',
      icon: '/icons/icons8-home-liquid-glass/icons8-home-48.png',
    },
    {
      name: 'Tienda',
      href: '/tienda',
      icon: '/icons/icons8-store-liquid-glass/icons8-store-48.png',
    },
    {
      name: 'Publicar',
      href: '/publicar',
      icon: '/icons/icons8-plus-liquid-glass/icons8-plus-48.png',
    },
    {
      name: 'Perfil',
      href: '/perfil',
      icon: '/icons/icons8-profile-liquid-glass/icons8-profile-48.png',
    },
  ];

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className="flex flex-col items-center justify-center flex-1 h-full relative"
              >
                <Image
                  src={item.icon}
                  alt={item.name}
                  width={28}
                  height={28}
                  className={isActive ? 'opacity-100' : 'opacity-60'}
                />
                {/* Active indicator bar */}
                {isActive && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-blue-600 rounded-b-full" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Desktop Side Navigation */}
      <nav className="hidden md:flex fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 shadow-lg z-50 flex-col py-8 px-4">
        <div className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 font-semibold'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Image
                  src={item.icon}
                  alt={item.name}
                  width={24}
                  height={24}
                  className={isActive ? 'opacity-100' : 'opacity-70'}
                />
                <span className="text-base">{item.name}</span>
                {/* Active indicator bar */}
                {isActive && (
                  <div className="ml-auto w-1 h-8 bg-blue-600 rounded-full" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
