'use client';

import { Home, Search, Bell, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface FooterNavProps {
  className?: string;
}

export function FooterNav({ className }: FooterNavProps) {
  const pathname = usePathname();
  
  const navigationLinks = [
    { 
      href: '/dashboard/home', 
      icon: Home, 
      label: 'Inicio'
    },
    { 
      href: '/dashboard/explore', 
      icon: Search, 
      label: 'Explorar'
    },
    { 
      href: '/dashboard/notifications', 
      icon: Bell, 
      label: 'Notif.'
    },
    { 
      href: '/dashboard/profile', 
      icon: User, 
      label: 'Perfil'
    },
  ];

  return (
    <nav className={cn(
      "fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-30",
      className
    )}>
      <div className="flex justify-around items-center py-2 px-4 safe-area-inset-bottom">
        {navigationLinks.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href;
          
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-1 p-2 rounded-lg transition-all duration-200 min-w-0 flex-1",
                isActive 
                  ? "text-blue-600" 
                  : "text-gray-500 hover:text-gray-700"
              )}
            >
              <div className={cn(
                "p-1.5 rounded-lg transition-colors",
                isActive && "bg-blue-50"
              )}>
                <Icon 
                  size={20} 
                  className={cn(
                    "transition-colors",
                    isActive ? "text-blue-600" : "text-gray-500"
                  )}
                />
              </div>
              <span className={cn(
                "text-xs font-medium truncate",
                isActive ? "text-blue-600" : "text-gray-500"
              )}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}