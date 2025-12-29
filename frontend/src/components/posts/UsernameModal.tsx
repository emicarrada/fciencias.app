/**
 * Componente: UsernameModal
 * Responsabilidad única: Mostrar modal para configurar username
 * Extraído de CreatePostForm para seguir SRP
 */

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';

interface UsernameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function UsernameModal({
  isOpen,
  onClose,
  onSuccess,
}: UsernameModalProps) {
  const [username, setUsername] = useState('');

  if (!isOpen) return null;

  const handleSetUsername = async () => {
    if (!username.trim()) {
      toast.error('Ingresa un nombre de usuario');
      return;
    }

    try {
      await axios.post('/api/v1/auth/set-username', { username: username.trim() });
      toast.success('¡Nombre de usuario configurado! 🎉');
      setUsername('');
      onClose();
      
      // Reintentar publicar
      onSuccess();
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 'Error al configurar username';
      toast.error(errorMessage);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Configura tu nombre de usuario</h3>
        <p className="text-gray-700 mb-4">
          Para publicar de forma no anónima, necesitas un nombre de usuario.
        </p>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="nombre_usuario"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition mb-4"
          maxLength={20}
        />
        <div className="text-sm text-gray-500 mb-4">
          3-20 caracteres, solo letras, números, guiones y guiones bajos
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleSetUsername}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            Guardar
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
