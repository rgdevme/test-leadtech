"use client"

import { IconArrowUpRight, IconDots, IconEdit, IconTrash } from "@tabler/icons-react"
import NextLink from "next/link"
import { useState, type PropsWithChildren } from "react"

import type { DocumentSummary } from "@leadtech/common/contracts"

import { Heading } from "@/components/atoms/Heading"
import { IconButton } from "@/components/atoms/IconButton"
import { Input } from "@/components/atoms/Input"
import { Text } from "@/components/atoms/Text"
import { en } from "@/data/locale/en"

type DocumentListItemProps = PropsWithChildren<{
	document: DocumentSummary
	editable: boolean
	onDelete: (document: DocumentSummary) => void
	onRename: (document: DocumentSummary, title: string) => Promise<void>
}>

export const DocumentListItem = ({
	document,
	editable,
	onDelete,
	onRename
}: DocumentListItemProps) => {
	const [menuOpen, setMenuOpen] = useState(false)
	const [renaming, setRenaming] = useState(false)
	const [title, setTitle] = useState(document.title)

	const submitRename = async () => {
		const nextTitle = title.trim()
		if (!nextTitle || nextTitle === document.title) {
			setRenaming(false)
			return
		}

		await onRename(document, nextTitle)
		setRenaming(false)
		setMenuOpen(false)
	}

	return (
		<article
			className='group relative grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border-b border-sage-200 py-5 last:border-b-0'
			data-reveal>
			<div className='min-w-0'>
				{renaming ? (
					<form
						className='flex max-w-lg items-center gap-2'
						onSubmit={event => {
							event.preventDefault()
							void submitRename()
						}}>
						<Input
							aria-label={en.documents.rename}
							autoFocus
							maxLength={120}
							onChange={event => setTitle(event.currentTarget.value)}
							value={title}
						/>
						<button
							className='text-sm font-semibold text-sage-950'
							type='submit'>
							{en.documents.renameSave}
						</button>
						<button
							className='text-sm text-sage-600'
							onClick={() => {
								setTitle(document.title)
								setRenaming(false)
							}}
							type='button'>
							{en.documents.renameCancel}
						</button>
					</form>
				) : (
					<NextLink
						className='block'
						href={`/documents/${document.id}`}>
						<Heading className='truncate text-lg font-semibold transition group-hover:text-sage-900'>
							{document.title}
						</Heading>
						<Text
							className='mt-1.5 text-sm text-sage-600'
							unstyled>
							{en.documents.updated}{" "}
							{new Date(document.updatedAt).toLocaleDateString(undefined, {
								day: "numeric",
								month: "short",
								year: "numeric"
							})}
						</Text>
					</NextLink>
				)}
			</div>

			{!renaming ? (
				<div className='flex items-center gap-1'>
					<NextLink
						aria-label={`Open ${document.title}`}
						className='grid size-10 place-items-center rounded-[6px] text-sage-600 transition hover:bg-sage-100 hover:text-sage-950'
						href={`/documents/${document.id}`}>
						<IconArrowUpRight
							size={19}
							stroke={1.8}
						/>
					</NextLink>
					{editable ? (
						<div className='relative'>
							<IconButton
								label={`Actions for ${document.title}`}
								onClick={() => setMenuOpen(open => !open)}>
								<IconDots
									size={19}
									stroke={1.8}
								/>
							</IconButton>
							{menuOpen ? (
								<div className='absolute right-0 top-11 z-10 w-48 rounded-lg border border-sage-200 bg-sage-50 p-1.5 shadow-lg'>
									<button
										className='flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-sage-950 hover:bg-sage-100'
										onClick={() => {
											setRenaming(true)
											setMenuOpen(false)
										}}
										type='button'>
										<IconEdit
											size={16}
											stroke={1.8}
										/>
										{en.documents.rename}
									</button>
									<button
										className='flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-red-700 hover:bg-red-50'
										onClick={() => onDelete(document)}
										type='button'>
										<IconTrash
											size={16}
											stroke={1.8}
										/>
										{en.documents.delete}
									</button>
								</div>
							) : null}
						</div>
					) : null}
				</div>
			) : null}
		</article>
	)
}
