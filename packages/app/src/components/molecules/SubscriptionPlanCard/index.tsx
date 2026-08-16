import { IconCheck } from "@tabler/icons-react"
import type { PropsWithChildren } from "react"

import type { SubscriptionPlan } from "@leadtech/common/contracts"

import { Heading } from "@/components/atoms/Heading"
import { Text } from "@/components/atoms/Text"
import { en } from "@/data/locale/en"

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

export const SubscriptionPlanCard = ({ onSelect, plan, selected }: SubscriptionPlanCardProps) => (
	<button
		aria-pressed={selected}
		className={`group relative flex size-full min-h-80 flex-col overflow-hidden rounded-xl border p-6 text-left transition active:scale-[0.99] ${
			selected
				? "border-sage-950 bg-sage-950 text-sage-50"
				: "border-sage-200 bg-sage-50 text-sage-950 hover:border-sage-400"
		}`}
		onClick={() => onSelect(plan.key)}
		type='button'>
		<div className='flex items-start justify-between gap-4'>
			<div>
				<Heading
					className={`text-xl font-semibold ${selected ? "text-sage-50" : "text-sage-950"}`}
					level={3}>
					{plan.name}
				</Heading>
				<Text
					className={`mt-2 text-sm leading-6 ${selected ? "text-sage-50/65" : "text-sage-600"}`}
					unstyled>
					{plan.description}
				</Text>
			</div>
			<span
				className={`grid size-6 shrink-0 place-items-center rounded-full border ${
					selected
						? "border-sage-50 bg-sage-50 text-sage-950"
						: "border-sage-200 bg-sage-100 text-sage-950/0"
				}`}>
				<IconCheck
					size={14}
					stroke={3}
				/>
			</span>
		</div>

		<div className='mt-8 flex items-baseline gap-2'>
			<Text
				as='span'
				className='font-serif text-4xl'
				unstyled>
				{formatPrice(plan)}
			</Text>
			<Text
				as='span'
				className={`text-sm ${selected ? "text-sage-50/60" : "text-sage-600"}`}
				unstyled>
				{en.subscription.priceConnector} {plan.interval}
			</Text>
		</div>

		<ul className='mt-auto grid gap-3 pt-8 text-sm'>
			{plan.features.map(feature => (
				<li
					className='flex items-start gap-2.5'
					key={feature}>
					<IconCheck
						className='mt-0.5 shrink-0'
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
			className='mt-6 text-xs font-bold uppercase'
			unstyled>
			{selected ? en.subscription.selectedPlan : en.subscription.selectPlan}
		</Text>
	</button>
)
