/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
    ],
  },
  // Fix for Supabase ESM compatibility with Next.js 14
  transpilePackages: ['@supabase/supabase-js', '@supabase/ssr'],
}

module.exports = nextConfig
