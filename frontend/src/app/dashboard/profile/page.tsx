'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { 
  UserIcon, 
  SettingsIcon, 
  LogOutIcon, 
  EditIcon, 
  CameraIcon,
  BookOpenIcon,
  TrophyIcon,
  CalendarIcon,
  MailIcon,
  GraduationCapIcon
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  const userStats = [
    { label: 'Publicaciones', value: '24', icon: BookOpenIcon, color: 'text-blue-500' },
    { label: 'Seguidores', value: '156', icon: UserIcon, color: 'text-green-500' },
    { label: 'Siguiendo', value: '89', icon: UserIcon, color: 'text-purple-500' },
    { label: 'Likes recibidos', value: '342', icon: TrophyIcon, color: 'text-amber-500' },
  ];

  const recentActivity = [
    {
      action: 'Publicó un post',
      description: 'sobre grupos de estudio de Algoritmos',
      time: '2 horas',
      type: 'post'
    },
    {
      action: 'Se unió a la comunidad',
      description: 'Matemáticas Aplicadas',
      time: '1 día',
      type: 'community'
    },
    {
      action: 'Compartió un evento',
      description: 'Conferencia de IA en Ciencias',
      time: '3 días',
      type: 'event'
    },
    {
      action: 'Comentó en un post',
      description: 'de María González sobre laboratorio',
      time: '5 días',
      type: 'comment'
    },
  ];

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Header del perfil */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Cover photo */}
        <div className="h-32 bg-gradient-to-r from-blue-500 to-blue-600 relative">
          <button className="absolute top-4 right-4 p-2 bg-white/20 rounded-lg backdrop-blur-sm text-white hover:bg-white/30 transition-colors">
            <CameraIcon size={16} />
          </button>
        </div>

        {/* Profile info */}
        <div className="p-6 relative">
          {/* Avatar */}
          <div className="absolute -top-16 left-6">
            <div className="w-24 h-24 bg-blue-500 rounded-full border-4 border-white flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-2xl">
                {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
              </span>
            </div>
            <button className="absolute bottom-0 right-0 p-1.5 bg-gray-100 rounded-full border-2 border-white hover:bg-gray-200 transition-colors">
              <CameraIcon size={14} />
            </button>
          </div>

          {/* Profile actions */}
          <div className="flex justify-end space-x-2 mb-4">
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <EditIcon size={16} />
              <span className="text-sm font-medium">Editar perfil</span>
            </button>
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              <SettingsIcon size={20} />
            </button>
          </div>

          {/* User info */}
          <div className="mt-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {user?.firstName} {user?.lastName}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
              <div className="flex items-center space-x-1">
                <GraduationCapIcon size={16} />
                <span>{user?.career}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MailIcon size={16} />
                <span>{user?.email}</span>
              </div>
              <div className="flex items-center space-x-1">
                <CalendarIcon size={16} />
                <span>Miembro desde {new Date(user?.createdAt || '').toLocaleDateString('es-ES', { year: 'numeric', month: 'long' })}</span>
              </div>
            </div>
            <p className="text-gray-700">
              Estudiante de {user?.career} en la Facultad de Ciencias, UNAM. 
              Apasionado por el aprendizaje y la colaboración académica.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Estadísticas */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Estadísticas</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {userStats.map((stat, index) => (
                <div key={index} className="text-center p-4 rounded-lg bg-gray-50">
                  <stat.icon className={`mx-auto mb-2 ${stat.color}`} size={24} />
                  <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Actividad reciente */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Actividad Reciente</h2>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">{activity.action}</span> {activity.description}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Hace {activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Configuración rápida */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Configuración</h2>
            <div className="space-y-3">
              <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <UserIcon size={16} className="text-gray-500" />
                  <span className="text-sm text-gray-700">Información personal</span>
                </div>
              </button>
              <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <SettingsIcon size={16} className="text-gray-500" />
                  <span className="text-sm text-gray-700">Preferencias</span>
                </div>
              </button>
              <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <MailIcon size={16} className="text-gray-500" />
                  <span className="text-sm text-gray-700">Notificaciones</span>
                </div>
              </button>
            </div>
          </div>

          {/* Comunidades */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Mis Comunidades</h2>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-2 rounded-lg">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-medium">MA</span>
                </div>
                <span className="text-sm text-gray-700">Matemáticas Aplicadas</span>
              </div>
              <div className="flex items-center space-x-3 p-2 rounded-lg">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-medium">PC</span>
                </div>
                <span className="text-sm text-gray-700">Programación Competitiva</span>
              </div>
            </div>
          </div>

          {/* Cerrar sesión */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-2 p-3 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
            >
              <LogOutIcon size={16} />
              <span className="font-medium">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}