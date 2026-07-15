import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        // Uploadthing CDN
        protocol: "https",
        hostname: "*.ufs.sh",
      },
      {
        // Google profile images
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        // Generic HTTPS image sources
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
