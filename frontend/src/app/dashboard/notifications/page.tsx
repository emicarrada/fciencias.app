'use client';

import { useState } from 'react';
import { 
  BellIcon, 
  HeartIcon, 
  MessageCircleIcon, 
  UsersIcon, 
  CalendarIcon,
  BookOpenIcon,
  CheckIcon
} from 'lucide-react';

export default function NotificationsPage() {
  const [filter, setFilter] = useState('all');

  const notifications = [
    {
      id: 1,
      type: 'like',
      icon: HeartIcon,
      iconColor: 'text-red-500',
      bgColor: 'bg-red-50',
      title: 'Ana García le dio like a tu publicación',
      description: 'sobre el grupo de estudio de Algoritmos',
      time: '5 min',
      read: false,
      avatar: 'AG'
    },
    {
      id: 2,
      type: 'comment',
      icon: MessageCircleIcon,
      iconColor: 'text-blue-500',
      bgColor: 'bg-blue-50',
      title: 'Carlos Mendoza comentó tu post',
      description: '"¡Excelente idea! Me uno al grupo"',
      time: '15 min',
      read: false,
      avatar: 'CM'
    },
    {
      id: 3,
      type: 'follow',
      icon: UsersIcon,
      iconColor: 'text-green-500',
      bgColor: 'bg-green-50',
      title: 'María González comenzó a seguirte',
      description: 'Ahora pueden ver las publicaciones de cada uno',
      time: '1 h',
      read: true,
      avatar: 'MG'
    },
    {
      id: 4,
      type: 'event',
      icon: CalendarIcon,
      iconColor: 'text-purple-500',
      bgColor: 'bg-purple-50',
      title: 'Recordatorio: Conferencia de IA mañana',
      description: '16:00 hrs en el Auditorio Principal',
      time: '2 h',
      read: true,
      avatar: null
    },
    {
      id: 5,
      type: 'announcement',
      icon: BookOpenIcon,
      iconColor: 'text-amber-500',
      bgColor: 'bg-amber-50',
      title: 'Nuevo anuncio de la Facultad',
      description: 'Fechas de exámenes finales publicadas',
      time: '4 h',
      read: true,
      avatar: null
    },
    {
      id: 6,
      type: 'like',
      icon: HeartIcon,
      iconColor: 'text-red-500',
      bgColor: 'bg-red-50',
      title: 'A 12 personas les gustó tu publicación',
      description: 'sobre el experimento de laboratorio',
      time: '1 día',
      read: true,
      avatar: null
    },
  ];

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.read;
    return notification.type === filter;
  });

  const markAsRead = (id: number) => {
    // Aquí iría la lógica para marcar como leída
    console.log('Marking notification', id, 'as read');
  };

  const markAllAsRead = () => {
    // Aquí iría la lógica para marcar todas como leídas
    console.log('Marking all notifications as read');
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <BellIcon className="text-blue-500" size={24} />
            <h1 className="text-2xl font-bold text-gray-900">Notificaciones</h1>
          </div>
          <button 
            onClick={markAllAsRead}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Marcar todas como leídas
          </button>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'all', label: 'Todas' },
            { id: 'unread', label: 'No leídas' },
            { id: 'like', label: 'Me gusta' },
            { id: 'comment', label: 'Comentarios' },
            { id: 'follow', label: 'Seguidores' },
            { id: 'event', label: 'Eventos' },
          ].map((filterOption) => (
            <button
              key={filterOption.id}
              onClick={() => setFilter(filterOption.id)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filter === filterOption.id
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {filterOption.label}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de notificaciones */}
      <div className="space-y-2">
        {filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center">
            <BellIcon className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay notificaciones</h3>
            <p className="text-gray-500">
              {filter === 'unread' 
                ? 'No tienes notificaciones sin leer' 
                : 'No tienes notificaciones para mostrar'}
            </p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-white rounded-xl p-4 shadow-sm border transition-all hover:shadow-md cursor-pointer ${
                notification.read ? 'border-gray-100' : 'border-blue-200 bg-blue-50/30'
              }`}
            >
              <div className="flex items-start space-x-4">
                {/* Icono de la notificación */}
                <div className={`p-2 rounded-full ${notification.bgColor}`}>
                  <notification.icon className={notification.iconColor} size={20} />
                </div>

                {/* Contenido */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className={`font-medium ${notification.read ? 'text-gray-900' : 'text-gray-900'}`}>
                        {notification.title}
                      </h3>
                      {notification.description && (
                        <p className="text-sm text-gray-600 mt-1">{notification.description}</p>
                      )}
                      <p className="text-xs text-gray-400 mt-2">{notification.time}</p>
                    </div>

                    {/* Avatar o acciones */}
                    <div className="flex items-center space-x-2 ml-4">
                      {notification.avatar && (
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-medium">
                            {notification.avatar}
                          </span>
                        </div>
                      )}
                      
                      {!notification.read && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            markAsRead(notification.id);
                          }}
                          className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                          title="Marcar como leída"
                        >
                          <CheckIcon size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Indicador de no leída */}
                {!notification.read && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Configuración de notificaciones */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Configuración de Notificaciones</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">Notificaciones push</h3>
              <p className="text-sm text-gray-500">Recibe notificaciones en tiempo real</p>
            </div>
            <button className="bg-blue-600 relative inline-flex h-6 w-11 items-center rounded-full transition-colors">
              <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white transition"></span>
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">Notificaciones por email</h3>
              <p className="text-sm text-gray-500">Resumen diario por correo</p>
            </div>
            <button className="bg-gray-200 relative inline-flex h-6 w-11 items-center rounded-full transition-colors">
              <span className="translate-x-1 inline-block h-4 w-4 transform rounded-full bg-white transition"></span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}