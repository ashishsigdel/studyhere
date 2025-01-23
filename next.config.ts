/** @type {import('next').NextConfig} */

const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
  cacheOneFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadingOnOnline: true,
  swcMinify: true,
  disable: false,
  workBoxOptions: {
    disableDevlogs: true,
  },
});

const nextConfig = {
  typescript: {
    ignoreBuildErrors: true, // This will ignore all TypeScript errors during build
  },
};

module.exports = withPWA(nextConfig);
