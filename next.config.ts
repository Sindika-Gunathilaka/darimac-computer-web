import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['sqlite3'],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('sqlite3');
    }
    return config;
  },
  images: {
    domains: ['res.cloudinary.com'],
  },
};

export default nextConfig;
