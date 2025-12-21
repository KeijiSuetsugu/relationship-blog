import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  output: 'export',
  basePath: isProd ? '/relationship-blog' : '',
  assetPrefix: isProd ? '/relationship-blog/' : '',
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
