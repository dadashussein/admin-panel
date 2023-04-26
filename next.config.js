/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["lh3.googleusercontent.com", "e-ticaret-dadas.s3.amazonaws.com"],
  },
};

module.exports = nextConfig;
