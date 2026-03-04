import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      new URL('https://api.peridotvault.com/**'),
      new URL('https://api-dev.peridotvault.com/**'),
      new URL('https://avatars.githubusercontent.com/**'),
      new URL('https://cryptologos.cc/**'),
    ],
  },
  output: 'standalone',
};

export default nextConfig;
