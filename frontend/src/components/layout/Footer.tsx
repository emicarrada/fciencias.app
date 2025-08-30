'use client';

import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col items-center justify-center space-y-3 text-center">
          {/* Disclaimer principal */}
          <p className="text-sm text-gray-600 font-medium">
            Red social <span className="font-bold text-red-600">NO supervisada</span> por la UNAM
          </p>
          
          {/* Información del fundador */}
          <p className="text-sm text-gray-500">
            Fundador:{' '}
            <a 
              href="https://emicarrada.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200 hover:underline"
            >
              emicarrada
            </a>
          </p>
          
          {/* Información adicional */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-4 text-xs text-gray-400">
            <span>© 2025 FCiencias.app</span>
            <span className="hidden sm:inline">•</span>
            <span>Hecho con ❤️ para la comunidad de Ciencias</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
