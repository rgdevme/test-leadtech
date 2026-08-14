"use client"

import { subscriptionResponseSchema, type SubscriptionResponse } from "@leadtech/contracts"
import { IconCheck, IconRefresh, IconShieldCheck } from "@tabler/icons-react"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useRef, useState, type PropsWithChildren } from "react"

import { Button } from "@/components/atoms/Button"
import { Heading } from "@/components/atoms/Heading"
import { Text } from "@/components/atoms/Text"
import { WorkspaceTemplate } from "@/components/templates/WorkspaceTemplate"
import { en } from "@/data/locale/en"
import { requestJson } from "@/utils/apiClient"

type PendingSubscriptionPageProps = PropsWithChildren

const DEADLINE_MILLISECONDS = 30_000
const POLL_INTERVAL_MILLISECONDS = 2_000

export const PendingSubscriptionPage = ({}: PendingSubscriptionPageProps) => {
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
				router.replace("/documents")
				router.refresh()
			}
			return subscription
		} catch (checkError) {
			setError(checkError instanceof Error ? checkError.message : en.documents.mutationError)
			return null
		}
	}, [router])

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
					className='mx-auto max-w-3xl py-8 text-center sm:py-16'
					data-reveal>
					<span className='mx-auto grid size-14 place-items-center rounded-xl bg-pale-green text-success'>
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
						className='mt-7 max-w-5xl text-[clamp(2.8rem,7vw,5.8rem)] leading-[0.94]'
						level={1}
						serif>
						{timedOut ? en.subscription.pendingStillWaiting : en.subscription.pending}
					</Heading>
					<Text className='mx-auto mt-6 max-w-xl'>
						{timedOut
							? en.subscription.pendingStillWaitingDescription
							: en.subscription.pendingDescription}
					</Text>

					<div className='mx-auto mt-12 grid max-w-2xl gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-3'>
						{en.subscription.accessSteps.map((step, index) => (
							<div
								className='bg-white p-6 text-left'
								key={step.title}>
								<span className='grid size-7 place-items-center rounded-full bg-bone text-xs font-bold text-charcoal'>
									{index + 1}
								</span>
								<h2 className='mt-5 text-base font-semibold text-charcoal'>{step.title}</h2>
								<p className='mt-2 text-sm leading-6 text-muted'>{step.description}</p>
							</div>
						))}
					</div>

					{error ? (
						<p
							className='mt-6 text-sm text-danger'
							role='alert'>
							{error}
						</p>
					) : null}

					<Button
						className='mt-9'
						loading={checking}
						onClick={() => void refreshStatus()}>
						{checking ? en.subscription.checking : en.subscription.refresh}
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
