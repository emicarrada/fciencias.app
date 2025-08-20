'use client';

import React, { useState } from 'react';
import { ReactionButton, ReactionGroup, ReactionType } from '@/components/ui/ReactionButton';
import ReactionTrends from '@/components/ui/ReactionTrends';
import QuickReactionPicker from '@/components/ui/QuickReactionPicker';
import { motion } from 'framer-motion';

const demoAnnouncements = [
  {
    id: 1,
    title: "Nueva Conferencia de Física Cuántica",
    content: "El Dr. García presentará los últimos avances en computación cuántica este viernes...",
    author: "Prof. María García",
    time: "hace 2 horas",
    reactions: {
      like: { count: 15, isActive: false },
      love: { count: 8, isActive: false },
      interesting: { count: 12, isActive: true },
      useful: { count: 6, isActive: false },
      relevant: { count: 4, isActive: false },
      'mind-blown': { count: 2, isActive: false },
      brilliant: { count: 3, isActive: false },
    }
  },
  {
    id: 2,
    title: "Resultados del Concurso de Matemáticas",
    content: "¡Felicidades a todos los participantes! Los ganadores serán anunciados mañana...",
    author: "Dr. Luis Hernández",
    time: "hace 4 horas",
    reactions: {
      like: { count: 23, isActive: true },
      love: { count: 15, isActive: false },
      interesting: { count: 7, isActive: false },
      useful: { count: 9, isActive: false },
      relevant: { count: 11, isActive: false },
      'mind-blown': { count: 5, isActive: false },
      brilliant: { count: 8, isActive: false },
    }
  }
];

