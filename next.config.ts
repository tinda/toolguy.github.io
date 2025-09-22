import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production'

const nextConfig: NextConfig = {
  output: isProd ? 'export' : undefined,
  reactStrictMode: true,
  assetPrefix: isProd
    ? 'https://tinda.github.io/toolguy.github.io/'
    : undefined
  /* config options here */
};

export default nextConfig;
