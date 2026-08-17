"use client"

import {
	createCheckoutResponseSchema,
	listSubscriptionPlansResponseSchema,
	type SubscriptionPlan
} from "@leadtech/common/contracts"
import { IconArrowRight, IconX } from "@tabler/icons-react"
import { useEffect, useMemo, useState, type PropsWithChildren } from "react"

import { Button } from "@/components/atoms/Button"
import { Dialog } from "@/components/atoms/Dialog"
import { Heading } from "@/components/atoms/Heading"
import { IconButton } from "@/components/atoms/IconButton"
import { Text } from "@/components/atoms/Text"
import { SubscriptionPlanCard } from "@/components/molecules/SubscriptionPlanCard"
import { useLocale } from "@/hooks/useLocale"
import { requestJson } from "@/utils/apiClient"
import styles from "./index.module.css"

type SubscriptionModalProps = PropsWithChildren<{
	initialPlanKey?: string
	onClose: () => void
	open: boolean
}>

export const SubscriptionModal = ({ initialPlanKey, onClose, open }: SubscriptionModalProps) => {
	const { dictionary } = useLocale()
	const [plans, setPlans] = useState<SubscriptionPlan[]>([])
	const [selectedPlanKey, setSelectedPlanKey] = useState<string | null>(null)
	const [loading, setLoading] = useState(false)
	const [plansLoaded, setPlansLoaded] = useState(false)
	const [checkoutLoading, setCheckoutLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		if (!open || plansLoaded || loading) {
			return
		}

		const loadPlans = async () => {
			setLoading(true)
			setError(null)
			try {
				const response = await requestJson(
					"/api/billing/plans",
					{ method: "GET", cache: "no-store" },
					listSubscriptionPlansResponseSchema
				)
				setPlans(response.items)
				const requestedPlan = response.items.find(plan => plan.key === initialPlanKey)
				const featuredPlan = response.items.find(plan => plan.featured)
				setSelectedPlanKey(
					requestedPlan?.key ?? featuredPlan?.key ?? response.items[0]?.key ?? null
				)
			} catch (loadError) {
				setError(
					loadError instanceof Error
						? loadError.message
						: dictionary.workspace.documents.mutationError
				)
			} finally {
				setLoading(false)
				setPlansLoaded(true)
			}
		}

		void loadPlans()
	}, [dictionary.workspace.documents.mutationError, initialPlanKey, loading, open, plansLoaded])

	const selectedPlan = useMemo(
		() => plans.find(plan => plan.key === selectedPlanKey) ?? null,
		[plans, selectedPlanKey]
	)

	const startCheckout = async () => {
		if (!selectedPlan) {
			return
		}

		setCheckoutLoading(true)
		setError(null)
		try {
			const response = await requestJson(
				"/api/billing/checkout",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						"Idempotency-Key": crypto.randomUUID()
					},
					body: JSON.stringify({ intent: "subscribe", planKey: selectedPlan.key })
				},
				createCheckoutResponseSchema
			)
			window.location.assign(response.checkoutUrl)
		} catch (checkoutError) {
			setError(
				checkoutError instanceof Error
					? checkoutError.message
					: dictionary.workspace.documents.mutationError
			)
			setCheckoutLoading(false)
		}
	}

	return (
		<Dialog
			labelledBy='subscription-modal-title'
			onClose={onClose}
			open={open}>
			<div className={styles.container}>
				<div className={styles.row}>
					<div className={styles.container2}>
						<Heading
							as='h2'
							className={styles.heading}
							id='subscription-modal-title'>
							{dictionary.workspace.subscription.modalTitle}
						</Heading>
						<Text className={styles.text}>
							{dictionary.workspace.subscription.modalDescription}
						</Text>
					</div>
					<IconButton
						label={dictionary.common.close}
						onClick={onClose}>
						<IconX
							size={20}
							stroke={1.8}
						/>
					</IconButton>
				</div>

				{loading ? (
					<div className={styles.grid}>{dictionary.common.loading}</div>
				) : plans.length > 0 ? (
					<div className={styles.grid2}>
						{plans.map(plan => (
							<div
								className={styles.container3}
								key={plan.key}>
								<SubscriptionPlanCard
									onSelect={setSelectedPlanKey}
									plan={plan}
									selected={selectedPlanKey === plan.key}
								/>
							</div>
						))}
					</div>
				) : (
					<div className={styles.card}>
						<Heading
							className={styles.heading2}
							as='h3'>
							{dictionary.workspace.subscription.unavailable}
						</Heading>
						<Text className={styles.text2}>
							{dictionary.workspace.subscription.unavailableDescription}
						</Text>
					</div>
				)}

				{error ? (
					<p
						className={styles.error}
						role='alert'>
						{error}
					</p>
				) : null}

				<div className={styles.row2}>
					<Button
						onClick={onClose}
						variant='secondary'>
						{dictionary.workspace.subscription.dismiss}
					</Button>
					<Button
						disabled={!selectedPlan}
						loading={checkoutLoading}
						onClick={() => void startCheckout()}>
						{dictionary.workspace.subscription.confirm}
						{!checkoutLoading ? (
							<IconArrowRight
								size={18}
								stroke={2}
							/>
						) : null}
					</Button>
				</div>
			</div>
		</Dialog>
	)
}
