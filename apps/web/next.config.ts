import type { NextConfig } from 'next';

const config: NextConfig = {
  transpilePackages: ['@trend-radar/shared'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.google.com' },
      { protocol: 'https', hostname: '*.googleapis.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
    ],
  },
};

export default config;
