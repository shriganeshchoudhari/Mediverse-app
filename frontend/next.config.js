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
};

module.exports = withPWA(nextConfig);
