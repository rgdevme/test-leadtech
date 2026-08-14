import { subscriptionPlanKeySchema } from "@leadtech/contracts"

import { DocumentsPage as DocumentsPageView } from "@/components/pages/DocumentsPage"
import { requireSessionPrincipal } from "@/guards/authentication"
import { listDocuments } from "@/repositories/documents"
import { getSubscription } from "@/repositories/subscriptions"

type DocumentsPageProps = {
	searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function DocumentsPage({ searchParams }: DocumentsPageProps) {
	const principal = await requireSessionPrincipal()
	const query = await searchParams
	const [documents, subscription] = await Promise.all([
		listDocuments(principal.uid),
		getSubscription(principal.uid)
	])
	const plan = subscriptionPlanKeySchema.safeParse(query.plan)

	return (
		<DocumentsPageView
			documents={documents}
			initialPlanKey={plan.success ? plan.data : undefined}
			openSubscription={query.intent === "subscribe"}
			subscription={subscription}
		/>
	)
}
