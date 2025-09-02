'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-heading font-bold text-white opacity-20">404</h1>
        </div>
        
        <div className="mb-8">
          <h2 className="text-3xl font-heading font-bold text-white mb-4">
            Página no encontrada
          </h2>
          <p className="text-lg font-body text-primary-100 max-w-md mx-auto">
            Lo sentimos, la página que buscas no existe o ha sido movida.
          </p>
        </div>

        <div className="space-y-4">
          <Link href="/">
            <Button variant="primary" size="lg" className="mr-4">
              Volver al Inicio
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="secondary" size="lg">
              Ir al Dashboard
            </Button>
          </Link>
        </div>

        <div className="mt-12 text-primary-200 text-sm">
          <p>¿Necesitas ayuda? Contacta al equipo de soporte.</p>
        </div>
      </div>
    </div>
  );
}
