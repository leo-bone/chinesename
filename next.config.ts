import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Remove static export to enable Cloudflare Pages Functions for API
  // output: 'export',  // Disabled for API support
  distDir: 'dist',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
