import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    // Products are listed in the lab index; there is no separate /products page.
    return [{ source: "/products", destination: "/lab", permanent: false }];
  },
};

export default nextConfig;
