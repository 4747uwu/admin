/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  typescript: {
    // Disable type checking during build
    ignoreBuildErrors: true,
  },
  eslint: {
    // Disable ESLint during build
    ignoreDuringBuilds: true,
  },
  experimental: {
    // Disable strict mode for better compatibility
    forceSwcTransforms: true,
  },
  // Disable source maps in production for faster builds
  productionBrowserSourceMaps: false,
  images: {
    domains: ["192.168.1.27", "flagcdn.com", "164.92.87.147"], // Add your server IP
    remotePatterns: [
      {
        protocol: "http",
        hostname: "192.168.1.51",
        port: "6006",
        pathname: "/storage/**",
      },
      {
        protocol: "http",
        hostname: "164.92.87.147",
        port: "5000",
        pathname: "/storage/**",
      },
    ],
  },
};

export default nextConfig;
