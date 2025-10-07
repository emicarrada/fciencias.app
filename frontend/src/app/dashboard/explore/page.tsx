'use client';

import { useState } from 'react';
import { SearchIcon, TrendingUpIcon, UsersIcon, BookOpenIcon, CalendarIcon } from 'lucide-react';
import { ReactionGroup, ReactionType } from '@/components/ui/ReactionButton';

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredPosts, setFeaturedPosts] = useState([
    {
      id: 1,
      title: "Nuevo laboratorio de IA inaugurado",
      content: "La facultad presenta su nuevo laboratorio de Inteligencia Artificial con equipos de última generación.",
      author: "Dr. Roberto Silva",
      time: "1h",
      category: "Noticias",
      reactions: {
        like: { count: 45, isActive: false },
        dislike: { count: 2, isActive: false },
        love: { count: 18, isActive: false },
        surprised: { count: 23, isActive: false },
        laugh: { count: 5, isActive: false },
      }
    },
    {
      id: 2,
      title: "Grupo de estudio para Cálculo Diferencial",
      content: "Buscamos estudiantes interesados en formar un grupo de estudio. Nos reunimos miércoles y viernes.",
      author: "Elena Martínez",
      time: "3h",
      category: "Estudio",
      reactions: {
        like: { count: 28, isActive: false },
        dislike: { count: 0, isActive: false },
        love: { count: 12, isActive: false },
        surprised: { count: 3, isActive: false },
        laugh: { count: 1, isActive: false },
      }
    }
  ]);

  const handleReaction = (postId: number, reactionType: ReactionType) => {
    setFeaturedPosts(prevPosts => 
      prevPosts.map(post => {
        if (post.id === postId) {
          const currentReaction = post.reactions[reactionType];
          const isCurrentlyActive = currentReaction.isActive;
          
          // Reset all reactions for this post
          const resetReactions = Object.keys(post.reactions).reduce((acc, key) => {
            acc[key as ReactionType] = {
              ...post.reactions[key as ReactionType],
              isActive: false,
              count: post.reactions[key as ReactionType].isActive ? 
                Math.max(0, post.reactions[key as ReactionType].count - 1) : 
                post.reactions[key as ReactionType].count
            };
            return acc;
          }, {} as typeof post.reactions);

          // Set the new reaction if it wasn't active
          if (!isCurrentlyActive) {
            resetReactions[reactionType] = {
              count: resetReactions[reactionType].count + 1,
              isActive: true
            };
          }

          return {
            ...post,
            reactions: resetReactions
          };
        }
        return post;
      })
    );
  };

  const trendingTopics = [
    { name: 'Exámenes Finales', posts: 23, category: 'Académico' },
    { name: 'Laboratorio de Física', posts: 18, category: 'Clases' },
    { name: 'Grupo de Estudio', posts: 15, category: 'Comunidad' },
    { name: 'Becas UNAM', posts: 12, category: 'Oportunidades' },
    { name: 'Seminario de Matemáticas', posts: 9, category: 'Eventos' },
  ];

  const suggestedCommunities = [
    { 
      name: 'Matemáticas Aplicadas', 
      members: 234, 
      description: 'Discusión sobre aplicaciones de matemáticas',
      color: 'blue'
    },
    { 
      name: 'Física Experimental', 
      members: 189, 
      description: 'Compartir experimentos y resultados',
      color: 'purple'
    },
    { 
      name: 'Programación Competitiva', 
      members: 156, 
      description: 'Algoritmos y concursos de programación',
      color: 'green'
    },
    { 
      name: 'Ciencias de la Tierra', 
      members: 98, 
      description: 'Geología, meteorología y más',
      color: 'amber'
    },
  ];

  const upcomingEvents = [
    {
      title: 'Conferencia de IA en Ciencias',
      date: '15 Oct',
      time: '16:00',
      location: 'Auditorio Principal',
      attendees: 45
    },
    {
      title: 'Taller de Python para Ciencias',
      date: '18 Oct', 
      time: '14:00',
      location: 'Laboratorio de Cómputo',
      attendees: 32
    },
    {
      title: 'Seminario de Matemáticas',
      date: '22 Oct',
      time: '11:00', 
      location: 'Aula Magna',
      attendees: 67
    },
  ];

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      {/* Header y búsqueda */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Explorar</h1>
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar comunidades, temas, eventos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Publicaciones destacadas */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Publicaciones Destacadas</h2>
            <div className="space-y-4">
              {featuredPosts.map((post) => (
                <div key={post.id} className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900">{post.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{post.content}</p>
                      <div className="flex items-center space-x-2 mt-2 text-xs text-gray-500">
                        <span>{post.author}</span>
                        <span>•</span>
                        <span>{post.time}</span>
                        <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                          {post.category}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3">
                    <ReactionGroup
                      reactions={post.reactions}
                      onReaction={(reactionType) => handleReaction(post.id, reactionType)}
                      size="sm"
                      contentId={post.id.toString()}
                      contentType="announcement"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Temas trending */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-2 mb-4">
              <TrendingUpIcon className="text-red-500" size={20} />
              <h2 className="text-lg font-semibold text-gray-900">Tendencias</h2>
            </div>
            <div className="space-y-3">
              {trendingTopics.map((topic, index) => (
                <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                  <div>
                    <h3 className="font-medium text-gray-900">#{topic.name}</h3>
                    <p className="text-sm text-gray-500">{topic.posts} publicaciones</p>
                  </div>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                    {topic.category}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Comunidades sugeridas */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-2 mb-4">
              <UsersIcon className="text-blue-500" size={20} />
              <h2 className="text-lg font-semibold text-gray-900">Comunidades Sugeridas</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {suggestedCommunities.map((community, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors cursor-pointer">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className={`w-10 h-10 bg-${community.color}-500 rounded-full flex items-center justify-center`}>
                      <span className="text-white font-bold text-sm">
                        {community.name.split(' ').map(word => word[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{community.name}</h3>
                      <p className="text-sm text-gray-500">{community.members} miembros</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{community.description}</p>
                  <button className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                    Unirse
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar derecha */}
        <div className="space-y-6">
          {/* Eventos próximos */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-2 mb-4">
              <CalendarIcon className="text-green-500" size={20} />
              <h2 className="text-lg font-semibold text-gray-900">Próximos Eventos</h2>
            </div>
            <div className="space-y-4">
              {upcomingEvents.map((event, index) => (
                <div key={index} className="p-3 border border-gray-200 rounded-lg hover:border-green-300 transition-colors cursor-pointer">
                  <div className="flex items-start space-x-3">
                    <div className="text-center">
                      <div className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium">
                        {event.date}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{event.time}</div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 text-sm">{event.title}</h3>
                      <p className="text-xs text-gray-500 mt-1">{event.location}</p>
                      <p className="text-xs text-gray-400 mt-1">{event.attendees} asistentes</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recursos académicos */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-2 mb-4">
              <BookOpenIcon className="text-purple-500" size={20} />
              <h2 className="text-lg font-semibold text-gray-900">Recursos</h2>
            </div>
            <div className="space-y-3">
              <a href="#" className="block p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <h3 className="font-medium text-gray-900 text-sm">Biblioteca Digital</h3>
                <p className="text-xs text-gray-500">Acceso a papers y libros</p>
              </a>
              <a href="#" className="block p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <h3 className="font-medium text-gray-900 text-sm">Calculadora Científica</h3>
                <p className="text-xs text-gray-500">Herramientas matemáticas</p>
              </a>
              <a href="#" className="block p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <h3 className="font-medium text-gray-900 text-sm">Simuladores</h3>
                <p className="text-xs text-gray-500">Física y química</p>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}