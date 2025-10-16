'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface HeaderProps {
  className?: string;
}

export default function Header({ className = '' }: HeaderProps) {
  return (
    <header className={`sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100 ${className}`}>
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Espacio izquierdo */}
          <div className="w-32"></div>

          {/* Logo Central */}
          <Link href="/" className="absolute left-1/2 transform -translate-x-1/2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Image
                src="/logofciez.png"
                alt="FCiencias UNAM"
                width={220}
                height={124}
                className="h-16 w-auto"
                priority
              />
            </motion.div>
          </Link>

          {/* Botón Entrar */}
          <Link 
            href="/auth/login"
            className="flex items-center justify-center"
            aria-label="Iniciar sesión"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200"
            >
              Entrar
            </motion.div>
          </Link>
        </div>
      </div>
    </header>
  );
}
