import type { MetadataRoute } from "next"

import { environment } from "@/config/environment"
import { locales } from "@/i18n/config"

const sitemap = (): MetadataRoute.Sitemap => {
	return locales.map(locale => ({
		url: new URL(`/${locale}`, environment.siteUrl).toString(),
		changeFrequency: "monthly",
		priority: 1
	}))
}

export default sitemap
