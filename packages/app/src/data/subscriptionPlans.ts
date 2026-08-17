import type { SubscriptionPlan } from "@leadtech/common/contracts"

import { en } from "@/data/locale/en"

export const publicSubscriptionPlans = [
	{
		key: "write",
		...en.plans.write,
		features: [...en.plans.write.features],
		unitAmount: 1200,
		currency: "usd",
		interval: "month",
		featured: false
	},
	{
		key: "studio",
		...en.plans.studio,
		features: [...en.plans.studio.features],
		unitAmount: 2200,
		currency: "usd",
		interval: "month",
		featured: true
	},
	{
		key: "studioYearly",
		...en.plans.studioYearly,
		features: [...en.plans.studioYearly.features],
		unitAmount: 22000,
		currency: "usd",
		interval: "year",
		featured: false
	}
] as const satisfies readonly SubscriptionPlan[]
