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
                width={56}
                height={56}
                className="h-14 w-14 rounded"
                priority
              />
            </motion.div>
          </Link>

          {/* User Menu */}
          <div className="flex items-center space-x-8">
            <Link 
              href="/auth/login"
              className="text-white hover:text-[#D59F0F] text-lg font-heading font-semibold transition-colors duration-300 cursor-pointer"
            >
              Iniciar Sesión
            </Link>
            <Link 
              href="/auth/register"
              className="text-white hover:text-accent-green-500 text-lg font-heading font-semibold transition-colors duration-300 cursor-pointer"
            >
              Registrarse
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
