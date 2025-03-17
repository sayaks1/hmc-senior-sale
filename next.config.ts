import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [];
  },
  async rewrites() {
    return [];
  },
  assetPrefix: process.env.NODE_ENV === 'production' 
    ? 'https://hmc-senior-sale-jytiirw1h-saya-kim-suzukis-projects.vercel.app' 
    : ''
};

export default nextConfig;
