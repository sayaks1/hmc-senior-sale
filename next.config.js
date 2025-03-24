/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@radix-ui/react-icons', '@radix-ui/react-slot'],
  experimental: {
    optimizeCss: true,
  }
};

module.exports = nextConfig;
