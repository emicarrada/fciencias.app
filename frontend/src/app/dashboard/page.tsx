'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Loader from '@/components/ui/Loader';
import { useAuthStore } from '@/store/authStore';

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    
    // Redirigir automáticamente al feed
    router.push('/feed');
  }, [isAuthenticated, router]);

  // Mostrar loading mientras redirige
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <Loader size={48} />
        <p className="mt-4 text-gray-600">Cargando dashboard...</p>
      </div>
    </div>
  );
}
