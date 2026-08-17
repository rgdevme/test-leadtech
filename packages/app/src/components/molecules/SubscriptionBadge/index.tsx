"use client"

import type { PropsWithChildren } from "react"

import type { SubscriptionResponse } from "@leadtech/common/contracts"

import { Text } from "@/components/atoms/Text"
import { useLocale } from "@/hooks/useLocale"
import styles from "./index.module.css"

type SubscriptionBadgeProps = PropsWithChildren<{
	subscription: SubscriptionResponse
}>

export const SubscriptionBadge = ({ subscription }: SubscriptionBadgeProps) => {
	const { dictionary } = useLocale()
	const label = subscription.entitled
		? subscription.status === "trialing"
			? dictionary.workspace.subscription.trialing
			: dictionary.workspace.subscription.active
		: dictionary.workspace.subscription.inactive

	return (
		<Text
			as='span'
			className={styles.subscription}
			data-entitled={subscription.entitled}
			unstyled>
			<span className={styles.badge} />
			{label}
		</Text>
	)
}
