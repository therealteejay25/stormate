import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["www.freeiconspng.com"],
  },
  eslint: {
    ignoreDuringBuilds: true, // disables ESLint in Vercel build
  },
};

export default nextConfig;
