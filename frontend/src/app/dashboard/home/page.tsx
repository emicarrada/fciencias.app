'use client';

import { useAuthStore } from '@/store/authStore';
import { PlusIcon, HeartIcon, MessageCircleIcon, ShareIcon } from 'lucide-react';

export default function HomePage() {
  const { user } = useAuthStore();

  const mockPosts = [
    {
      id: 1,
      author: 'Ana García',
      career: 'Matemáticas',
      time: '2h',
      content: '¿Alguien sabe cuándo publican las fechas de exámenes finales? No encuentro información en la página de la facultad 🤔',
      likes: 12,
      comments: 5,
      avatar: 'AG'
    },
    {
      id: 2,
      author: 'Carlos Mendoza',
      career: 'Física',
      time: '4h',
      content: 'Acabo de terminar mi proyecto de laboratorio de óptica. ¡Súper interesante el experimento de interferencia! 🔬✨',
      likes: 24,
      comments: 8,
      avatar: 'CM'
    },
    {
      id: 3,
      author: 'María González',
      career: 'Ciencias de la Computación',
      time: '6h',
      content: 'Estoy organizando un grupo de estudio para Algoritmos y Estructuras de Datos. ¿Quién se anima? Nos reunimos los martes y jueves 📚',
      likes: 31,
      comments: 15,
      avatar: 'MG'
    }
  ];

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      {/* Header de bienvenida */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          ¡Hola, {user?.firstName}! 👋
        </h1>
        <p className="text-gray-600">
          Bienvenido de vuelta a la comunidad de {user?.career || 'FCiencias'}
        </p>
      </div>

      {/* Crear nueva publicación */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white font-medium text-sm">
              {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
            </span>
          </div>
          <div className="flex-1">
            <button className="w-full text-left p-3 bg-gray-50 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors">
              ¿Qué quieres compartir con la comunidad?
            </button>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button className="flex items-center space-x-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
            <PlusIcon size={16} />
            <span className="text-sm font-medium">Publicar</span>
          </button>
        </div>
      </div>

      {/* Feed de publicaciones */}
      <div className="space-y-4">
        {mockPosts.map((post) => (
          <div key={post.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            {/* Header del post */}
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-sm">{post.avatar}</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{post.author}</h3>
                <p className="text-sm text-gray-500">{post.career} • {post.time}</p>
              </div>
            </div>

            {/* Contenido del post */}
            <p className="text-gray-800 mb-4 leading-relaxed">{post.content}</p>

            {/* Acciones del post */}
            <div className="flex items-center space-x-6 pt-3 border-t border-gray-100">
              <button className="flex items-center space-x-2 text-gray-500 hover:text-red-500 transition-colors">
                <HeartIcon size={18} />
                <span className="text-sm">{post.likes}</span>
              </button>
              <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors">
                <MessageCircleIcon size={18} />
                <span className="text-sm">{post.comments}</span>
              </button>
              <button className="flex items-center space-x-2 text-gray-500 hover:text-green-500 transition-colors">
                <ShareIcon size={18} />
                <span className="text-sm">Compartir</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Placeholder para más contenido */}
      <div className="text-center py-8">
        <p className="text-gray-500">Has llegado al final del feed</p>
        <button className="mt-2 text-blue-600 hover:text-blue-700 font-medium">
          Cargar más publicaciones
        </button>
      </div>
    </div>
  );
}