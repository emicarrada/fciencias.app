'use client';

import dynamic from 'next/dynamic';

const EmailVerificationModalExample = dynamic(() => import('@/components/ui/EmailVerificationModalExample'));

export default function TestEmailVerificationPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <EmailVerificationModalExample />
    </main>
  );
}
