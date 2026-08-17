"use client"

import { subscriptionResponseSchema, type SubscriptionResponse } from "@leadtech/common/contracts"
import { IconCheck, IconRefresh, IconShieldCheck } from "@tabler/icons-react"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useRef, useState, type PropsWithChildren } from "react"

import { Button } from "@/components/atoms/Button"
import { Heading } from "@/components/atoms/Heading"
import { Text } from "@/components/atoms/Text"
import { WorkspaceTemplate } from "@/components/templates/WorkspaceTemplate"
import { useLocale } from "@/hooks/useLocale"
import { routes } from "@/i18n/routes"
import { requestJson } from "@/utils/apiClient"
import styles from "./index.module.css"

type PendingSubscriptionPageProps = PropsWithChildren

const DEADLINE_MILLISECONDS = 30_000
const POLL_INTERVAL_MILLISECONDS = 2_000

export const PendingSubscriptionPage = ({}: PendingSubscriptionPageProps) => {
	const { dictionary, locale } = useLocale()
	const router = useRouter()
	const startedAt = useRef(0)
	const [checking, setChecking] = useState(true)
	const [timedOut, setTimedOut] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const checkSubscription = useCallback(async (): Promise<SubscriptionResponse | null> => {
		setError(null)
		try {
			const subscription = await requestJson(
				"/api/billing/subscription",
				{ method: "GET", cache: "no-store" },
				subscriptionResponseSchema
			)
			if (subscription.entitled) {
				router.replace(routes.documents(locale))
				router.refresh()
			}
			return subscription
		} catch (checkError) {
			setError(
				checkError instanceof Error
					? checkError.message
					: dictionary.workspace.documents.mutationError
			)
			return null
		}
	}, [dictionary.workspace.documents.mutationError, locale, router])

	useEffect(() => {
		startedAt.current = Date.now()
		let timeoutId: ReturnType<typeof setTimeout> | undefined
		let cancelled = false

		const poll = async () => {
			const subscription = await checkSubscription()
			if (cancelled || subscription?.entitled) {
				return
			}

			if (Date.now() - startedAt.current >= DEADLINE_MILLISECONDS) {
				setChecking(false)
				setTimedOut(true)
				return
			}

			timeoutId = setTimeout(() => void poll(), POLL_INTERVAL_MILLISECONDS)
		}

		void poll()
		return () => {
			cancelled = true
			if (timeoutId) {
				clearTimeout(timeoutId)
			}
		}
	}, [checkSubscription])

	const refreshStatus = async () => {
		setChecking(true)
		const subscription = await checkSubscription()
		if (!subscription?.entitled) {
			setChecking(false)
		}
	}

	return (
		<WorkspaceTemplate>
			<WorkspaceTemplate.Content>
				<section
					className={styles.section}
					data-reveal>
					<span className={styles.text}>
						{timedOut ? (
							<IconRefresh
								size={27}
								stroke={1.8}
							/>
						) : (
							<IconShieldCheck
								size={27}
								stroke={1.8}
							/>
						)}
					</span>
					<Heading
						as='h1'
						className={styles.heading}>
						{timedOut
							? dictionary.workspace.subscription.pendingStillWaiting
							: dictionary.workspace.subscription.pending}
					</Heading>
					<Text className={styles.text2}>
						{timedOut
							? dictionary.workspace.subscription.pendingStillWaitingDescription
							: dictionary.workspace.subscription.pendingDescription}
					</Text>

					<div className={styles.card}>
						{dictionary.workspace.subscription.accessSteps.map((step, index) => (
							<div
								className={styles.container}
								key={step.title}>
								<Text
									as='span'
									className={styles.text3}
									unstyled>
									{index + 1}
								</Text>
								<Heading
									className={styles.heading2}
									as='h2'>
									{step.title}
								</Heading>
								<Text
									className={styles.text4}
									unstyled>
									{step.description}
								</Text>
							</div>
						))}
					</div>

					{error ? (
						<Text
							className={styles.error}
							role='alert'
							unstyled>
							{error}
						</Text>
					) : null}

					<Button
						className={styles.action}
						loading={checking}
						onClick={() => void refreshStatus()}>
						{checking
							? dictionary.workspace.subscription.checking
							: dictionary.workspace.subscription.refresh}
						{!checking ? (
							<IconCheck
								size={18}
								stroke={2}
							/>
						) : null}
					</Button>
				</section>
			</WorkspaceTemplate.Content>
		</WorkspaceTemplate>
	)
}
