import { notFound } from "next/navigation"

import { documentIdSchema } from "@leadtech/common/contracts"

import { DocumentEditorPage } from "@/components/pages/DocumentEditorPage"
import { requireSessionPrincipal } from "@/guards/authentication"
import { getDocument } from "@/repositories/documents"
import { getSubscription } from "@/repositories/subscriptions"

type DocumentPageProps = {
	params: Promise<{ documentId: string; locale: string }>
}

export default async function DocumentPage({ params }: DocumentPageProps) {
	const principal = await requireSessionPrincipal()
	const documentId = documentIdSchema.safeParse((await params).documentId)
	if (!documentId.success) {
		notFound()
	}

	const [document, subscription] = await Promise.all([
		getDocument(principal.uid, documentId.data),
		getSubscription(principal.uid)
	])
	if (!document) {
		notFound()
	}

	return (
		<DocumentEditorPage
			document={document}
			subscription={subscription}
		/>
	)
}
