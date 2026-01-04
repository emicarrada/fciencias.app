'use client';

import { useAuth } from '@/hooks/business/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { SimplePost } from '@/types/post';
import PostCard from '@/components/posts/PostCard';
import { toast } from 'react-hot-toast';
import Loader from '@/components/ui/Loader';

export default function PerfilPage() {
  const { user, isLoading: authLoading, logout } = useAuth();
  const router = useRouter();
  const [myPosts, setMyPosts] = useState<SimplePost[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [showEditUsername, setShowEditUsername] = useState(false);
  const [newUsername, setNewUsername] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
      return;
    }

    if (user) {
      loadMyPosts();
      setNewUsername(user.username || '');
    }
  }, [user, authLoading, router]);

  const loadMyPosts = async () => {
    try {
      setIsLoadingPosts(true);
      // Usar el nuevo endpoint que filtra por usuario autenticado
      const response = await axios.get('/api/v1/posts/my-posts');
      
      if (response.data.success) {
        setMyPosts(response.data.posts);
      }
    } catch (error) {
      console.error('Error al cargar posts:', error);
    } finally {
      setIsLoadingPosts(false);
    }
  };

  const handleUpdateUsername = async () => {
    if (!newUsername.trim()) {
      toast.error('Ingresa un nombre de usuario');
      return;
    }

    try {
      await axios.post('/api/v1/auth/set-username', { username: newUsername.trim() });
      toast.success('Nombre de usuario actualizado');
      setShowEditUsername(false);
      window.location.reload(); // Recargar para actualizar el usuario
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 'Error al actualizar';
      toast.error(errorMessage);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/auth/login');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Loader size={48} />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Información del usuario */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-start gap-4 mb-6">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-3xl"
              style={{ backgroundColor: user.avatarColor || '#3B82F6' }}
            >
              {(user.username || user.email).charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                {user.username || 'Usuario sin nombre'}
              </h2>
              <p className="text-gray-600 mb-2">{user.email}</p>
              <div className="flex gap-2">
                {user.isEmailVerified ? (
                  <span className="inline-block bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
                    ✓ Email verificado
                  </span>
                ) : (
                  <span className="inline-block bg-yellow-100 text-yellow-800 text-sm px-3 py-1 rounded-full">
                    ⚠ Email no verificado
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex gap-3">
            <button
              onClick={() => setShowEditUsername(!showEditUsername)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
            >
              Editar nombre de usuario
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition"
            >
              Cerrar sesión
            </button>
          </div>

          {/* Formulario editar username */}
          {showEditUsername && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nuevo nombre de usuario
              </label>
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                placeholder="nombre_usuario"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition mb-2"
                maxLength={20}
              />
              <div className="text-sm text-gray-500 mb-3">
                3-20 caracteres, solo letras, números, guiones y guiones bajos
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleUpdateUsername}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
                >
                  Guardar
                </button>
                <button
                  onClick={() => setShowEditUsername(false)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Mis publicaciones */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Mis publicaciones</h3>
          
          {isLoadingPosts ? (
            <div className="text-center py-8">
              <Loader size={32} />
              <p className="text-gray-600 mt-2">Cargando...</p>
            </div>
          ) : myPosts.length === 0 ? (
            <p className="text-gray-600 text-center py-8">No tienes publicaciones aún</p>
          ) : (
            <div className="space-y-4">
              {myPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
