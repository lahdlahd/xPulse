/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: false,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  typescript: {
    tsconfigPath: './tsconfig.json',
    ignoreBuildErrors: true, // Skip type checking for Viem/Wagmi types
  },
  experimental: {
    optimizePackageImports: ['@chakra-ui/react'],
  },
  // ESLint during build
  eslint: {
    dirs: ['src'],
    ignoreDuringBuilds: true, // Skip ESLint during build
  },
};

module.exports = nextConfig;
