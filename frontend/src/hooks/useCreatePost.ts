/**
 * Custom Hook: useCreatePost
 * Responsabilidad única: Lógica de negocio para crear posts
 * Separado de la UI siguiendo SRP (Single Responsibility Principle)
 */

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { CreatePostResponse } from '@/types/post';
import { logger } from '@/lib/logger';

interface UseCreatePostReturn {
  // Estado del formulario
  content: string;
  setContent: (value: string) => void;
  imageUrl: string;
  setImageUrl: (value: string) => void;
  isAnonymous: boolean;
  setIsAnonymous: (value: boolean) => void;
  isSubmitting: boolean;
  
  // Estado de modales
  showVerificationModal: boolean;
  setShowVerificationModal: (value: boolean) => void;
  showUsernameModal: boolean;
  setShowUsernameModal: (value: boolean) => void;
  
  // Acciones
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  handleResendVerification: () => Promise<void>;
  handleDevVerify: () => Promise<void>;
}

export function useCreatePost(onSuccess?: () => void): UseCreatePostReturn {
  // Estado del formulario
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Estado de modales
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showUsernameModal, setShowUsernameModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      toast.error('Escribe algo para publicar');
      return;
    }

    if (content.length > 5000) {
      toast.error('El contenido no puede exceder 5000 caracteres');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post<CreatePostResponse>('/api/v1/posts/create', {
        content: content.trim(),
        imageUrl: imageUrl.trim() || undefined,
        isAnonymous
      });

      if (response.data.success) {
        toast.success('¡Post publicado! 🎉');
        setContent('');
        setImageUrl('');
        setIsAnonymous(false);
        onSuccess?.();
      }
    } catch (error: any) {
      logger.post.error('create from client', error);

      const errorData = error?.response?.data;

      // Manejar caso: requiere verificación
      if (errorData?.requiresVerification) {
        setShowVerificationModal(true);
        return;
      }

      // Manejar caso: requiere username
      if (errorData?.requiresUsername) {
        setShowUsernameModal(true);
        return;
      }

      const errorMessage = errorData?.message || 'Error al publicar';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendVerification = async () => {
    try {
      await axios.post('/api/v1/auth/resend-verification');
      toast.success('Correo de verificación enviado. Revisa tu bandeja.');
      setShowVerificationModal(false);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 'Error al enviar correo';
      toast.error(errorMessage);
    }
  };

  const handleDevVerify = async () => {
    try {
      await axios.post('/api/v1/auth/dev-verify');
      toast.success('¡Email verificado! Ya puedes publicar 🎉');
      setShowVerificationModal(false);
      // Recargar página para actualizar estado
      window.location.reload();
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 'Error al verificar';
      toast.error(errorMessage);
    }
  };

  return {
    content,
    setContent,
    imageUrl,
    setImageUrl,
    isAnonymous,
    setIsAnonymous,
    isSubmitting,
    showVerificationModal,
    setShowVerificationModal,
    showUsernameModal,
    setShowUsernameModal,
    handleSubmit,
    handleResendVerification,
    handleDevVerify,
  };
}
