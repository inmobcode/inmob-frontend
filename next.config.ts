import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    agentUpgrade: "security",
  },
  images: {
    // Landing photos come from Unsplash (free license, no attribution required).
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/photo-**",
      },
    ],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  // These pages used to live at their Spanish names; keep old links working.
  async redirects() {
    return [
      { source: "/ayuda", destination: "/help", permanent: true },
      { source: "/terminos", destination: "/terms", permanent: true },
      { source: "/privacidad", destination: "/privacy", permanent: true },
    ];
  },
};

export default nextConfig;
