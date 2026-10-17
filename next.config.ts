import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: {
    // Produktbilder aus Shopify
    remotePatterns: [{ protocol: "https", hostname: "cdn.shopify.com" }],
  },
  poweredByHeader: false,
  devIndicators: false,
};

export default nextConfig;
