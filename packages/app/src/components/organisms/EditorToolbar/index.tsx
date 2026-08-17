"use client"

import {
	IconBold,
	IconArrowBackUp,
	IconArrowForwardUp,
	IconH1,
	IconH2,
	IconItalic,
	IconList,
	IconListNumbers
} from "@tabler/icons-react"
import type { Editor } from "@tiptap/react"
import type { PropsWithChildren } from "react"

import { IconButton } from "@/components/atoms/IconButton"
import { useLocale } from "@/hooks/useLocale"
import styles from "./index.module.css"

type EditorToolbarProps = PropsWithChildren<{
	editor: Editor | null
	editable: boolean
}>

export const EditorToolbar = ({ editable, editor }: EditorToolbarProps) => {
	const { dictionary } = useLocale()
	const controls = [
		{
			label: dictionary.workspace.editor.toolbar.bold,
			active: editor?.isActive("bold") ?? false,
			action: () => editor?.chain().focus().toggleBold().run(),
			Icon: IconBold
		},
		{
			label: dictionary.workspace.editor.toolbar.italic,
			active: editor?.isActive("italic") ?? false,
			action: () => editor?.chain().focus().toggleItalic().run(),
			Icon: IconItalic
		},
		{
			label: dictionary.workspace.editor.toolbar.headingOne,
			active: editor?.isActive("heading", { level: 1 }) ?? false,
			action: () => editor?.chain().focus().toggleHeading({ level: 1 }).run(),
			Icon: IconH1
		},
		{
			label: dictionary.workspace.editor.toolbar.headingTwo,
			active: editor?.isActive("heading", { level: 2 }) ?? false,
			action: () => editor?.chain().focus().toggleHeading({ level: 2 }).run(),
			Icon: IconH2
		},
		{
			label: dictionary.workspace.editor.toolbar.bulletList,
			active: editor?.isActive("bulletList") ?? false,
			action: () => editor?.chain().focus().toggleBulletList().run(),
			Icon: IconList
		},
		{
			label: dictionary.workspace.editor.toolbar.orderedList,
			active: editor?.isActive("orderedList") ?? false,
			action: () => editor?.chain().focus().toggleOrderedList().run(),
			Icon: IconListNumbers
		}
	]

	return (
		<div className={styles.row}>
			<div className={styles.row2}>
				{controls.map(({ Icon, action, active, label }) => (
					<IconButton
						aria-pressed={active}
						className={active ? styles.activeControl : undefined}
						disabled={!editable || !editor}
						key={label}
						label={label}
						onClick={action}>
						<Icon
							size={18}
							stroke={1.9}
						/>
					</IconButton>
				))}
			</div>
			<div className={styles.container}>
				<IconButton
					disabled={!editable || !editor?.can().chain().focus().undo().run()}
					label={dictionary.workspace.editor.toolbar.undo}
					onClick={() => editor?.chain().focus().undo().run()}>
					<IconArrowBackUp
						size={18}
						stroke={1.9}
					/>
				</IconButton>
				<IconButton
					disabled={!editable || !editor?.can().chain().focus().redo().run()}
					label={dictionary.workspace.editor.toolbar.redo}
					onClick={() => editor?.chain().focus().redo().run()}>
					<IconArrowForwardUp
						size={18}
						stroke={1.9}
					/>
				</IconButton>
			</div>
		</div>
	)
}
