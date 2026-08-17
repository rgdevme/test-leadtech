"use client"

import { IconArrowRight, IconShieldCheck } from "@tabler/icons-react"
import { useState, type PropsWithChildren } from "react"

import type { SubscriptionResponse } from "@leadtech/common/contracts"

import { Button } from "@/components/atoms/Button"
import { Heading } from "@/components/atoms/Heading"
import { Text } from "@/components/atoms/Text"
import { SubscriptionBadge } from "@/components/molecules/SubscriptionBadge"
import { SubscriptionModal } from "@/components/organisms/SubscriptionModal"
import { useLocale } from "@/hooks/useLocale"
import styles from "./index.module.css"

type SubscriptionPanelProps = PropsWithChildren<{
	subscription: SubscriptionResponse
}>

export const SubscriptionPanel = ({ subscription }: SubscriptionPanelProps) => {
	const { dictionary } = useLocale()
	const [modalOpen, setModalOpen] = useState(false)

	return (
		<>
			<section className={styles.section}>
				<div className={styles.row}>
					<div className={styles.container}>
						<span className={styles.text}>
							<IconShieldCheck
								size={21}
								stroke={1.8}
							/>
						</span>
						<Heading
							className={styles.heading}
							as='h2'>
							{dictionary.workspace.subscription.manageHeading}
						</Heading>
						<Text className={styles.text2}>
							{dictionary.workspace.subscription.manageDescription}
						</Text>
					</div>
					<SubscriptionBadge subscription={subscription} />
				</div>

				<div className={styles.row2}>
					<div>
						<Text
							className={styles.text3}
							unstyled>
							{dictionary.workspace.subscription.updated}
						</Text>
						<Text
							className={styles.text4}
							unstyled>
							{subscription.updatedAt
								? new Date(subscription.updatedAt).toLocaleString()
								: dictionary.workspace.subscription.notConfirmed}
						</Text>
					</div>
					{!subscription.entitled ? (
						<Button onClick={() => setModalOpen(true)}>
							{dictionary.workspace.subscription.subscribe}
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
