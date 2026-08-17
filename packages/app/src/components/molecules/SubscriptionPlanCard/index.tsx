"use client"

import { IconCheck } from "@tabler/icons-react"
import type { PropsWithChildren } from "react"

import type { SubscriptionPlan } from "@leadtech/common/contracts"

import { Heading } from "@/components/atoms/Heading"
import { Text } from "@/components/atoms/Text"
import { useLocale } from "@/hooks/useLocale"
import styles from "./index.module.css"

type SubscriptionPlanCardProps = PropsWithChildren<{
	onSelect: (planKey: string) => void
	plan: SubscriptionPlan
	selected: boolean
}>

const formatPrice = (plan: SubscriptionPlan) =>
	new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: plan.currency,
		maximumFractionDigits: 0
	}).format(plan.unitAmount / 100)

export const SubscriptionPlanCard = ({ onSelect, plan, selected }: SubscriptionPlanCardProps) => {
	const { dictionary } = useLocale()

	return (
		<button
			aria-pressed={selected}
			className={styles.card}
			data-selected={selected}
			onClick={() => onSelect(plan.key)}
			type='button'>
			<div className={styles.row}>
				<div>
					<Heading
						className={styles.heading}
						as='h3'>
						{plan.name}
					</Heading>
					<Text
						className={styles.description}
						unstyled>
						{plan.description}
					</Text>
				</div>
				<span className={styles.selectionIndicator}>
					<IconCheck
						size={14}
						stroke={3}
					/>
				</span>
			</div>

			<div className={styles.row2}>
				<Text
					as='span'
					className={styles.text}
					unstyled>
					{formatPrice(plan)}
				</Text>
				<Text
					as='span'
					className={styles.interval}
					unstyled>
					{dictionary.workspace.subscription.priceConnector} {plan.interval}
				</Text>
			</div>

			<ul className={styles.list}>
				{plan.features.map(feature => (
					<li
						className={styles.listItem}
						key={feature}>
						<IconCheck
							className={styles.icon}
							size={16}
							stroke={2.2}
						/>
						<Text
							as='span'
							unstyled>
							{feature}
						</Text>
					</li>
				))}
			</ul>

			<Text
				as='span'
				className={styles.text2}
				unstyled>
				{selected
					? dictionary.workspace.subscription.selectedPlan
					: dictionary.workspace.subscription.selectPlan}
			</Text>
		</button>
	)
}
