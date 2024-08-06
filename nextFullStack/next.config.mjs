/** @type {import('next').NextConfig} */
const nextConfig = {
    // next.config.js
    reactStrictMode:false,
    webpack: (config, { isServer }) => {
      // Handle ESM packages for server-side rendering
      if (isServer) {
        config.externals = ['@vertx/core', ...config.externals];
      }
      return config;
    },
    experimental: {
    serverComponentsExternalPackages: ["pdf-parse"],
    
  },
  async rewrites() {
    return [
      {
        source: '/api/flask/:path*',
        destination: 'http://127.0.0.1:5000/:path*'
      }
    ]
  }
  
};

export default nextConfig;
