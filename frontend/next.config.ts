// frontend/next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '5000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'seo-dashboard-vv2j.onrender.com',
        pathname: '/uploads/**',
      },
    ],
  },
  // ❌ REMOVE this entire experimental block
  // experimental: {
  //   serverActions: true,
  // },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  swcMinify: true,
  poweredByHeader: false,
  compress: true,
  output: 'standalone',
};

export default nextConfig;