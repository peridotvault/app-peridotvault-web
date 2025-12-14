import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL('https://api.peridotvault.com/**')],
  },
  output: 'standalone',
};

export default nextConfig;
