import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true, // Disable default image optimization
  },
  output: isProd ? 'export' : undefined,
  assetPrefix: isProd ? '/toolguy.github.io/' : '',
  basePath: isProd ? '/toolguy.github.io' : '',
  /* config options here */
};

export default nextConfig;
