'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
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
    <div className="min-h-screen bg-secondary-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden" style={{ backgroundColor: '#041737' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
          <div className="text-center">
            {/* Imagen Principal */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
              <Image
                src="/fciencias - manual de marca.png"
                alt="FCiencias - Manual de Marca"
                width={500}
                height={334}
                className="mx-auto h-24 sm:h-32 md:h-40 lg:h-48 xl:h-56 w-auto max-w-full"
                priority
                unoptimized
              />
            </motion.div>

            {/* Texto Principal */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-2xl sm:text-3xl lg:text-5xl font-heading font-bold text-text-inverse mb-6"
            >
              La red social de la Facultad de Ciencias UNAM
            </motion.h1>

            {/* Botones de acción */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-12"
            >
              <Link href="/auth/register">
                <Button size="lg" className="w-full sm:w-auto px-8 py-3 text-lg bg-accent-green-500 hover:bg-accent-green-600 text-white border-0 shadow-lg hover:shadow-xl min-h-[44px]">
                  🚀 Únete ahora
                </Button>
              </Link>
              <Link href="/demo-reacciones">
                <Button variant="outline" size="lg" className="w-full sm:w-auto px-8 py-3 text-lg border-2 border-primary-200 text-text-inverse hover:bg-primary-600 hover:border-primary-600 min-h-[44px]">
                  👀 Ver demo
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-text-primary mb-4">
              Conecta con tu comunidad académica
            </h2>
            <p className="text-lg text-text-muted max-w-2xl mx-auto font-body">
              Descubre todo lo que FcienciasApp tiene para ofrecerte
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-white text-center p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">📢</span>
              </div>
              <h3 className="text-xl font-heading font-semibold text-text-primary mb-4">
                Anuncios Importantes
              </h3>
              <p className="text-text-muted font-body leading-relaxed">
                Mantente informado sobre fechas importantes, cambios académicos y noticias relevantes
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white text-center p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              <div className="w-16 h-16 bg-accent-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">📅</span>
              </div>
              <h3 className="text-xl font-heading font-semibold text-text-primary mb-4">
                Eventos Estudiantiles
              </h3>
              <p className="text-text-muted font-body leading-relaxed">
                Descubre y participa en conferencias, talleres y eventos de la comunidad académica
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-white text-center p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              <div className="w-16 h-16 bg-accent-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">👥</span>
              </div>
              <h3 className="text-xl font-heading font-semibold text-text-primary mb-4">
                Comunidades
              </h3>
              <p className="text-text-muted font-body leading-relaxed">
                Conéctate con grupos estudiantiles, círculos de estudio y comunidades académicas
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
