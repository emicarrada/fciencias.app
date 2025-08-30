'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center">
              <h1 className="text-lg sm:text-xl font-bold text-blue-600">
                FCiencias.app
              </h1>
            </div>
            <nav className="flex space-x-2 sm:space-x-4">
              <Link href="/auth/login">
                <Button variant="outline" size="sm">
                  <span className="hidden sm:inline">Iniciar Sesión</span>
                  <span className="sm:hidden">Login</span>
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button size="sm">
                  <span className="hidden sm:inline">Registrarse</span>
                  <span className="sm:hidden">Registro</span>
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Bienvenido a FCiencias.app
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 max-w-3xl mx-auto">
            La red social académica de la Facultad de Ciencias de la UNAM
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-8 sm:mb-12">
            <Link href="/auth/register">
              <Button size="lg" className="w-full sm:w-auto">
                Únete ahora
              </Button>
            </Link>
            <Link href="/demo-reacciones">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Ver demo
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Anuncios Académicos
              </h3>
              <p className="text-gray-600">
                Mantente al día con avisos importantes de la facultad
              </p>
            </div>
            
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Eventos Estudiantiles
              </h3>
              <p className="text-gray-600">
                Descubre y participa en eventos de la comunidad
              </p>
            </div>
            
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Comunidades
              </h3>
              <p className="text-gray-600">
                Conéctate con grupos estudiantiles y académicos
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
