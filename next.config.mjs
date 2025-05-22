const nextConfig = {
  output: 'standalone',
  // Remove the experimental.serverActions option as it's now available by default
  experimental: {
    // serverActions: true, // This line was causing the error
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Ensure CSS is properly processed
  webpack: (config) => {
    return config;
  },
  // Add this to ensure CSS is properly loaded
  sassOptions: {
    includePaths: ['./app'],
  },
}

export default nextConfig
