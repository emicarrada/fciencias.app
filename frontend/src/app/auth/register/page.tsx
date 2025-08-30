'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '@/store/authStore';
import { RegisterRequest, Career, CAREER_LABELS } from '@/types/auth';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerUser, isLoading, error, clearError } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterRequest>();

  const password = watch('password');

  const careerOptions = Object.entries(CAREER_LABELS).map(([value, label]) => ({
    value,
    label,
  }));

  const semesterOptions = Array.from({ length: 10 }, (_, i) => ({
    value: (i + 1).toString(),
    label: `${i + 1}° semestre`,
  }));

  const onSubmit = async (data: RegisterRequest) => {
    try {
      clearError();
      await registerUser(data);
      toast.success('¡Cuenta creada exitosamente!');
      router.push('/dashboard');
    } catch (error) {
      toast.error('Error al crear la cuenta');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-8 sm:py-12 px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-600">FCiencias.app</h1>
          <h2 className="mt-4 sm:mt-6 text-2xl sm:text-3xl font-extrabold text-gray-900">
            Crear cuenta
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            ¿Ya tienes cuenta?{' '}
            <Link
              href="/auth/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </div>

      <div className="mt-6 sm:mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-6 sm:py-8 px-4 sm:px-6 lg:px-10 shadow sm:rounded-lg">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Nombre"
                type="text"
                autoComplete="given-name"
                required
                error={errors.firstName?.message}
                {...register('firstName', {
                  required: 'El nombre es requerido',
                  minLength: {
                    value: 2,
                    message: 'El nombre debe tener al menos 2 caracteres',
                  },
                })}
              />

              <Input
                label="Apellido"
                type="text"
                autoComplete="family-name"
                required
                error={errors.lastName?.message}
                {...register('lastName', {
                  required: 'El apellido es requerido',
                  minLength: {
                    value: 2,
                    message: 'El apellido debe tener al menos 2 caracteres',
                  },
                })}
              />
            </div>

            <Input
              label="Correo electrónico"
              type="email"
              autoComplete="email"
              required
              placeholder="tu.email@ciencias.unam.mx"
              helperText="Debe ser tu correo institucional de la Facultad de Ciencias"
              error={errors.email?.message}
              {...register('email', {
                required: 'El correo es requerido',
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@ciencias\.unam\.mx$/,
                  message: 'Debe ser un correo institucional (@ciencias.unam.mx)',
                },
              })}
            />

            <Select
              label="Carrera"
              required
              placeholder="Selecciona tu carrera"
              options={careerOptions}
              error={errors.career?.message}
              {...register('career', {
                required: 'La carrera es requerida',
              })}
            />

            <Select
              label="Semestre (opcional)"
              placeholder="Selecciona tu semestre"
              options={semesterOptions}
              error={errors.semester?.message}
              {...register('semester', {
                valueAsNumber: true,
              })}
            />

            <div className="relative">
              <Input
                label="Contraseña"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                helperText="Mínimo 6 caracteres"
                error={errors.password?.message}
                {...register('password', {
                  required: 'La contraseña es requerida',
                  minLength: {
                    value: 6,
                    message: 'La contraseña debe tener al menos 6 caracteres',
                  },
                })}
              />
              <button
                type="button"
                className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              isLoading={isLoading}
              disabled={isLoading}
            >
              {isLoading ? 'Creando cuenta...' : 'Crear cuenta'}
            </Button>
          </form>

          <div className="mt-6">
            <div className="text-xs text-gray-500 text-center">
              Al crear una cuenta, aceptas nuestros{' '}
              <Link href="/terms" className="text-blue-600 hover:text-blue-500">
                Términos de Servicio
              </Link>{' '}
              y{' '}
              <Link href="/privacy" className="text-blue-600 hover:text-blue-500">
                Política de Privacidad
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
