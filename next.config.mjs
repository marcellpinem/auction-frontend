/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-d32d75bd0f3a4b81812adbe206b8a7c3.r2.dev",
      },
    ],
  },
};

export default nextConfig;
