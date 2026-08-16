"use client"

import { EditorContent } from "@tiptap/react"
import { IconArrowLeft, IconLock, IconTrash } from "@tabler/icons-react"
import { useRouter } from "next/navigation"
import { useCallback, useState, type PropsWithChildren } from "react"

import type { DocumentRecord } from "@leadtech/common/contracts"

import { Button } from "@/components/atoms/Button"
import { IconButton } from "@/components/atoms/IconButton"
import { ConfirmDeleteDialog } from "@/components/molecules/ConfirmDeleteDialog"
import { SaveIndicator } from "@/components/molecules/SaveIndicator"
import { EditorToolbar } from "@/components/organisms/EditorToolbar"
import { SubscriptionModal } from "@/components/organisms/SubscriptionModal"
import { EditorTemplate } from "@/components/templates/EditorTemplate"
import { en } from "@/data/locale/en"
import { requestNoContent } from "@/utils/apiClient"
import { useRichTextEditor } from "./hooks/useRichTextEditor"

type RichTextEditorProps = PropsWithChildren<{
	document: DocumentRecord
	editable: boolean
	onSubscriptionRequired: () => void
}>

export const RichTextEditor = ({
	document,
	editable,
	onSubscriptionRequired
}: RichTextEditorProps) => {
	const router = useRouter()
	const [accessRevoked, setAccessRevoked] = useState(false)
	const [subscriptionOpen, setSubscriptionOpen] = useState(false)
	const [deleteOpen, setDeleteOpen] = useState(false)
	const [deleting, setDeleting] = useState(false)
	const [deleteError, setDeleteError] = useState<string | null>(null)
	const handleSubscriptionRequired = useCallback(() => {
		setAccessRevoked(true)
		setSubscriptionOpen(true)
		onSubscriptionRequired()
	}, [onSubscriptionRequired])
	const editorState = useRichTextEditor({
		document,
		editable: editable && !accessRevoked,
		onSubscriptionRequired: handleSubscriptionRequired
	})
	const canEdit = editable && !accessRevoked

	const navigateBack = () => {
		if (editorState.hasUnsavedChanges && !window.confirm(en.editor.save.navigationWarning)) {
			return
		}
		router.push("/documents")
	}

	const deleteDocument = async () => {
		setDeleting(true)
		setDeleteError(null)
		try {
			await requestNoContent(`/api/documents/${document.id}`, { method: "DELETE" })
			router.replace("/documents")
			router.refresh()
		} catch (error) {
			setDeleteError(error instanceof Error ? error.message : en.documents.mutationError)
			setDeleting(false)
		}
	}

	return (
		<>
			<EditorTemplate>
				<EditorTemplate.Header>
					<div className='mx-auto flex max-w-[90rem] items-center gap-3'>
						<IconButton
							label={en.navigation.backToDocuments}
							onClick={navigateBack}>
							<IconArrowLeft
								size={19}
								stroke={1.8}
							/>
						</IconButton>
						<input
							aria-label={en.editor.titlePlaceholder}
							className='min-w-0 flex-1 bg-sage-50/0 px-2 py-1 text-lg font-semibold text-sage-950 outline-none placeholder:text-sage-400 disabled:text-sage-950'
							disabled={!canEdit}
							maxLength={120}
							onChange={event => editorState.updateTitle(event.currentTarget.value)}
							placeholder={en.editor.titlePlaceholder}
							value={editorState.title}
						/>
						{!canEdit ? (
							<Button
								onClick={() => setSubscriptionOpen(true)}
								variant='secondary'>
								<IconLock
									size={16}
									stroke={1.9}
								/>
								{en.editor.readOnly}
							</Button>
						) : (
							<IconButton
								label={en.documents.delete}
								onClick={() => setDeleteOpen(true)}>
								<IconTrash
									size={19}
									stroke={1.8}
								/>
							</IconButton>
						)}
					</div>
				</EditorTemplate.Header>
				<EditorTemplate.Toolbar>
					<div className='grid gap-2 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center'>
						<EditorToolbar
							editable={canEdit}
							editor={editorState.editor}
						/>
						<SaveIndicator
							lastSavedAt={editorState.lastSavedAt}
							onReload={() => window.location.reload()}
							onRetry={editorState.retry}
							saveState={editorState.saveState}
						/>
					</div>
				</EditorTemplate.Toolbar>
				<EditorTemplate.Content>
					<div className='rounded-xl border border-sage-200 bg-sage-50 px-6 py-8 sm:px-12 sm:py-12 lg:px-20 lg:py-16'>
						<EditorContent editor={editorState.editor} />
					</div>
				</EditorTemplate.Content>
			</EditorTemplate>

			<SubscriptionModal
				onClose={() => setSubscriptionOpen(false)}
				open={subscriptionOpen}
			/>
			<ConfirmDeleteDialog
				deleting={deleting}
				onClose={() => setDeleteOpen(false)}
				onConfirm={() => void deleteDocument()}
				open={deleteOpen}
			/>
			{deleteError ? (
				<p
					className='fixed bottom-5 right-5 z-40 rounded-lg border border-red-50 bg-sage-50 px-4 py-3 text-sm text-red-700'
					role='alert'>
					{deleteError}
				</p>
			) : null}
		</>
	)
}
