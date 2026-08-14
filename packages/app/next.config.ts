import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  agentRules: false,
  transpilePackages: ["@leadtech/contracts"],
};

export default nextConfig;
