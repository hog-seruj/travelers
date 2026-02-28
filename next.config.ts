import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ftp.goit.study',
      },
    ],
  },
};

export default nextConfig;


