"use client"

import {
	documentRecordSchema,
	type DocumentSummary,
	type SubscriptionResponse
} from "@leadtech/common/contracts"
import { IconArrowRight, IconPlus } from "@tabler/icons-react"
import { useRouter } from "next/navigation"
import { useRef, useState, type PropsWithChildren } from "react"

import { Button } from "@/components/atoms/Button"
import { Heading } from "@/components/atoms/Heading"
import { Text } from "@/components/atoms/Text"
import { ConfirmDeleteDialog } from "@/components/molecules/ConfirmDeleteDialog"
import { EmptyState } from "@/components/molecules/EmptyState"
import { SubscriptionBadge } from "@/components/molecules/SubscriptionBadge"
import { DocumentList } from "@/components/organisms/DocumentList"
import { SubscriptionModal } from "@/components/organisms/SubscriptionModal"
import { WorkspaceTemplate } from "@/components/templates/WorkspaceTemplate"
import { useEditorialMotion } from "@/hooks/useEditorialMotion"
import { useLocale } from "@/hooks/useLocale"
import { routes } from "@/i18n/routes"
import { ApiClientError, requestJson, requestNoContent } from "@/utils/apiClient"
import styles from "./index.module.css"

type DocumentsPageProps = PropsWithChildren<{
	documents: DocumentSummary[]
	initialPlanKey?: string
	openSubscription: boolean
	subscription: SubscriptionResponse
}>

export const DocumentsPage = ({
	documents: initialDocuments,
	initialPlanKey,
	openSubscription,
	subscription
}: DocumentsPageProps) => {
	const { dictionary, locale } = useLocale()
	const router = useRouter()
	const scope = useRef<HTMLElement>(null)
	const [documents, setDocuments] = useState(initialDocuments)
	const [modalOpen, setModalOpen] = useState(openSubscription)
	const [creating, setCreating] = useState(false)
	const [deleteTarget, setDeleteTarget] = useState<DocumentSummary | null>(null)
	const [deleting, setDeleting] = useState(false)
	const [error, setError] = useState<string | null>(null)
	useEditorialMotion(scope)

	const handleSubscriptionRequired = (errorValue: unknown) => {
		if (errorValue instanceof ApiClientError && errorValue.code === "subscription_required") {
			setModalOpen(true)
			return true
		}
		return false
	}

	const createDocument = async () => {
		if (!subscription.entitled) {
			setModalOpen(true)
			return
		}

		setCreating(true)
		setError(null)
		try {
			const document = await requestJson("/api/documents", { method: "POST" }, documentRecordSchema)
			router.push(routes.document(locale, document.id))
		} catch (createError) {
			if (!handleSubscriptionRequired(createError)) {
				setError(
					createError instanceof Error
						? createError.message
						: dictionary.workspace.documents.mutationError
				)
			}
			setCreating(false)
		}
	}

	const renameDocument = async (document: DocumentSummary, title: string) => {
		setError(null)
		try {
			const updated = await requestJson(
				`/api/documents/${document.id}`,
				{
					method: "PATCH",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ title, expectedVersion: document.version })
				},
				documentRecordSchema
			)
			setDocuments(current =>
				current.map(item =>
					item.id === updated.id
						? {
								...item,
								title: updated.title,
								version: updated.version,
								updatedAt: updated.updatedAt
							}
						: item
				)
			)
		} catch (renameError) {
			if (!handleSubscriptionRequired(renameError)) {
				setError(
					renameError instanceof Error
						? renameError.message
						: dictionary.workspace.documents.mutationError
				)
			}
		}
	}

	const deleteDocument = async () => {
		if (!deleteTarget) {
			return
		}

		setDeleting(true)
		setError(null)
		try {
			await requestNoContent(`/api/documents/${deleteTarget.id}`, { method: "DELETE" })
			setDocuments(current => current.filter(document => document.id !== deleteTarget.id))
			setDeleteTarget(null)
		} catch (deleteError) {
			if (!handleSubscriptionRequired(deleteError)) {
				setError(
					deleteError instanceof Error
						? deleteError.message
						: dictionary.workspace.documents.mutationError
				)
			}
		} finally {
			setDeleting(false)
		}
	}

	return (
		<section ref={scope}>
			<WorkspaceTemplate>
				<WorkspaceTemplate.Header>
					<div
						className={styles.row}
						data-reveal>
						<div className={styles.container}>
							<SubscriptionBadge subscription={subscription} />
							<Heading
								as='h2'
								className={styles.heading}>
								{dictionary.workspace.documents.title}
							</Heading>
							<Text className={styles.text}>{dictionary.workspace.documents.description}</Text>
						</div>
						<Button
							className={styles.action}
							loading={creating}
							onClick={() => void createDocument()}>
							<IconPlus
								size={18}
								stroke={2}
							/>
							{creating
								? dictionary.workspace.documents.creating
								: dictionary.workspace.documents.create}
						</Button>
					</div>
					{!subscription.entitled ? (
						<button
							className={styles.button}
							onClick={() => setModalOpen(true)}
							type='button'>
							<Text
								as='span'
								unstyled>
								{dictionary.workspace.documents.readOnlyNotice}
							</Text>
							<IconArrowRight
								className={styles.icon}
								size={18}
								stroke={2}
							/>
						</button>
					) : null}
					{error ? (
						<Text
							className={styles.error}
							role='alert'
							unstyled>
							{error}
						</Text>
					) : null}
				</WorkspaceTemplate.Header>

				<WorkspaceTemplate.Content>
					{documents.length > 0 ? (
						<DocumentList
							documents={documents}
							editable={subscription.entitled}
							onDelete={setDeleteTarget}
							onRename={renameDocument}
						/>
					) : (
						<EmptyState
							canCreate={subscription.entitled}
							creating={creating}
							onCreate={() => void createDocument()}
						/>
					)}
				</WorkspaceTemplate.Content>
			</WorkspaceTemplate>

			<SubscriptionModal
				initialPlanKey={initialPlanKey}
				onClose={() => setModalOpen(false)}
				open={modalOpen}
			/>
			<ConfirmDeleteDialog
				deleting={deleting}
				onClose={() => setDeleteTarget(null)}
				onConfirm={() => void deleteDocument()}
				open={deleteTarget !== null}
			/>
		</section>
	)
}
