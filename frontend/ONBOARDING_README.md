# Sistema de Onboarding FCiencias.app

## Descripción General

Este sistema de onboarding ha sido diseñado para mejorar la experiencia de registro de usuarios en FCiencias.app, proporcionando un flujo paso a paso que valida email institucional, recopila información del perfil, selección de carrera y personalización de avatar.

## Estructura de Componentes

### Componentes Principales

1. **OnboardingFlow.tsx** - Componente base que maneja la navegación entre pasos
2. **CompleteOnboarding.tsx** - Wrapper principal con header y manejo de estados
3. **OnboardingIntegration.tsx** - Componente de integración con el sistema existente

### Pasos del Onboarding

1. **EmailStep.tsx** - Validación de email @ciencias.unam.mx
2. **ProfileStep.tsx** - Captura de nombre completo y username
3. **CareerStep.tsx** - Selección de carrera académica
4. **AvatarStep.tsx** - Selección de color para avatar

### Archivos de Configuración

- **onboardingConfig.ts** - Configuración de pasos y helper functions
- **types/onboarding.ts** - Tipos TypeScript y datos de carreras/colores

## Características Principales

### 🎯 Validación Institucional
- Email debe ser @ciencias.unam.mx
- Validación en tiempo real
- Mensajes de error claros

### 👤 Perfil Personalizado
- Nombre completo requerido
- Username único con validación
- Verificación de disponibilidad simulada

### 🎓 Selección de Carrera
- 9 carreras disponibles con iconos
- Información descriptiva de cada carrera
- Códigos cortos identificativos

### 🎨 Personalización de Avatar
- 12 colores predefinidos
- Vista previa en tiempo real
- Initiales basadas en el nombre

### ✨ Experiencia de Usuario
- Animaciones suaves con Framer Motion
- Diseño responsive
- Progreso visual
- Navegación intuitiva

## Uso e Integración

### Integración Básica

```tsx
import { CompleteOnboarding } from '@/components/onboarding/CompleteOnboarding';
import { OnboardingData } from '@/types/onboarding';

function RegisterPage() {
  const handleComplete = async (userData: OnboardingData) => {
    // Llamada a tu API de registro
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
  };

  const handleCancel = () => {
    // Redirigir al login
    router.push('/auth/login');
  };

  return (
    <CompleteOnboarding
      onComplete={handleComplete}
      onCancel={handleCancel}
    />
  );
}
```

### Integración con Sistema Existente

```tsx
import { OnboardingIntegration } from '@/components/onboarding/OnboardingIntegration';

function RegisterPage() {
  return (
    <OnboardingIntegration
      onComplete={handleComplete}
      onCancel={handleCancel}
      fallbackComponent={ExistingRegisterForm} // Opcional
    />
  );
}
```

## Datos de Output

El sistema genera un objeto `OnboardingData` con la siguiente estructura:

```typescript
interface OnboardingData {
  email: string;           // Email institucional validado
  fullName: string;        // Nombre completo del usuario
  username: string;        // Username único
  career: string;          // ID de la carrera seleccionada
  avatarColor: string;     // ID del color del avatar
}
```

## Carreras Disponibles

| ID | Nombre | Código | Descripción |
|----|--------|--------|-------------|
| matematicas | Matemáticas | MAT | Matemáticas puras y aplicadas |
| fisica | Física | FIS | Física teórica y experimental |
| actuaria | Actuaría | ACT | Ciencias actuariales y financieras |
| computacion | Ciencias de la Computación | CC | Programación y sistemas |
| biologia | Biología | BIO | Ciencias biológicas y biomédicas |
| ciencias-tierra | Ciencias de la Tierra | CT | Geología, meteorología y geofísica |
| quimica | Química | QUI | Química teórica y aplicada |
| matematicas-aplicadas | Matemáticas Aplicadas | MA | Matemáticas aplicadas a la computación |
| neurobiologia | Neurobiología | NB | Neurociencias y biología del comportamiento |

## Colores de Avatar Disponibles

- Azul Océano (blue)
- Índigo Profundo (indigo)
- Púrpura Real (purple)
- Rosa Coral (pink)
- Rojo Fuego (red)
- Naranja Vibrante (orange)
- Amarillo Sol (yellow)
- Verde Esmeralda (green)
- Verde Azulado (teal)
- Cian Cristal (cyan)
- Gris Elegante (gray)
- Pizarra (slate)

## Personalización

### Agregar Nuevos Pasos

1. Crear nuevo componente de paso en `components/onboarding/`
2. Seguir la interfaz `StepProps` estándar
3. Agregar al array `onboardingSteps` en `onboardingConfig.ts`
4. Actualizar tipos en `types/onboarding.ts`

### Modificar Carreras

Editar el array `CAREERS` en `types/onboarding.ts`:

```typescript
export const CAREERS: Career[] = [
  {
    id: 'nueva-carrera',
    name: 'Nueva Carrera',
    shortName: 'NC',
    icon: '🎯', // Emoji o componente de icono
    description: 'Descripción de la nueva carrera',
    color: 'blue'
  },
  // ... más carreras
];
```

### Modificar Colores de Avatar

Editar el array `AVATAR_COLORS` en `types/onboarding.ts`:

```typescript
export const AVATAR_COLORS: AvatarColor[] = [
  { 
    id: 'nuevo-color', 
    name: 'Nuevo Color', 
    bg: 'bg-color-500', 
    text: 'text-white' 
  },
  // ... más colores
];
```

## Dependencias

- React 18+
- Next.js 15+
- Framer Motion (animaciones)
- Heroicons (iconos)
- Tailwind CSS (estilos)
- TypeScript (tipado)

## Notas de Implementación

- Todos los componentes usan 'use client' para funcionalidad interactiva
- Validaciones en tiempo real para mejor UX
- Estados de loading y éxito incluidos
- Diseño responsive para mobile y desktop
- Accesibilidad considerada en todos los componentes
- Navegación con teclado soportada

## Próximas Mejoras

- [ ] Integración con API real de verificación de email
- [ ] Subida de imágenes para avatar (opcional)
- [ ] Selección de semestre en el paso de perfil
- [ ] Verificación real de disponibilidad de username
- [ ] Modo oscuro
- [ ] Soporte para múltiples idiomas
- [ ] Guardado de progreso en localStorage
- [ ] Paso opcional de configuración de notificaciones
