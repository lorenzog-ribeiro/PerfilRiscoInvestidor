/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  eslint: {
    // Desabilitar verificação de ESLint durante o build
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Opcionalmente, também podemos ignorar erros de TypeScript durante o build
    ignoreBuildErrors: true,
  },
  // Desabilita o telemetry do Next.js
  telemetry: false,
  // Configurações adicionais
  poweredByHeader: false,
  reactStrictMode: true,
  swcMinify: true,
}

module.exports = nextConfig