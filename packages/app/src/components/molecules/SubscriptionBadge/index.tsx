import type { PropsWithChildren } from "react"

import type { SubscriptionResponse } from "@leadtech/contracts"

import { en } from "@/data/locale/en"

type SubscriptionBadgeProps = PropsWithChildren<{
	subscription: SubscriptionResponse
}>

export const SubscriptionBadge = ({ subscription }: SubscriptionBadgeProps) => {
	const label = subscription.entitled
		? subscription.status === "trialing"
			? en.subscription.trialing
			: en.subscription.active
		: en.subscription.inactive

	return (
		<span
			className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.08em] ${
				subscription.entitled ? "bg-pale-green text-success" : "bg-pale-yellow text-warning"
			}`}>
			<span className='size-1.5 rounded-full bg-current' />
			{label}
		</span>
	)
}
