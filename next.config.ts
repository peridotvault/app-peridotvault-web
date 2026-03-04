import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      new URL('https://api.peridotvault.com/**'),
      new URL('https://api-dev.peridotvault.com/**'),
    ],
  },
  output: 'standalone',
};

export default nextConfig;
