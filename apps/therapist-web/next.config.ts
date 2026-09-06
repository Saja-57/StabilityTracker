import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    "@stability/design-tokens",
    "@stability/i18n",
    "@stability/supabase",
  ],
};

export default nextConfig;
