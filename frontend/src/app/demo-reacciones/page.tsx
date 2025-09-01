'use client';

import React, { useState } from 'react';
import { ReactionButton, ReactionType } from '@/components/ui/ReactionButton';

const demoAnnouncements = [
  {
    id: 1,
    title: "Nueva Conferencia de Física Cuántica",
    content: "El Dr. García presentará los últimos avances en computación cuántica este viernes a las 4 PM en el Auditorio Principal.",
    author: "Prof. María García",
    time: "hace 2 horas",
    reactions: {
      like: { count: 15, isActive: false },
      dislike: { count: 2, isActive: false },
      love: { count: 8, isActive: false },
      surprised: { count: 12, isActive: false },
      laugh: { count: 3, isActive: false },
    }
  },
  {
    id: 2,
    title: "Resultados del Concurso de Matemáticas",
    content: "¡Felicidades a todos los participantes! Los ganadores del concurso anual de matemáticas serán anunciados mañana.",
    author: "Dr. Luis Hernández",
    time: "hace 4 horas",
    reactions: {
      like: { count: 23, isActive: false },
      dislike: { count: 1, isActive: false },
      love: { count: 15, isActive: false },
      surprised: { count: 7, isActive: false },
      laugh: { count: 5, isActive: false },
    }
  },
  {
    id: 3,
    title: "Nuevo Laboratorio de Biología Molecular",
    content: "La facultad inaugura un nuevo laboratorio equipado con tecnología de última generación para investigación en biología molecular.",
    author: "Dra. Ana Rodríguez",
    time: "hace 6 horas",
    reactions: {
      like: { count: 34, isActive: false },
      dislike: { count: 0, isActive: false },
      love: { count: 28, isActive: false },
      surprised: { count: 15, isActive: false },
      laugh: { count: 2, isActive: false },
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
          
          // Crear nuevo objeto de reacciones - solo una puede estar activa
          const newReactions = { ...announcement.reactions };
          
          // Desactivar todas las reacciones
          (Object.keys(newReactions) as ReactionType[]).forEach(key => {
            const reactionKey = key as ReactionType;
            newReactions[reactionKey] = {
              ...newReactions[reactionKey],
              isActive: false,
              count: newReactions[reactionKey].isActive 
                ? Math.max(0, newReactions[reactionKey].count - 1)
                : newReactions[reactionKey].count
            };
          });
          
          // Si no estaba activa, activar la nueva reacción
          if (!wasActive) {
            newReactions[reactionType] = {
              ...newReactions[reactionType],
              isActive: true,
              count: newReactions[reactionType].count + 1
            };
          }
          
          return {
            ...announcement,
            reactions: newReactions
          };
        }
        return announcement;
      })
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Sistema de Reacciones - FCiencias.app
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Haz clic en las reacciones para interactuar con las publicaciones
          </p>
        </div>

        <div className="space-y-4 sm:space-y-6">
          {announcements.map((announcement) => (
            <div key={announcement.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
              {/* Header del anuncio */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold text-xs sm:text-sm">
                    {announcement.author.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{announcement.author}</h3>
                  <p className="text-xs sm:text-sm text-gray-500">{announcement.time}</p>
                </div>
              </div>

              {/* Contenido del anuncio */}
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                {announcement.title}
              </h2>
              <p className="text-sm sm:text-base text-gray-700 mb-4">
                {announcement.content}
              </p>

              {/* Reacciones */}
              <div className="border-t border-gray-100 pt-4">
                <div className="flex flex-wrap gap-2">
                  {(['like', 'dislike', 'love', 'surprised', 'laugh'] as ReactionType[]).map((type) => (
                    <ReactionButton
                      key={type}
                      type={type}
                      count={announcement.reactions[type].count}
                      isActive={announcement.reactions[type].isActive}
                      onClick={() => handleReaction(announcement.id, type)}
                      size="md"
                      contentId={announcement.id.toString()}
                      contentType="announcement"
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer explicativo */}
        <div className="mt-8 sm:mt-12 bg-blue-50 rounded-lg p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-blue-900 mb-2">
            ¿Cómo funciona?
          </h3>
          <ul className="text-blue-700 space-y-1 text-sm sm:text-base">
            <li>• Solo puedes tener una reacción activa por publicación</li>
            <li>• Al hacer clic en una reacción, se activa y cambia de color</li>
            <li>• Si haces clic en la misma reacción, se desactiva</li>
            <li>• El contador se actualiza automáticamente</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
