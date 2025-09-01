'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface HeaderProps {
  className?: string;
}

export default function Header({ className = '' }: HeaderProps) {
  return (
    <header className={`bg-primary-700 shadow-lg border-b border-primary-800 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
              className="flex items-center space-x-3"
            >
              <Image
                src="/logo-fciencias.png"
                alt="Facultad de Ciencias UNAM"
                width={120}
                height={35}
                className="h-8 w-auto filter brightness-0 invert"
                priority
              />
              <div className="hidden sm:block">
                <h1 className="text-xl font-heading font-bold text-text-inverse">FcienciasApp</h1>
                <p className="text-xs font-body text-primary-200">Red Social Académica</p>
              </div>
            </motion.div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              href="/dashboard" 
              className="text-text-inverse hover:text-primary-200 px-3 py-2 rounded-md text-sm font-body font-medium transition-colors min-h-[44px] flex items-center"
            >
              📊 Dashboard
            </Link>
            <Link 
              href="/anuncios" 
              className="text-text-inverse hover:text-primary-200 px-3 py-2 rounded-md text-sm font-body font-medium transition-colors min-h-[44px] flex items-center"
            >
              📢 Anuncios
            </Link>
            <Link 
              href="/eventos" 
              className="text-text-inverse hover:text-primary-200 px-3 py-2 rounded-md text-sm font-body font-medium transition-colors min-h-[44px] flex items-center"
            >
              📅 Eventos
            </Link>
            <Link 
              href="/comunidades" 
              className="text-text-inverse hover:text-primary-200 px-3 py-2 rounded-md text-sm font-body font-medium transition-colors min-h-[44px] flex items-center"
            >
              👥 Comunidades
            </Link>
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <Link 
              href="/auth/login"
              className="text-text-inverse hover:text-primary-200 px-4 py-2 rounded-md text-sm font-body font-medium transition-colors min-h-[44px] flex items-center border border-primary-600 hover:border-primary-500"
            >
              Iniciar Sesión
            </Link>
            <Link 
              href="/auth/register"
              className="bg-accent-green-500 hover:bg-accent-green-600 text-white px-6 py-2 rounded-md text-sm font-body font-medium transition-colors min-h-[44px] flex items-center shadow-md hover:shadow-lg"
            >
              Registrarse
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
