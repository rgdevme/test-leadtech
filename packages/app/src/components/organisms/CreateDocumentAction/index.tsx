"use client"

import { IconPlus } from "@tabler/icons-react"
import type { PropsWithChildren, ReactNode } from "react"
import { useState } from "react"

import { Button } from "@/components/atoms/Button"
import { Text } from "@/components/atoms/Text"
import { SubscriptionModal } from "@/components/organisms/SubscriptionModal"
import { useCreateDocument } from "@/hooks/useCreateDocument"
import { useLocale } from "@/hooks/useLocale"
import styles from "./index.module.css"

type CreateDocumentActionProps = PropsWithChildren

export const CreateDocumentAction: (props: CreateDocumentActionProps) => ReactNode = () => {
	const { dictionary } = useLocale()
	const [error, setError] = useState<string | null>(null)
	const [subscriptionModalOpen, setSubscriptionModalOpen] = useState(false)
	const { createDocument, creating } = useCreateDocument({
		onError: setError,
		onSubscriptionRequired: () => setSubscriptionModalOpen(true)
	})

	return (
		<div className={styles.container}>
			<Button
				aria-label={
					creating ? dictionary.workspace.documents.creating : dictionary.workspace.documents.create
				}
				className={styles.action}
				loading={creating}
				onClick={() => void createDocument()}>
				<IconPlus
					aria-hidden='true'
					size={18}
					stroke={2}
				/>
				<span className={styles.label}>
					{creating
						? dictionary.workspace.documents.creating
						: dictionary.workspace.documents.create}
				</span>
			</Button>
			{error ? (
				<Text
					className={styles.error}
					role='alert'
					unstyled>
					{error}
				</Text>
			) : null}
			<SubscriptionModal
				onClose={() => setSubscriptionModalOpen(false)}
				open={subscriptionModalOpen}
			/>
		</div>
	)
}
