import type { NextConfig } from "next";

// No CSP yet: the portals inject per-agency fonts/colors, maplibre runs from a
// blob worker and next-themes inlines a script, so a strict policy needs its
// own pass. Frames stay same-origin because the site editor previews in an iframe.
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(self)" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
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
