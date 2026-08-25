/** @type {import('next').NextConfig} */
const withPWA = require('@ducanh2912/next-pwa').default({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  swcMinify: true,
  workboxOptions: {
    disableDevLogs: true,
  }
});

const nextConfig = {
  async rewrites() {
    const backendUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8085';
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
      {
        source: '/ws/:path*',
        destination: `${backendUrl}/ws/:path*`,
      },
      {
        source: '/simulations/ecg',
        destination: '/simulators/cardiac-cycle',
      },
      {
        source: '/simulations/:path*',
        destination: '/simulators/:path*',
      },
      {
        source: '/healthcare/allopathic/mbbs',
        destination: '/healthcare/allopathic',
      },
      {
        source: '/healthcare/allopathic/md-ms',
        destination: '/healthcare/allopathic',
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/cardiovascular',
        destination: '/healthcare/allopathic/mbbs/cardiovascularadv',
        permanent: false,
      },
      {
        source: '/anatomy2',
        destination: '/healthcare/allopathic/mbbs/anatomy2',
        permanent: false,
      },
      {
        source: '/biochemistry2',
        destination: '/healthcare/allopathic/mbbs/biochemistry2',
        permanent: false,
      },
      {
        source: '/dermatologyadv',
        destination: '/healthcare/allopathic/mbbs/dermatologyadv',
        permanent: false,
      },
      ...[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((n) => ({
        source: `/pg${n}`,
        destination: `/healthcare/allopathic/md-ms/pg/${n}`,
        permanent: false,
      })),
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; font-src 'self' data:; connect-src 'self' http://localhost:8085 http://127.0.0.1:8085 ws://localhost:8085 wss://localhost:8085 https:; frame-ancestors 'none';"
          }
        ]
      }
    ];
  },
};

module.exports = withPWA(nextConfig);
