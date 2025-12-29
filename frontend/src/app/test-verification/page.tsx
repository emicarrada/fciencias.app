/**
 * Página de Prueba: RequireVerification Guard
 * 
 * Ruta: /test-verification
 * 
 * Esta página permite probar el funcionamiento del guard RequireVerification
 * con diferentes tipos de interacción y estados de verificación.
 */

import { RequireVerificationExample } from '@/components/guards/RequireVerificationExample';

export default function TestVerificationPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <RequireVerificationExample />
    </main>
  );
}

export const metadata = {
  title: 'Test Verification Guard | FCiencias',
  description: 'Página de prueba para el sistema de verificación progresiva',
};
