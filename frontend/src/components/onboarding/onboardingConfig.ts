'use client';

import { OnboardingStep } from './OnboardingFlow';
import { EmailStep } from './EmailStep';
import { ProfileStep } from './ProfileStep';
import { CareerStep } from './CareerStep';
import { PasswordStep } from './PasswordStep';
import { AvatarStep } from './AvatarStep';

export const onboardingSteps: OnboardingStep[] = [
  {
    id: 'email',
    title: 'Verificación de Email',
    subtitle: 'Confirma tu email institucional',
    component: EmailStep,
  },
  {
    id: 'profile',
    title: 'Información Personal',
    subtitle: 'Completa tu perfil básico',
    component: ProfileStep,
  },
  {
    id: 'career',
    title: 'Carrera Académica',
    subtitle: 'Selecciona tu área de estudio',
    component: CareerStep,
  },
  {
    id: 'password',
    title: 'Contraseña Segura',
    subtitle: 'Crea una contraseña para tu cuenta',
    component: PasswordStep,
  },
  {
    id: 'avatar',
    title: 'Personalización',
    subtitle: 'Elige el color de tu avatar',
    component: AvatarStep,
  },
];

// Función helper para crear el onboarding completo
export function createOnboardingData(stepData: Record<string, any>) {
  return {
    email: stepData.email?.email || '',
    fullName: stepData.profile?.fullName || '',
    username: stepData.profile?.username || '',
    career: stepData.career?.career || '',
    password: stepData.password?.password || '',
    avatarColor: stepData.avatar?.avatarColor || 'blue',
  };
}
