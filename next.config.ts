const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
  register: true,
  skipWaiting: true,
  cacheOneFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadingOnOnline: true,
  swcMinify: true,
  disable: process.env.NODE_ENV === "development",
  workBoxOptions: {
    disableDevlogs: true,
  },
  runtimeCaching: [
    {
      urlPattern: /^\/api\/.*$/, // Match Next.js API routes
      handler: "NetworkFirst",
      options: {
        cacheName: "api-cache",
        networkTimeoutSeconds: 5, // If the network takes too long, serve cache
        expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 }, // Cache for 1 day
        cacheableResponse: {
          statuses: [200], // Cache only successful responses
        },
      },
    },
    {
      urlPattern: /^https?:\/\/.*/, // Cache all static assets
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "static-resources",
        expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 7 }, // Cache for 7 days
      },
    },
    {
      urlPattern: /\/.*/, // Cache all pages
      handler: "NetworkFirst",
      options: {
        cacheName: "pages-cache",
        expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 * 7 }, // Cache for 7 days
      },
    },
  ],
});

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https", // Accepts only secure images
        hostname: "**", // Wildcard to allow all hosts
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true, // This will ignore all TypeScript errors during build
  },
  webpack(config: any) {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": require("path").resolve(__dirname, "src"),
    };
    return config;
  },
};

module.exports = withPWA(nextConfig);
