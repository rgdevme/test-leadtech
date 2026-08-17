"use client"

import {
	documentRecordSchema,
	richTextDocumentSchema,
	type DocumentRecord
} from "@leadtech/common/contracts"
import { useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { useCallback, useEffect, useRef, useState } from "react"

import { useEditorStore } from "@/stores/useEditorStore"
import { ApiClientError, requestJson } from "@/utils/apiClient"
import styles from "../index.module.css"

type SaveSnapshot = {
	content: DocumentRecord["content"]
	revision: number
	title: string
}

type UseRichTextEditorOptions = {
	document: DocumentRecord
	editable: boolean
	onSubscriptionRequired: () => void
}

export const useRichTextEditor = ({
	document,
	editable,
	onSubscriptionRequired
}: UseRichTextEditorOptions) => {
	const [title, setTitle] = useState(document.title)
	const [saveRevision, setSaveRevision] = useState(0)
	const documentRef = useRef(document)
	const titleRef = useRef(document.title)
	const revisionRef = useRef(0)
	const pendingSnapshotRef = useRef<SaveSnapshot | null>(null)
	const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
	const savingRef = useRef(false)
	const stoppedRef = useRef(false)
	const saveState = useEditorStore(state => state.saveState)
	const lastSavedAt = useEditorStore(state => state.lastSavedAt)
	const setSaveState = useEditorStore(state => state.setSaveState)
	const setLastSavedAt = useEditorStore(state => state.setLastSavedAt)
	const resetStore = useEditorStore(state => state.reset)

	const editor = useEditor({
		extensions: [StarterKit],
		content: document.content,
		editable,
		immediatelyRender: false,
		editorProps: {
			attributes: {
				class: styles.editor!,
				"aria-label": "Document editor"
			}
		},
		onUpdate: ({ editor: currentEditor }) => {
			if (!editable || stoppedRef.current) {
				return
			}

			const content = richTextDocumentSchema.safeParse(currentEditor.getJSON())
			if (!content.success) {
				setSaveState("failed")
				return
			}

			revisionRef.current += 1
			setSaveRevision(revisionRef.current)
			pendingSnapshotRef.current = {
				content: content.data,
				revision: revisionRef.current,
				title: titleRef.current
			}
			setSaveState("dirty")
		}
	})

	const flush = useCallback(async () => {
		if (!editable || savingRef.current || stoppedRef.current || !pendingSnapshotRef.current) {
			return
		}

		savingRef.current = true

		while (pendingSnapshotRef.current && !stoppedRef.current) {
			const snapshot = pendingSnapshotRef.current
			pendingSnapshotRef.current = null
			setSaveState("saving")

			try {
				const savedDocument = await requestJson(
					`/api/documents/${documentRef.current.id}`,
					{
						method: "PATCH",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							title: snapshot.title,
							content: snapshot.content,
							expectedVersion: documentRef.current.version
						})
					},
					documentRecordSchema
				)
				documentRef.current = savedDocument
				setLastSavedAt(savedDocument.updatedAt)

				if (revisionRef.current === snapshot.revision && !pendingSnapshotRef.current) {
					setSaveState("clean")
				}
			} catch (error) {
				pendingSnapshotRef.current = snapshot

				if (error instanceof ApiClientError && error.code === "conflict") {
					stoppedRef.current = true
					setSaveState("conflict")
				} else if (error instanceof ApiClientError && error.code === "subscription_required") {
					stoppedRef.current = true
					editor?.setEditable(false)
					setSaveState("failed")
					onSubscriptionRequired()
				} else {
					setSaveState("failed")
				}
				break
			}
		}

		savingRef.current = false
	}, [editable, editor, onSubscriptionRequired, setLastSavedAt, setSaveState])

	useEffect(() => {
		if (saveState !== "dirty") {
			return
		}

		if (debounceTimerRef.current) {
			clearTimeout(debounceTimerRef.current)
		}
		debounceTimerRef.current = setTimeout(() => void flush(), 500)

		return () => {
			if (debounceTimerRef.current) {
				clearTimeout(debounceTimerRef.current)
			}
		}
	}, [flush, saveRevision, saveState])

	useEffect(() => {
		resetStore()
		setLastSavedAt(document.updatedAt)

		return () => resetStore()
	}, [document.updatedAt, resetStore, setLastSavedAt])

	useEffect(() => {
		const warnBeforeUnload = (event: BeforeUnloadEvent) => {
			if (saveState === "dirty" || saveState === "saving" || saveState === "failed") {
				event.preventDefault()
			}
		}

		window.addEventListener("beforeunload", warnBeforeUnload)
		return () => window.removeEventListener("beforeunload", warnBeforeUnload)
	}, [saveState])

	const updateTitle = (nextTitle: string) => {
		setTitle(nextTitle)
		titleRef.current = nextTitle
		if (!editable || stoppedRef.current) {
			return
		}

		const content = richTextDocumentSchema.safeParse(
			editor?.getJSON() ?? documentRef.current.content
		)
		if (!content.success || !nextTitle.trim()) {
			return
		}

		revisionRef.current += 1
		setSaveRevision(revisionRef.current)
		pendingSnapshotRef.current = {
			content: content.data,
			revision: revisionRef.current,
			title: nextTitle.trim()
		}
		setSaveState("dirty")
	}

	const retry = () => {
		if (saveState !== "failed") {
			return
		}
		stoppedRef.current = false
		setSaveState("dirty")
		void flush()
	}

	const hasUnsavedChanges =
		saveState === "dirty" || saveState === "saving" || saveState === "failed"

	return {
		editor,
		title,
		updateTitle,
		saveState,
		lastSavedAt,
		retry,
		hasUnsavedChanges
	}
}
