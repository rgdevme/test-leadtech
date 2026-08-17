import type { MetadataRoute } from "next"

import { applicationUrl } from "@/config/environment"

const robots = (): MetadataRoute.Robots => {
	return {
		rules: {
			userAgent: "*",
			allow: "/"
		},
		sitemap: new URL("/sitemap.xml", applicationUrl).toString(),
		host: applicationUrl.origin
	}
}

export default robots
