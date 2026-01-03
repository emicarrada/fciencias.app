'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';

interface HeaderProps {
  className?: string;
}

export default function Header({ className = '' }: HeaderProps) {
  const pathname = usePathname();
  
  // Solo mostrar el header en la landing page
  if (pathname !== '/') {
    return null;
  }
  
  return (
    <header className={`sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100 ${className}`}>
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
        <div className="flex justify-center items-center h-14 sm:h-16">
          {/* Logo Central */}
          <Link href="/">
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
        </div>
      </div>
    </header>
  );
}
