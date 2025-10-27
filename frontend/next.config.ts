import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone", // Enable standalone output for Docker
  images: {
    domains: ["drive.google.com"],
  },
  env: {
    NEXT_PUBLIC_BACKEND_URL:
      process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000",
  },
};

export default nextConfig;
