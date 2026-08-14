import { subscriptionPlanKeySchema } from "@leadtech/contracts"

import { SignInPage as SignInPageView } from "@/components/pages/SignInPage"

type SignInPageProps = {
	searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function SignInPage({ searchParams }: SignInPageProps) {
	const query = await searchParams
	const intent = query.intent === "subscribe" ? "subscribe" : undefined
	const plan = subscriptionPlanKeySchema.safeParse(query.plan)

	return (
		<SignInPageView
			intent={intent}
			planKey={plan.success ? plan.data : undefined}
			sessionExpired={query.session === "expired"}
		/>
	)
}
