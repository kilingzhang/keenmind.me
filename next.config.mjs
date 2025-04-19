import { setupDevPlatform } from '@cloudflare/next-on-pages/next-dev';
import withBundleAnalyzer from '@next/bundle-analyzer';
// import withPWA from 'next-pwa';

// Here we use the @cloudflare/next-on-pages next-dev module to allow us to use bindings during local development
// (when running the application with `next dev`), for more information see:
// https://github.com/cloudflare/next-on-pages/blob/main/internal-packages/next-dev/README.md
if (process.env.NODE_ENV === 'development') {
  await setupDevPlatform();
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: true,
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  experimental: {
    serverActions: {
      allowedForwardedHosts: ['keenmind.me', 'admin.keenmind.me'],
      allowedOrigins: ['https://keenmind.me', 'https://admin.keenmind.me']
    },
    optimizeCss: true,
    optimizePackageImports: [
      'next-auth',
      'lodash',
      'sonner',
      '@radix-ui/react-alert-dialog',
      'class-variance-authority'
    ],
    scrollRestoration: true,
    workerThreads: true
  },
  redirects: async () => {
    return [
      {
        source: '/admin',
        destination: '/admin/dashboard',
        permanent: true,
      },
      {
        source: '/admin/users',
        destination: '/admin/users/accounts',
        permanent: true,
      },
      {
        source: '/admin/domains',
        destination: '/admin/knowledge/domains',
        permanent: true,
      },
    ];
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    minimumCacheTTL: 60,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com'
      }
    ]
  },
  async headers() {
    return [
    ];
  },
};

// export default (withPWA({
//   dest: 'public/pwa',
//   disable: process.env.NODE_ENV === 'development',
// })(withBundleAnalyzer({
//   enabled: process.env.ANALYZE === 'true',
// })(nextConfig)));

export default (withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})(nextConfig));
