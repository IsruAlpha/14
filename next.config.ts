import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "original-lemming-226.convex.cloud",
      },
    ],
  },
};

export default nextConfig;
