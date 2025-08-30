'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, router]);

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4 sm:py-6">
            <div className="flex items-center">
              <h1 className="text-xl sm:text-2xl font-bold text-blue-600">FCiencias.app</h1>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <span className="text-sm sm:text-base text-gray-700 hidden sm:inline">
                Hola, {user.firstName} {user.lastName}
              </span>
              <span className="text-sm text-gray-700 sm:hidden">
                {user.firstName}
              </span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <span className="hidden sm:inline">Cerrar sesión</span>
                <span className="sm:hidden">Salir</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="py-4 sm:py-6">
          <div className="border-4 border-dashed border-gray-200 rounded-lg min-h-[400px] sm:min-h-[500px] p-4 sm:p-6">
            <div className="text-center">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                ¡Bienvenido al Dashboard!
              </h2>
              <div className="bg-white rounded-lg shadow p-4 sm:p-6 max-w-md mx-auto mb-6 sm:mb-8">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
                  Información del usuario
                </h3>
                <div className="space-y-2 text-left text-sm sm:text-base">
                  <p><strong>Nombre:</strong> {user.firstName} {user.lastName}</p>
                  <p><strong>Email:</strong> <span className="break-all">{user.email}</span></p>
                  <p><strong>Carrera:</strong> {user.career}</p>
                  {user.semester && <p><strong>Semestre:</strong> {user.semester}°</p>}
                  <p><strong>Rol:</strong> {user.role}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg shadow p-4">
                  <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Anuncios</h4>
                  <p className="text-gray-600 text-xs sm:text-sm">Próximamente...</p>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                  <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Eventos</h4>
                  <p className="text-gray-600 text-xs sm:text-sm">Próximamente...</p>
                </div>
                <div className="bg-white rounded-lg shadow p-4 sm:col-span-2 lg:col-span-1">
                  <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Comunidades</h4>
                  <p className="text-gray-600 text-xs sm:text-sm">Próximamente...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
