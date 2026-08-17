"use client"

import { IconCheck } from "@tabler/icons-react"
import type { PropsWithChildren } from "react"

import type { SubscriptionPlan } from "@leadtech/common/contracts"

import { Heading } from "@/components/atoms/Heading"
import { Text } from "@/components/atoms/Text"
import { useLocale } from "@/hooks/useLocale"
import styles from "./index.module.css"

type SubscriptionPlanCardProps = PropsWithChildren<
	{
		plan: SubscriptionPlan
	} & (
		| {
				href: string
				onSelect?: never
				selected?: never
		  }
		| {
				href?: never
				onSelect: (planKey: string) => void
				selected: boolean
		  }
	)
>

const formatPrice = (locale: string, plan: SubscriptionPlan) =>
	new Intl.NumberFormat(locale, {
		style: "currency",
		currency: plan.currency,
		maximumFractionDigits: 0
	}).format(plan.unitAmount / 100)

export const SubscriptionPlanCard = (props: SubscriptionPlanCardProps) => {
	const { dictionary, locale } = useLocale()
	const { plan } = props
	const selected = "selected" in props && props.selected === true
	const intervalNames =
		plan.intervalCount === 1
			? dictionary.workspace.subscription.intervals.singular
			: dictionary.workspace.subscription.intervals.plural
	const formattedInterval =
		plan.intervalCount === 1
			? intervalNames[plan.interval]
			: `${plan.intervalCount} ${intervalNames[plan.interval]}`
	const content = (
		<>
			<div className={styles.row}>
				<div>
					<Heading
						className={styles.heading}
						as='h3'>
						{plan.name}
					</Heading>
					{plan.description ? (
						<Text
							className={styles.description}
							unstyled>
							{plan.description}
						</Text>
					) : null}
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
					{formatPrice(locale, plan)}
				</Text>
				<Text
					as='span'
					className={styles.interval}
					unstyled>
					{dictionary.workspace.subscription.priceConnector} {formattedInterval}
				</Text>
			</div>

			{plan.features.length > 0 ? (
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
			) : null}

			<Text
				as='span'
				className={styles.text2}
				unstyled>
				{selected
					? dictionary.workspace.subscription.selectedPlan
					: dictionary.workspace.subscription.selectPlan}
			</Text>
		</>
	)

	if ("href" in props) {
		return (
			<a
				className={styles.card}
				href={props.href}>
				{content}
			</a>
		)
	}

	return (
		<button
			aria-pressed={selected}
			className={styles.card}
			data-selected={selected}
			onClick={() => props.onSelect(plan.key)}
			type='button'>
			{content}
		</button>
	)
}
