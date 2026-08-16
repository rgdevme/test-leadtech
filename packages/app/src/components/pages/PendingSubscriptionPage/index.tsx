"use client"

import { subscriptionResponseSchema, type SubscriptionResponse } from "@leadtech/common/contracts"
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
					<span className='mx-auto grid size-14 place-items-center rounded-xl bg-green-50 text-green-700'>
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

					<div className='mx-auto mt-12 grid max-w-2xl gap-px overflow-hidden rounded-xl border border-sage-200 bg-sage-200 sm:grid-cols-3'>
						{en.subscription.accessSteps.map((step, index) => (
							<div
								className='bg-sage-50 p-6 text-left'
								key={step.title}>
								<Text
									as='span'
									className='grid size-7 place-items-center rounded-full bg-sage-100 text-xs font-bold text-sage-950'
									unstyled>
									{index + 1}
								</Text>
								<Heading
									className='mt-5 text-base font-semibold'
									level={2}>
									{step.title}
								</Heading>
								<Text
									className='mt-2 text-sm leading-6 text-sage-600'
									unstyled>
									{step.description}
								</Text>
							</div>
						))}
					</div>

					{error ? (
						<Text
							className='mt-6 text-sm text-red-700'
							role='alert'
							unstyled>
							{error}
						</Text>
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
