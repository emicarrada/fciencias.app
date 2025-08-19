import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'FcienciasApp - Red Social Académica',
  description: 'Red social académica para la comunidad de la Facultad de Ciencias de la UNAM',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <div id="root">{children}</div>
      </body>
    </html>
  );
}
