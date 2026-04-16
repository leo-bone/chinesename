import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cloudflare Pages compatible configuration
  distDir: '.next',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
