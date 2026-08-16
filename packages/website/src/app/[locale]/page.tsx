import { notFound } from "next/navigation"

import { LandingPage } from "@/components/pages/LandingPage"
import { isLocale } from "@/i18n/config"
import { getDictionary } from "@/i18n/getDictionary"

type LocalizedPageProps = {
	params: Promise<{ locale: string }>
}

const LocalizedPage = async ({ params }: LocalizedPageProps) => {
	const { locale } = await params

	if (!isLocale(locale)) {
		notFound()
	}

	const copy = await getDictionary(locale)

	return (
		<LandingPage
			copy={copy}
			locale={locale}
		/>
	)
}

export default LocalizedPage
