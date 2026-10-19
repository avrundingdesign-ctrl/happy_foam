import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  poweredByHeader: false,
  devIndicators: false,
  // www.happyfoam.org → happyfoam.org
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.happyfoam.org" }],
        destination: "https://happyfoam.org/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

import("@opennextjs/cloudflare").then((m) => m.initOpenNextCloudflareForDev());
