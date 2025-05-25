/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { 
    unoptimized: true,
    domains: ['images.pexels.com'] // 允许Pexels图片域名
  },
  // 移除webpack cache设置，让Vercel处理
  experimental: {
    serverComponentsExternalPackages: ['openai']
  },
  // 确保API路由在Vercel上正常工作
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
  // 为Vercel优化构建
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
};

module.exports = nextConfig;