"use client"

import { IconArrowRight, IconShieldCheck } from "@tabler/icons-react"
import { useState, type PropsWithChildren } from "react"

import type { SubscriptionResponse } from "@leadtech/contracts"

import { Button } from "@/components/atoms/Button"
import { Heading } from "@/components/atoms/Heading"
import { Text } from "@/components/atoms/Text"
import { SubscriptionBadge } from "@/components/molecules/SubscriptionBadge"
import { SubscriptionModal } from "@/components/organisms/SubscriptionModal"
import { en } from "@/data/locale/en"

type SubscriptionPanelProps = PropsWithChildren<{
	subscription: SubscriptionResponse
}>

export const SubscriptionPanel = ({ subscription }: SubscriptionPanelProps) => {
	const [modalOpen, setModalOpen] = useState(false)

	return (
		<>
			<section className='rounded-xl border border-line bg-white p-6 sm:p-8'>
				<div className='flex flex-col justify-between gap-6 sm:flex-row sm:items-start'>
					<div className='max-w-xl'>
						<span className='grid size-10 place-items-center rounded-lg bg-pale-green text-success'>
							<IconShieldCheck
								size={21}
								stroke={1.8}
							/>
						</span>
						<Heading
							className='mt-5 text-2xl'
							level={2}>
							{en.subscription.manageHeading}
						</Heading>
						<Text className='mt-2 text-sm'>{en.subscription.manageDescription}</Text>
					</div>
					<SubscriptionBadge subscription={subscription} />
				</div>

				<div className='mt-8 flex flex-col gap-5 border-t border-line pt-6 sm:flex-row sm:items-end sm:justify-between'>
					<div>
						<Text
							className='text-xs font-bold uppercase text-muted'
							unstyled>
							{en.subscription.updated}
						</Text>
						<Text
							className='mt-1.5 text-sm font-semibold text-charcoal'
							unstyled>
							{subscription.updatedAt
								? new Date(subscription.updatedAt).toLocaleString()
								: en.subscription.notConfirmed}
						</Text>
					</div>
					{!subscription.entitled ? (
						<Button onClick={() => setModalOpen(true)}>
							{en.subscription.subscribe}
							<IconArrowRight
								size={18}
								stroke={2}
							/>
						</Button>
					) : null}
				</div>
			</section>
			<SubscriptionModal
				onClose={() => setModalOpen(false)}
				open={modalOpen}
			/>
		</>
	)
}
