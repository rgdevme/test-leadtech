"use client"

import { IconAlertCircle, IconCheck, IconLoader2 } from "@tabler/icons-react"
import type { PropsWithChildren } from "react"

import { Button } from "@/components/atoms/Button"
import { Text } from "@/components/atoms/Text"
import { useLocale } from "@/hooks/useLocale"
import type { EditorSaveState } from "@/stores/useEditorStore"
import styles from "./index.module.css"

type SaveIndicatorProps = PropsWithChildren<{
	lastSavedAt: string | null
	onReload?: () => void
	onRetry?: () => void
	saveState: EditorSaveState
}>

export const SaveIndicator = ({
	lastSavedAt,
	onReload,
	onRetry,
	saveState
}: SaveIndicatorProps) => {
	const { dictionary } = useLocale()
	const saveLabels: Record<EditorSaveState, string> = dictionary.workspace.editor.save
	const isProblem = saveState === "failed" || saveState === "conflict"
	const Icon = saveState === "saving" ? IconLoader2 : isProblem ? IconAlertCircle : IconCheck

	return (
		<div
			className={styles.row}
			role='status'>
			<Text
				as='span'
				unstyled>
				{saveLabels[saveState]}
			</Text>
			{saveState === "clean" && lastSavedAt ? (
				<time dateTime={lastSavedAt}>
					{new Date(lastSavedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
				</time>
			) : null}
			{saveState === "failed" && onRetry ? (
				<Button
					className={styles.action}
					onClick={onRetry}
					variant='secondary'>
					{dictionary.workspace.editor.save.retry}
				</Button>
			) : null}
			{saveState === "conflict" && onReload ? (
				<Button
					className={styles.action2}
					onClick={onReload}
					variant='secondary'>
					{dictionary.workspace.editor.save.reload}
				</Button>
			) : null}
			<Icon
				aria-hidden='true'
				className={saveState === "saving" ? styles.spinning : undefined}
				size={16}
				stroke={2}
			/>
		</div>
	)
}
