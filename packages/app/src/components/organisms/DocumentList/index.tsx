"use client"

import type { DocumentSummary } from "@leadtech/contracts"
import type { PropsWithChildren } from "react"

import { DocumentListItem } from "@/components/molecules/DocumentListItem"

type DocumentListProps = PropsWithChildren<{
	documents: DocumentSummary[]
	editable: boolean
	onDelete: (document: DocumentSummary) => void
	onRename: (document: DocumentSummary, title: string) => Promise<void>
}>

export const DocumentList = ({ documents, editable, onDelete, onRename }: DocumentListProps) => (
	<section className='rounded-xl border border-line bg-white px-5 sm:px-8'>
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
