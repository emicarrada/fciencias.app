'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AnnouncementCard from '../../components/ui/AnnouncementCard';

// Mock data
const mockAnnouncements = [
  {
    id: '1',
    title: 'Nueva convocatoria para becas de investigación 2025',
    content: 'Se abre la convocatoria para becas de investigación dirigidas a estudiantes de licenciatura y posgrado. Los interesados pueden aplicar hasta el 15 de septiembre. Se priorizarán proyectos relacionados con sostenibilidad ambiental y tecnologías emergentes.',
    author: {
      name: 'Dr. María Elena Rodríguez',
      role: 'Coordinadora de Investigación',
    },
    createdAt: '2025-08-19T10:30:00Z',
    category: 'Becas y Convocatorias',
    commentsCount: 12,
  },
  {
    id: '2',
    title: 'Conferencia magistral: "El futuro de la inteligencia artificial en la ciencia"',
    content: 'Te invitamos a la conferencia magistral que impartirá el Dr. John Smith del MIT. El evento será el próximo viernes 25 de agosto a las 18:00 hrs en el Auditorio Principal. Entrada libre previa inscripción.',
    author: {
      name: 'Lic. Ana Patricia González',
      role: 'Coordinación de Eventos',
    },
    createdAt: '2025-08-18T14:15:00Z',
    category: 'Eventos Académicos',
    commentsCount: 8,
  },
  {
    id: '3',
    title: 'Actualización del sistema de biblioteca digital',
    content: 'Informamos que el sistema de biblioteca digital estará en mantenimiento el sábado 26 de agosto de 02:00 a 06:00 hrs. Durante este periodo no será posible acceder a los recursos electrónicos.',
    author: {
      name: 'Biblioteca Central',
      role: 'Servicios Bibliotecarios',
    },
    createdAt: '2025-08-17T09:45:00Z',
    category: 'Avisos Generales',
    commentsCount: 3,
  },
  {
    id: '4',
    title: 'Taller de programación en Python para análisis de datos',
    content: 'Iniciamos un nuevo taller de programación en Python enfocado en análisis de datos científicos. Las clases serán los martes y jueves de 16:00 a 18:00 hrs. Dirigido a estudiantes de todas las carreras. Inscripciones abiertas.',
    author: {
      name: 'M.C. Roberto Fernández',
      role: 'Profesor de Computación',
    },
    createdAt: '2025-08-16T11:20:00Z',
    category: 'Cursos y Talleres',
    commentsCount: 15,
  },
];

const categories = [
  'Todas',
  'Becas y Convocatorias', 
  'Eventos Académicos',
  'Avisos Generales',
  'Cursos y Talleres',
];

export default function AnunciosPage() {
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [announcements] = useState(mockAnnouncements);

  const filteredAnnouncements = announcements.filter(
    announcement => selectedCategory === 'Todas' || announcement.category === selectedCategory
  );

  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      }
    }
  };

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Anuncios Académicos
            </h1>
            <p className="mt-2 text-gray-600">
              Mantente al día con las últimas noticias y eventos de la Facultad de Ciencias
            </p>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <motion.button
                key={category}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {category}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Announcements Feed */}
        <motion.div
          variants={containerVariants}
          initial="initial"
          animate="animate"
          className="space-y-6"
        >
          <AnimatePresence mode="wait">
            {filteredAnnouncements.map((announcement) => (
              <motion.div
                key={`${announcement.id}-${selectedCategory}`}
                variants={itemVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                layout
              >
                <AnnouncementCard
                  {...announcement}
                  onComment={() => console.log('Comment clicked', announcement.id)}
                  onShare={() => console.log('Share clicked', announcement.id)}
                  onBookmark={() => console.log('Bookmark clicked', announcement.id)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredAnnouncements.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay anuncios
            </h3>
            <p className="text-gray-500">
              No se encontraron anuncios para la categoría seleccionada.
            </p>
          </motion.div>
        )}

        {/* Load More Button */}
        {filteredAnnouncements.length > 0 && (
          <div className="text-center mt-8">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200"
            >
              Cargar más anuncios
            </motion.button>
          </div>
        )}
      </main>
    </div>
  );
}
