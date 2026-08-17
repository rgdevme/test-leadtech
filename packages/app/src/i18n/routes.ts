import type { SubscriptionPlanKey } from "@leadtech/common/contracts"

import type { Locale } from "@/i18n/config"

const localizedPath = (locale: Locale, path = "") => `/${locale}${path}` as const

export const routes = {
	home: (locale: Locale) => localizedPath(locale),
	signIn: (locale: Locale) => localizedPath(locale, "/sign-in"),
	signUp: (locale: Locale) => localizedPath(locale, "/sign-up"),
	documents: (locale: Locale) => localizedPath(locale, "/documents"),
	document: (locale: Locale, documentId: string) =>
		localizedPath(locale, `/documents/${documentId}`),
	profile: (locale: Locale) => localizedPath(locale, "/profile"),
	pendingSubscription: (locale: Locale) => localizedPath(locale, "/subscribe/pending")
}

export const createSubscribePath = (locale: Locale, planKey?: SubscriptionPlanKey) => {
	const searchParams = new URLSearchParams({ intent: "subscribe" })

	if (planKey) {
		searchParams.set("plan", planKey)
	}

	return `${routes.signUp(locale)}?${searchParams.toString()}`
}
