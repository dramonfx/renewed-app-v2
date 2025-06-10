
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Performance optimizations
  experimental: {
    // optimizeCss: true, // Disabled due to critters dependency issue
  },
  
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },

  // Image configuration
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'zisyaqerlvnblkbooekh.supabase.co',
        port: '',
        pathname: '/storage/v1/object/sign/book-assets/**',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        port: '',
        pathname: '/**',
      },
    ],
  },

  // Compression
  compress: true,

  // Power by header removal
  poweredByHeader: false,
};

export default nextConfig;