import { notFound } from "next/navigation"

import { LandingPage } from "@/components/pages/LandingPage"
import { isLocale } from "@/i18n/config"
import { getDictionary } from "@/i18n/getDictionary"
import { listSubscriptionPlans } from "@/services/subscriptionPlans"

type LocalizedPageProps = {
	params: Promise<{ locale: string }>
}

export const dynamic = "force-dynamic"

const LocalizedPage = async ({ params }: LocalizedPageProps) => {
	const { locale } = await params

	if (!isLocale(locale)) {
		notFound()
	}

	const [copy, plans] = await Promise.all([getDictionary(locale), listSubscriptionPlans()])

	return (
		<LandingPage
			copy={copy.marketing}
			locale={locale}
			metadata={copy.metadata}
			plans={plans}
		/>
	)
}

export default LocalizedPage
