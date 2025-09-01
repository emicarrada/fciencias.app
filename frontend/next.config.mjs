/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'fciencias.app',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'api.fciencias.app',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Configuración para Docker
  output: 'standalone',
  // Configuración para producción
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  // swcMinify is enabled by default in Next.js 15+
};

export default nextConfig;
