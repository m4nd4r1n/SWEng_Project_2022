/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["imagedelivery.net", "videodelivery.net"],
  },
  experimental: { images: { layoutRaw: true } },
};

module.exports = nextConfig;
