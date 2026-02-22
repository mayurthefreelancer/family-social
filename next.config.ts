// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {},
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
    localPatterns: [
      {
        pathname: "/uploads/**",
        search: "**",
      },
    ],
  },
};

export default nextConfig;