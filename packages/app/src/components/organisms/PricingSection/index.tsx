import type { SubscriptionPlan } from "@leadtech/common/contracts"
import type { PropsWithChildren } from "react"

import { Container, Heading, Text } from "@/components/atoms"
import { SubscriptionPlanList } from "@/components/molecules"
import type { Locale } from "@/i18n/config"
import type { Dictionary } from "@/i18n/getDictionary"
import { createSubscribePath } from "@/i18n/routes"
import styles from "./index.module.css"

type PricingSectionProps = PropsWithChildren<{
	copy: Dictionary["marketing"]["pricing"]
	locale: Locale
	plans: readonly SubscriptionPlan[]
}>

export const PricingSection = ({ copy, locale, plans }: PricingSectionProps) => {
	const hrefs = Object.fromEntries(
		plans.map(plan => [plan.key, createSubscribePath(locale, plan.key)])
	)

	return (
		<section
			className={styles.section}
			id='pricing'>
			<Container>
				<div
					className={styles.heading}
					data-reveal>
					<Text
						as='span'
						variant='eyebrow'>
						{copy.eyebrow}
					</Text>
					<Heading
						as='h2'
						size='section'>
						{copy.title}
					</Heading>
					<Text
						size='lead'
						tone='muted'>
						{copy.description}
					</Text>
				</div>
				<SubscriptionPlanList
					hrefs={hrefs}
					plans={plans}
				/>
			</Container>
		</section>
	)
}
