import type { SubscriptionPlan } from "@leadtech/common/contracts"
import type { PropsWithChildren } from "react"

import { SubscriptionPlanCard } from "@/components/molecules/SubscriptionPlanCard"
import styles from "./index.module.css"

type SubscriptionPlanListProps = PropsWithChildren<
	{
		plans: readonly SubscriptionPlan[]
	} & (
		| {
				hrefs: Readonly<Record<string, string>>
				onSelect?: never
				selectedPlanKey?: never
		  }
		| {
				hrefs?: never
				onSelect: (planKey: string) => void
				selectedPlanKey: string | null
		  }
	)
>

const getPlanHref = (hrefs: Readonly<Record<string, string>>, planKey: string) => {
	const href = hrefs[planKey]

	if (!href) {
		throw new Error("Every navigable subscription plan must have a destination.")
	}

	return href
}

export const SubscriptionPlanList = (props: SubscriptionPlanListProps) => {
	const { hrefs } = props

	return (
		<div className={styles.grid}>
			{props.plans.map(plan =>
				hrefs ? (
					<SubscriptionPlanCard
						href={getPlanHref(hrefs, plan.key)}
						key={plan.key}
						plan={plan}
					/>
				) : (
					<SubscriptionPlanCard
						key={plan.key}
						onSelect={props.onSelect}
						plan={plan}
						selected={props.selectedPlanKey === plan.key}
					/>
				)
			)}
		</div>
	)
}
