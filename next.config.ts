import { NextConfig } from "next";
import path from "path";

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
    // Removed API caching - APIs will not be cached anymore
    {
      urlPattern: /\.(png|jpg|jpeg|svg|gif|webp|ico)$/,
      handler: "CacheFirst",
      options: {
        cacheName: "images-cache",
        expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 30 }, // 30 days
        cacheableResponse: {
          statuses: [200],
        },
      },
    },
    {
      urlPattern: /\.(css|js)$/,
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "static-resources",
        expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 7 }, // 7 days
      },
    },
    {
      urlPattern: /^(?!.*\/api\/).*$/, // Exclude /api/ routes from caching
      handler: "NetworkFirst",
      options: {
        cacheName: "pages-cache",
        expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 * 7 }, // 7 days
      },
    },
  ],
});

const nextConfig: NextConfig = {
  images: {
    // Using remotePatterns (modern approach) - this allows all HTTPS domains
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // This allows all HTTPS domains
      },
      {
        protocol: "http",
        hostname: "localhost", // For local development
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "studyhere.asigdel.com.np",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack(config) {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(__dirname, "src"),
    };
    return config;
  },
  async headers() {
    return [
      {
        source: "/sitemap.xml",
        headers: [
          {
            key: "Content-Type",
            value: "application/xml",
          },
          {
            key: "Cache-Control",
            value: "public, max-age=3600, must-revalidate",
          },
        ],
      },
      // Add no-cache headers for API routes
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, no-cache, must-revalidate, proxy-revalidate",
          },
          {
            key: "Pragma",
            value: "no-cache",
          },
          {
            key: "Expires",
            value: "0",
          },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/:path*`,
      },
    ];
  },
};

export default withPWA(nextConfig);
