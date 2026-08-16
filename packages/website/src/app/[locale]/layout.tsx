import type { Metadata } from "next"
import { notFound } from "next/navigation"
import type { PropsWithChildren } from "react"

import { environment } from "@/config/environment"
import { isLocale, locales } from "@/i18n/config"
import { getDictionary } from "@/i18n/getDictionary"

type LocalizedLayoutProps = PropsWithChildren<{
	params: Promise<{ locale: string }>
}>

export const generateStaticParams = () => locales.map(locale => ({ locale }))

export const generateMetadata = async ({
	params
}: Pick<LocalizedLayoutProps, "params">): Promise<Metadata> => {
	const { locale } = await params

	if (!isLocale(locale)) {
		notFound()
	}

	const copy = await getDictionary(locale)
	const canonicalUrl = new URL(`/${locale}`, environment.siteUrl)

	return {
		applicationName: copy.metadata.applicationName,
		metadataBase: environment.siteUrl,
		title: {
			default: copy.metadata.title,
			template: `%s | ${copy.metadata.applicationName}`
		},
		description: copy.metadata.description,
		alternates: {
			canonical: canonicalUrl,
			languages: {
				"en-US": new URL("/en", environment.siteUrl)
			}
		},
		openGraph: {
			type: "website",
			locale: copy.locale.replace("-", "_"),
			url: canonicalUrl,
			siteName: copy.metadata.applicationName,
			title: copy.metadata.title,
			description: copy.metadata.description,
			images: [{ url: "/opengraph-image", alt: copy.metadata.imageAlt }]
		},
		twitter: {
			card: "summary_large_image",
			title: copy.metadata.title,
			description: copy.metadata.description,
			images: ["/opengraph-image"]
		},
		category: "productivity"
	}
}

const LocalizedLayout = async ({ children, params }: LocalizedLayoutProps) => {
	const { locale } = await params

	if (!isLocale(locale)) {
		notFound()
	}

	return children
}

export default LocalizedLayout
