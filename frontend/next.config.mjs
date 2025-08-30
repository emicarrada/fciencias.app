/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'fciencias.app', 'api.fciencias.app'],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_BASE_URL}/:path*`,
      },
    ];
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
