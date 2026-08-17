"use client"

import { documentRecordSchema } from "@leadtech/common/contracts"
import { useRouter } from "next/navigation"
import { useState } from "react"

import { useLocale } from "@/hooks/useLocale"
import { routes } from "@/i18n/routes"
import { ApiClientError, requestJson } from "@/utils/apiClient"

type UseCreateDocumentOptions = {
	onError: (message: string | null) => void
	onSubscriptionRequired: () => void
}

export const useCreateDocument = ({
	onError,
	onSubscriptionRequired
}: UseCreateDocumentOptions) => {
	const { dictionary, locale } = useLocale()
	const router = useRouter()
	const [creating, setCreating] = useState(false)

	const createDocument = async () => {
		setCreating(true)
		onError(null)

		try {
			const document = await requestJson("/api/documents", { method: "POST" }, documentRecordSchema)
			router.push(routes.document(locale, document.id))
		} catch (error) {
			if (error instanceof ApiClientError && error.code === "subscription_required") {
				onSubscriptionRequired()
			} else {
				onError(
					error instanceof Error ? error.message : dictionary.workspace.documents.mutationError
				)
			}
		} finally {
			setCreating(false)
		}
	}

	return { createDocument, creating }
}
