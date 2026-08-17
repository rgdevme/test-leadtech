"use client"

import { IconTrash } from "@tabler/icons-react"
import type { PropsWithChildren } from "react"

import { Button } from "@/components/atoms/Button"
import { Dialog } from "@/components/atoms/Dialog"
import { Heading } from "@/components/atoms/Heading"
import { Text } from "@/components/atoms/Text"
import { useLocale } from "@/hooks/useLocale"
import styles from "./index.module.css"

type ConfirmDeleteDialogProps = PropsWithChildren<{
	deleting: boolean
	onClose: () => void
	onConfirm: () => void
	open: boolean
}>

export const ConfirmDeleteDialog = ({
	deleting,
	onClose,
	onConfirm,
	open
}: ConfirmDeleteDialogProps) => {
	const { dictionary } = useLocale()

	return (
		<Dialog
			labelledBy='delete-dialog-title'
			onClose={onClose}
			open={open}>
			<div className={styles.container}>
				<span className={styles.error}>
					<IconTrash
						size={21}
						stroke={1.8}
					/>
				</span>
				<Heading
					className={styles.heading}
					id='delete-dialog-title'
					as='h2'>
					{dictionary.workspace.documents.deleteTitle}
				</Heading>
				<Text className={styles.text}>{dictionary.workspace.documents.deleteDescription}</Text>
				<div className={styles.row}>
					<Button
						onClick={onClose}
						variant='secondary'>
						{dictionary.workspace.documents.deleteCancel}
					</Button>
					<Button
						loading={deleting}
						onClick={onConfirm}
						variant='danger'>
						{dictionary.workspace.documents.deleteConfirm}
					</Button>
				</div>
			</div>
		</Dialog>
	)
}
