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
import { useLocale } from "@/hooks/useLocale"
import { routes } from "@/i18n/routes"
import { requestNoContent } from "@/utils/apiClient"
import { useRichTextEditor } from "./hooks/useRichTextEditor"
import layoutStyles from "./layout.module.css"

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
	const { dictionary, locale } = useLocale()
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
		if (
			editorState.hasUnsavedChanges
			&& !window.confirm(dictionary.workspace.editor.save.navigationWarning)
		) {
			return
		}
		router.push(routes.documents(locale))
	}

	const deleteDocument = async () => {
		setDeleting(true)
		setDeleteError(null)
		try {
			await requestNoContent(`/api/documents/${document.id}`, { method: "DELETE" })
			router.replace(routes.documents(locale))
			router.refresh()
		} catch (error) {
			setDeleteError(
				error instanceof Error ? error.message : dictionary.workspace.documents.mutationError
			)
			setDeleting(false)
		}
	}

	return (
		<>
			<EditorTemplate>
				<EditorTemplate.Header>
					<div className={layoutStyles.row}>
						<IconButton
							label={dictionary.workspace.navigation.backToDocuments}
							onClick={navigateBack}>
							<IconArrowLeft
								size={19}
								stroke={1.8}
							/>
						</IconButton>
						<input
							aria-label={dictionary.workspace.editor.titlePlaceholder}
							className={layoutStyles.input}
							disabled={!canEdit}
							maxLength={120}
							onChange={event => editorState.updateTitle(event.currentTarget.value)}
							placeholder={dictionary.workspace.editor.titlePlaceholder}
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
								{dictionary.workspace.editor.readOnly}
							</Button>
						) : (
							<IconButton
								label={dictionary.workspace.documents.delete}
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
					<div className={layoutStyles.grid}>
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
					<div className={layoutStyles.card}>
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
					className={layoutStyles.error}
					role='alert'>
					{deleteError}
				</p>
			) : null}
		</>
	)
}
