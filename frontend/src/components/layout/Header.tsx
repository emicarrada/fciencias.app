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
                src="/favicon.png"
                alt="FCiencias.app"
                width={48}
                height={48}
                className="h-12 w-12 rounded"
                priority
              />
            </motion.div>
          </Link>

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
