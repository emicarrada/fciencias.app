'use client';

import { useState } from 'react';
import { CompleteOnboarding } from '@/components/onboarding/CompleteOnboarding';
import { OnboardingData } from '@/types/onboarding';

export default function TestOnboardingPage() {
  const [showResults, setShowResults] = useState(false);
  const [userData, setUserData] = useState<OnboardingData | null>(null);

  const handleOnboardingComplete = async (data: OnboardingData) => {
    console.log('✅ Onboarding completado:', data);
    setUserData(data);
    setShowResults(true);
  };

  const handleOnboardingCancel = () => {
    console.log('❌ Onboarding cancelado');
    window.location.href = '/';
  };

  const resetTest = () => {
    setShowResults(false);
    setUserData(null);
  };

  if (showResults && userData) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <h1 className="text-3xl font-heading font-bold text-gray-900 mb-2">
                ¡Onboarding Completado! 🎉
              </h1>
              <p className="text-gray-600 font-body">
                Los datos han sido capturados exitosamente
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Datos del Usuario */}
              <div className="space-y-6">
                <h2 className="text-xl font-heading font-semibold text-gray-800 mb-4">
                  Datos Capturados
                </h2>
                
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                    <p className="font-body text-gray-900">{userData.email}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-gray-600 mb-1">Nombre Completo</label>
                    <p className="font-body text-gray-900">{userData.fullName}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-gray-600 mb-1">Username</label>
                    <p className="font-body text-gray-900">@{userData.username}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-gray-600 mb-1">Carrera</label>
                    <p className="font-body text-gray-900">{userData.career}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-gray-600 mb-1">Color de Avatar</label>
                    <p className="font-body text-gray-900">{userData.avatarColor}</p>
                  </div>
                </div>
              </div>

              {/* Vista Previa del Perfil */}
              <div className="space-y-6">
                <h2 className="text-xl font-heading font-semibold text-gray-800 mb-4">
                  Vista Previa del Perfil
                </h2>
                
                <div className="bg-gradient-to-br from-primary-50 to-primary-100 p-6 rounded-xl border border-primary-200">
                  <div className="text-center">
                    <div className={`
                      w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg
                      ${getAvatarClasses(userData.avatarColor)}
                    `}>
                      <span className="text-2xl font-heading font-bold text-white">
                        {userData.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <h3 className="text-lg font-heading font-semibold text-primary-800">
                      {userData.fullName}
                    </h3>
                    <p className="text-primary-600 font-body">@{userData.username}</p>
                    <p className="text-primary-600 font-body text-sm">{userData.email}</p>
                    <div className="mt-3 inline-block px-3 py-1 bg-primary-200 text-primary-800 rounded-full text-sm font-body font-medium">
                      {userData.career}
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-heading font-medium text-gray-800 mb-2">JSON Output</h4>
                  <pre className="text-xs bg-gray-800 text-green-400 p-3 rounded overflow-x-auto">
                    {JSON.stringify(userData, null, 2)}
                  </pre>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center space-x-4">
              <button
                onClick={resetTest}
                className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-body font-medium"
              >
                Probar de Nuevo
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-body font-medium"
              >
                Volver al Inicio
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <CompleteOnboarding
      onComplete={handleOnboardingComplete}
      onCancel={handleOnboardingCancel}
    />
  );
}

function getAvatarClasses(color: string) {
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-500',
    indigo: 'bg-indigo-500',
    purple: 'bg-purple-500',
    pink: 'bg-pink-500',
    red: 'bg-red-500',
    orange: 'bg-orange-500',
    yellow: 'bg-yellow-500 text-black',
    green: 'bg-green-500',
    teal: 'bg-teal-500',
    cyan: 'bg-cyan-500',
    gray: 'bg-gray-500',
    slate: 'bg-slate-500',
  };
  
  return colorMap[color] || 'bg-blue-500';
}
