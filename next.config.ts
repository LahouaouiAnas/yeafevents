import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Dev only: lets a phone on the same Wi-Fi use the dev server via the PC's LAN IP.
  allowedDevOrigins: ["192.168.*.*"],
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [60, 75, 90],
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "cdn.sanity.io" },
    ],
  },
  experimental: {
    globalNotFound: true,
  },
  // Former service pages now served by the event categories (see src/lib/routes.ts).
  // The site was never indexed, but permanent redirects keep any shared link working.
  async redirects() {
    return [
      { source: "/fr/services/mariage", destination: "/fr/mariages", permanent: true },
      { source: "/en/services/weddings", destination: "/en/weddings", permanent: true },
      { source: "/fr/services/soiree-privee", destination: "/fr/soirees-privees", permanent: true },
      // French private-party page renamed from its English slug.
      { source: "/fr/private-parties", destination: "/fr/soirees-privees", permanent: true },
      { source: "/en/services/private-parties", destination: "/en/private-parties", permanent: true },
      { source: "/fr/services/evenement-entreprise", destination: "/fr/seminaires", permanent: true },
      { source: "/en/services/corporate-events", destination: "/en/seminars", permanent: true },
    ];
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
