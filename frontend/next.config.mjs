/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'fciencias.app', 'api.fciencias.app'],
  },
  // Configuración para Docker
  output: 'standalone',
  // Configuración para producción
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  swcMinify: true,
};

export default nextConfig;
