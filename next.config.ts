import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  // 日本語パスでのTurbopackエラー回避
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
