import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  reactStrictMode: true,
  images: {
    domains: process.env.NEXT_PUBLIC_IMAGE_DOMAINS?.split(",") || [],
  },
  /* config options here */
};

export default nextConfig;
