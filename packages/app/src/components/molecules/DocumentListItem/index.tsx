"use client"

import { IconArrowUpRight, IconDots, IconEdit, IconTrash } from "@tabler/icons-react"
import NextLink from "next/link"
import { useState, type PropsWithChildren } from "react"

import type { DocumentSummary } from "@leadtech/common/contracts"

import { Heading } from "@/components/atoms/Heading"
import { IconButton } from "@/components/atoms/IconButton"
import { Input } from "@/components/atoms/Input"
import { Text } from "@/components/atoms/Text"
import { useLocale } from "@/hooks/useLocale"
import { routes } from "@/i18n/routes"
import styles from "./index.module.css"

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
	const { dictionary, locale } = useLocale()
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
			className={styles.item}
			data-reveal>
			<div className={styles.container}>
				{renaming ? (
					<form
						className={styles.form}
						onSubmit={event => {
							event.preventDefault()
							void submitRename()
						}}>
						<Input
							aria-label={dictionary.workspace.documents.rename}
							autoFocus
							maxLength={120}
							onChange={event => setTitle(event.currentTarget.value)}
							value={title}
						/>
						<button
							className={styles.button}
							type='submit'>
							{dictionary.workspace.documents.renameSave}
						</button>
						<button
							className={styles.button2}
							onClick={() => {
								setTitle(document.title)
								setRenaming(false)
							}}
							type='button'>
							{dictionary.workspace.documents.renameCancel}
						</button>
					</form>
				) : (
					<NextLink
						className={styles.link}
						href={routes.document(locale, document.id)}>
						<Heading className={styles.heading}>{document.title}</Heading>
						<Text
							className={styles.text}
							unstyled>
							{dictionary.workspace.documents.updated}{" "}
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
				<div className={styles.row}>
					<NextLink
						aria-label={dictionary.workspace.documents.open}
						className={styles.link2}
						href={routes.document(locale, document.id)}>
						<IconArrowUpRight
							size={19}
							stroke={1.8}
						/>
					</NextLink>
					{editable ? (
						<div className={styles.container2}>
							<IconButton
								label={dictionary.workspace.documents.actions}
								onClick={() => setMenuOpen(open => !open)}>
								<IconDots
									size={19}
									stroke={1.8}
								/>
							</IconButton>
							{menuOpen ? (
								<div className={styles.card}>
									<button
										className={styles.button3}
										onClick={() => {
											setRenaming(true)
											setMenuOpen(false)
										}}
										type='button'>
										<IconEdit
											size={16}
											stroke={1.8}
										/>
										{dictionary.workspace.documents.rename}
									</button>
									<button
										className={styles.error}
										onClick={() => onDelete(document)}
										type='button'>
										<IconTrash
											size={16}
											stroke={1.8}
										/>
										{dictionary.workspace.documents.delete}
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
