import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  async redirects() {
    return [
      // Products are listed in the lab index; there is no separate /products page.
      { source: "/products", destination: "/lab", permanent: false },
      // Serve one canonical host: send Vercel's production aliases to the custom domain.
      // Per-deployment and branch preview URLs are left alone.
      {
        source: "/:path*",
        has: [{ type: "host", value: "ilyntlabs-web(-bilalabics-projects)?\\.vercel\\.app" }],
        destination: "https://ilyntlabs.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
