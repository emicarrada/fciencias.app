'use client';

import React, { useState } from 'react';
import { ReactionButton, ReactionType } from '@/components/ui/ReactionButton';
import { PostCard } from '@/components/ui/Card';

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
    <div className="min-h-screen bg-secondary-50 py-6 sm:py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-text-primary mb-4">
            Sistema de Reacciones - FCiencias.app
          </h1>
          <p className="text-sm sm:text-base font-body text-text-muted">
            Interactúa con las publicaciones usando nuestro sistema de reacciones
          </p>
        </div>

        <div className="space-y-6">
          {announcements.map((announcement) => (
            <PostCard
              key={announcement.id}
              author={{
                name: announcement.author,
                time: announcement.time
              }}
            >
              {/* Contenido del anuncio */}
              <div>
                <h2 className="text-lg sm:text-xl font-heading font-semibold text-text-primary mb-3">
                  {announcement.title}
                </h2>
                <p className="text-sm sm:text-base font-body text-text-muted leading-relaxed mb-4">
                  {announcement.content}
                </p>
              </div>

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
            </PostCard>
          ))}
        </div>

        {/* Footer explicativo */}
        <div className="mt-8 sm:mt-12 bg-primary-50 rounded-xl p-6 sm:p-8 border border-primary-200">
          <h3 className="text-base sm:text-lg font-heading font-semibold text-primary-800 mb-4">
            💡 ¿Cómo funciona el sistema de reacciones?
          </h3>
          <ul className="text-primary-700 space-y-2 text-sm sm:text-base font-body">
            <li className="flex items-start">
              <span className="text-accent-green-500 mr-2">✓</span>
              Solo puedes tener una reacción activa por publicación
            </li>
            <li className="flex items-start">
              <span className="text-accent-green-500 mr-2">✓</span>
              Al hacer clic en una reacción, se activa y cambia de color
            </li>
            <li className="flex items-start">
              <span className="text-accent-green-500 mr-2">✓</span>
              Si haces clic en la misma reacción, se desactiva
            </li>
            <li className="flex items-start">
              <span className="text-accent-green-500 mr-2">✓</span>
              El contador se actualiza automáticamente en tiempo real
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
