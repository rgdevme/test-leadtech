import type { NextConfig } from "next"

const nextConfig: NextConfig = {
	agentRules: false,
	transpilePackages: ["@leadtech/common"]
}

export default nextConfig