export default function ReactionsDemo() {
  const [announcements, setAnnouncements] = useState(demoAnnouncements);

  const handleReaction = (announcementId: number, reactionType: ReactionType) => {
    setAnnouncements(prev => 
      prev.map(announcement => {
        if (announcement.id === announcementId) {
          const currentReaction = announcement.reactions[reactionType];
          const wasActive = currentReaction.isActive;
          
          return {
            ...announcement,
            reactions: {
              ...announcement.reactions,
              [reactionType]: {
                count: wasActive ? currentReaction.count - 1 : currentReaction.count + 1,
                isActive: !wasActive
              }
            }
          };
        }
        return announcement;
      })
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🎨 Demo de Reacciones Animadas
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Interactúa con los botones de reacción para ver las animaciones suaves y efectos visuales
          </p>
        </motion.div>

        {/* Sección de Botones Individuales */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-8 mb-8"
        >
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            🔥 Botones Individuales
          </h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {(['like', 'love', 'interesting', 'useful', 'relevant', 'mind-blown', 'brilliant'] as ReactionType[]).map((type, index) => (
              <motion.div
                key={type}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="flex justify-center"
              >
                <ReactionButton
                  type={type}
                  count={Math.floor(Math.random() * 20) + 1}
                  isActive={Math.random() > 0.7}
                  onClick={() => console.log(`Clicked ${type}`)}
                  size="lg"
                />
              </motion.div>
            ))}
          </div>

          {/* Diferentes tamaños */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-700 mb-4">Diferentes tamaños:</h3>
            <div className="flex items-center gap-4 justify-center">
              <ReactionButton
                type="like"
                count={5}
                isActive={false}
                onClick={() => {}}
                size="sm"
              />
              <ReactionButton
                type="love"
                count={12}
                isActive={true}
                onClick={() => {}}
                size="md"
              />
              <ReactionButton
                type="brilliant"
                count={8}
                isActive={false}
                onClick={() => {}}
                size="lg"
              />
            </div>
          </div>

          {/* Quick Reaction Picker Demo */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-700 mb-4">🚀 Quick Reaction Picker:</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 p-8 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
              <div className="flex flex-col items-center gap-3">
                <span className="text-sm font-medium text-gray-600">Arriba</span>
                <QuickReactionPicker
                  reactions={announcements[0]?.reactions || {}}
                  onReaction={(type) => console.log(`Demo reaction: ${type}`)}
                  position="top"
                />
              </div>
              
              <div className="flex flex-col items-center gap-3">
                <span className="text-sm font-medium text-gray-600">Abajo</span>
                <QuickReactionPicker
                  reactions={announcements[0]?.reactions || {}}
                  onReaction={(type) => console.log(`Demo reaction: ${type}`)}
                  position="bottom"
                />
              </div>
              
              <div className="flex flex-col items-center gap-3">
                <span className="text-sm font-medium text-gray-600">Izquierda</span>
                <QuickReactionPicker
                  reactions={announcements[0]?.reactions || {}}
                  onReaction={(type) => console.log(`Demo reaction: ${type}`)}
                  position="left"
                />
              </div>
              
              <div className="flex flex-col items-center gap-3">
                <span className="text-sm font-medium text-gray-600">Derecha</span>
                <QuickReactionPicker
                  reactions={announcements[0]?.reactions || {}}
                  onReaction={(type) => console.log(`Demo reaction: ${type}`)}
                  position="right"
                />
              </div>
            </div>
          </div>
        </motion.section>

        {/* Feed de Anuncios */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contenido principal */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-2"
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              📱 Feed de Anuncios Interactivo
            </h2>
            
            <div className="space-y-6">
              {announcements.map((announcement, index) => (
                <motion.article
                  key={announcement.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
                >
                  {/* Header del anuncio */}
                  <div className="mb-4">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {announcement.title}
                    </h3>
                    <p className="text-gray-600 mb-3">
                      {announcement.content}
                    </p>
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="font-medium">{announcement.author}</span>
                      <span className="mx-2">•</span>
                      <span>{announcement.time}</span>
                    </div>
                  </div>

                  {/* Línea divisoria */}
                  <div className="border-t border-gray-100 my-4"></div>

                  {/* Grupo de reacciones */}
                  <div className="flex flex-wrap gap-2 items-center">
                    <ReactionGroup
                      reactions={announcement.reactions}
                      onReaction={(type) => handleReaction(announcement.id, type)}
                      size="md"
                    />
                    
                    {/* Quick Picker para más reacciones */}
                    <QuickReactionPicker
                      reactions={announcement.reactions}
                      onReaction={(type) => handleReaction(announcement.id, type)}
                      position="top"
                    />
                  </div>

                  {/* Estadísticas */}
                  <div className="mt-4 pt-3 border-t border-gray-50">
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>
                        {Object.values(announcement.reactions).reduce((total, reaction) => total + reaction.count, 0)} reacciones
                      </span>
                      <span>
                        {Object.values(announcement.reactions).filter(reaction => reaction.isActive).length} de ti
                      </span>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </motion.section>

          {/* Sidebar con tendencias */}
          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-6 space-y-6">
              {/* Tendencias del primer anuncio */}
              <ReactionTrends 
                reactions={announcements[0]?.reactions || {}}
              />
              
              {/* Tendencias del segundo anuncio */}
              <ReactionTrends 
                reactions={announcements[1]?.reactions || {}}
              />
            </div>
          </motion.aside>
        </div>

        {/* Performance Info */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            ⚡ Optimizaciones de Rendimiento
          </h2>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <h3 className="font-medium text-gray-800 mb-2">✨ Características:</h3>
              <ul className="space-y-1">
                <li>• Animaciones con Framer Motion optimizadas</li>
                <li>• Efectos de partículas ligeros</li>
                <li>• Renderizado condicional de efectos</li>
                <li>• Uso de transform para animaciones GPU</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-800 mb-2">🚀 Rendimiento:</h3>
              <ul className="space-y-1">
                <li>• Animaciones de 60 FPS</li>
                <li>• Lazy loading de efectos complejos</li>
                <li>• Cleanup automático de animaciones</li>
                <li>• Optimización para dispositivos móviles</li>
              </ul>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
