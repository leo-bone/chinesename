import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Don't use static export - Cloudflare Pages will handle SSR
  // output: 'export',  // Disabled - needed for API routes
  distDir: '.next',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // Cloudflare Pages Functions directory
  serverFunctions: {
    relativeBasePath: true,
  },
};

export default nextConfig;
