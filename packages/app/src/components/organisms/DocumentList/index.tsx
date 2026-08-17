"use client"

import type { DocumentSummary } from "@leadtech/common/contracts"
import type { PropsWithChildren } from "react"

import { DocumentListItem } from "@/components/molecules/DocumentListItem"
import styles from "./index.module.css"

type DocumentListProps = PropsWithChildren<{
	documents: DocumentSummary[]
	editable: boolean
	onDelete: (document: DocumentSummary) => void
	onRename: (document: DocumentSummary, title: string) => Promise<void>
}>

export const DocumentList = ({ documents, editable, onDelete, onRename }: DocumentListProps) => (
	<section className={styles.section}>
		{documents.map(document => (
			<DocumentListItem
				document={document}
				editable={editable}
				key={document.id}
				onDelete={onDelete}
				onRename={onRename}
			/>
		))}
	</section>
)
