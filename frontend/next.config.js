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
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8085';
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
};

module.exports = withPWA(nextConfig);
