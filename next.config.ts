import type { NextConfig } from "next";

function parseRemotePattern(url: string) {
  const parsed = new URL(url);
  return {
    protocol: parsed.protocol.replace(':', '') as 'http' | 'https',
    hostname: parsed.hostname,
    port: parsed.port || undefined,
    pathname: '/**',
  };
}

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      parseRemotePattern(apiBaseUrl),
      { protocol: 'http', hostname: 'localhost', pathname: '/**' },
      { protocol: 'https', hostname: 'api.peridotvault.com', pathname: '/**' },
      { protocol: 'https', hostname: 'api.staging.peridotvault.com', pathname: '/**' },
      { protocol: 'https', hostname: 'api-dev.peridotvault.com', pathname: '/**' },
      { protocol: 'https', hostname: 'avatars.githubusercontent.com', pathname: '/**' },
      { protocol: 'https', hostname: 'cryptologos.cc', pathname: '/**' },
    ],
    minimumCacheTTL: 60 * 60 * 24 * 7,
    deviceSizes: [640, 768, 1024, 1280, 1536],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  experimental: {
    optimizePackageImports: [
      "@fortawesome/fontawesome-svg-core",
      "@fortawesome/free-solid-svg-icons",
      "@fortawesome/free-brands-svg-icons",
      "@fortawesome/free-regular-svg-icons",
    ],
  },
  output: "standalone",
};

export default nextConfig;
