import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import { GoogleAnalytics } from '@next/third-parties/google';
import Providers from '@/components/Providers';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/navigation/BottomNav';
import AppLayout from '@/components/navigation/AppLayout';
import '../styles/globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: 'FcienciasApp - Red Social Académica',
  description: 'Red social académica para la comunidad de la Facultad de Ciencias de la UNAM',
  keywords: ['UNAM', 'Facultad de Ciencias', 'comunidad académica', 'estudiantes', 'investigación'],
  authors: [{ name: 'Facultad de Ciencias UNAM' }],
  creator: 'Facultad de Ciencias UNAM',
  publisher: 'Facultad de Ciencias UNAM',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/logo-prometeo-fciencias-favicon.png', sizes: 'any', type: 'image/png' },
    ],
    apple: [
      { url: '/logo-prometeo-fciencias-favicon.png', sizes: 'any', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
  openGraph: {
    type: 'website',
    locale: 'es_MX',
    url: '/',
    title: 'FcienciasApp - Red Social Académica',
    description: 'Red social académica para la comunidad de la Facultad de Ciencias de la UNAM',
    siteName: 'FcienciasApp',
    images: [
      {
        url: '/logo-fciencias.png',
        width: 956,
        height: 276,
        alt: 'Logo Facultad de Ciencias UNAM',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FcienciasApp - Red Social Académica',
    description: 'Red social académica para la comunidad de la Facultad de Ciencias de la UNAM',
    images: ['/logo-fciencias.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const analyticsEnabled = process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true';

  return (
    <html lang="es">
      <body className="font-body">
        <Providers>
          <BottomNav />
          <AppLayout>
            <Header />
            <main id="root" className="flex-1">{children}</main>
          </AppLayout>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#10B981',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 4000,
                iconTheme: {
                  primary: '#EF4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </Providers>
        {analyticsEnabled && gaId && <GoogleAnalytics gaId={gaId} />}
      </body>
    </html>
  );
}
