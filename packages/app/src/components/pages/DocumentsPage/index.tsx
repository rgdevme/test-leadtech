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
import { en } from "@/data/locale/en"
import { useEditorialMotion } from "@/hooks/useEditorialMotion"
import { ApiClientError, requestJson, requestNoContent } from "@/utils/apiClient"

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
			router.push(`/documents/${document.id}`)
		} catch (createError) {
			if (!handleSubscriptionRequired(createError)) {
				setError(createError instanceof Error ? createError.message : en.documents.mutationError)
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
				setError(renameError instanceof Error ? renameError.message : en.documents.mutationError)
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
				setError(deleteError instanceof Error ? deleteError.message : en.documents.mutationError)
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
						className='flex flex-col items-start justify-between gap-7 sm:flex-row sm:items-end'
						data-reveal>
						<div className='max-w-4xl'>
							<SubscriptionBadge subscription={subscription} />
							<Heading
								className='mt-6 max-w-5xl text-[clamp(3rem,7vw,6.5rem)] leading-[0.9]'
								level={1}
								serif>
								{en.documents.title}
							</Heading>
							<Text className='mt-6 max-w-xl'>{en.documents.description}</Text>
						</div>
						<Button
							className='shrink-0'
							loading={creating}
							onClick={() => void createDocument()}>
							<IconPlus
								size={18}
								stroke={2}
							/>
							{creating ? en.documents.creating : en.documents.create}
						</Button>
					</div>
					{!subscription.entitled ? (
						<button
							className='mt-8 flex w-full items-center justify-between gap-5 rounded-lg border border-yellow-50 bg-yellow-50 px-5 py-4 text-left text-sm text-yellow-800 transition hover:border-yellow-800'
							onClick={() => setModalOpen(true)}
							type='button'>
							<Text
								as='span'
								unstyled>
								{en.documents.readOnlyNotice}
							</Text>
							<IconArrowRight
								className='shrink-0'
								size={18}
								stroke={2}
							/>
						</button>
					) : null}
					{error ? (
						<Text
							className='mt-5 text-sm text-red-700'
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
