import type { PropsWithChildren } from "react"

import type { SubscriptionResponse } from "@leadtech/common/contracts"

import { Text } from "@/components/atoms/Text"
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
		<Text
			as='span'
			className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[0.68rem] font-bold uppercase ${
				subscription.entitled ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-800"
			}`}
			unstyled>
			<span className='size-1.5 rounded-full bg-current' />
			{label}
		</Text>
	)
}
