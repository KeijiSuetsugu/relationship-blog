import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },
  // 日本語パスでのTurbopackエラー回避
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
