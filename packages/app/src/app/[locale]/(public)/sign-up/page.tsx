import { subscriptionPlanKeySchema } from "@leadtech/common/contracts"

import { SignUpPage as SignUpPageView } from "@/components/pages/SignUpPage"

type SignUpPageProps = {
	params: Promise<{ locale: string }>
	searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function SignUpPage({ searchParams }: SignUpPageProps) {
	const query = await searchParams
	const intent = query.intent === "subscribe" ? "subscribe" : undefined
	const plan = subscriptionPlanKeySchema.safeParse(query.plan)

	return (
		<SignUpPageView
			intent={intent}
			planKey={plan.success ? plan.data : undefined}
		/>
	)
}
