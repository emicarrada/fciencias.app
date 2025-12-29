import dynamic from 'next/dynamic';

const EmailVerificationModalExample = dynamic(() => import('@/components/ui/EmailVerificationModalExample'), { ssr: false });

export default function TestEmailVerificationPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <EmailVerificationModalExample />
    </main>
  );
}

export const metadata = {
  title: 'Test Email Verification Modal | FCiencias',
  description: 'Página de prueba para el modal de verificación de email',
};
