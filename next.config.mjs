/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'zisyaqerlvnblkbooekh.supabase.co', // This is correct
        port: '', // Correct for default port
        // CORRECTED PATHNAME for signed URLs from a private bucket:
        pathname: '/storage/v1/object/sign/book-assets/**',
      },
    ],
  },
};

export default nextConfig;