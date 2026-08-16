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
import { en } from "@/data/locale/en"

type EditorToolbarProps = PropsWithChildren<{
	editor: Editor | null
	editable: boolean
}>

export const EditorToolbar = ({ editable, editor }: EditorToolbarProps) => {
	const controls = [
		{
			label: en.editor.toolbar.bold,
			active: editor?.isActive("bold") ?? false,
			action: () => editor?.chain().focus().toggleBold().run(),
			Icon: IconBold
		},
		{
			label: en.editor.toolbar.italic,
			active: editor?.isActive("italic") ?? false,
			action: () => editor?.chain().focus().toggleItalic().run(),
			Icon: IconItalic
		},
		{
			label: en.editor.toolbar.headingOne,
			active: editor?.isActive("heading", { level: 1 }) ?? false,
			action: () => editor?.chain().focus().toggleHeading({ level: 1 }).run(),
			Icon: IconH1
		},
		{
			label: en.editor.toolbar.headingTwo,
			active: editor?.isActive("heading", { level: 2 }) ?? false,
			action: () => editor?.chain().focus().toggleHeading({ level: 2 }).run(),
			Icon: IconH2
		},
		{
			label: en.editor.toolbar.bulletList,
			active: editor?.isActive("bulletList") ?? false,
			action: () => editor?.chain().focus().toggleBulletList().run(),
			Icon: IconList
		},
		{
			label: en.editor.toolbar.orderedList,
			active: editor?.isActive("orderedList") ?? false,
			action: () => editor?.chain().focus().toggleOrderedList().run(),
			Icon: IconListNumbers
		}
	]

	return (
		<div className='mx-auto flex max-w-[90rem] items-center justify-between gap-4'>
			<div className='flex flex-wrap items-center gap-0.5'>
				{controls.map(({ Icon, action, active, label }) => (
					<IconButton
						aria-pressed={active}
						className={active ? "border-sage-200 bg-sage-50 text-sage-950" : ""}
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
			<div className='hidden items-center gap-0.5 sm:flex'>
				<IconButton
					disabled={!editable || !editor?.can().chain().focus().undo().run()}
					label={en.editor.toolbar.undo}
					onClick={() => editor?.chain().focus().undo().run()}>
					<IconArrowBackUp
						size={18}
						stroke={1.9}
					/>
				</IconButton>
				<IconButton
					disabled={!editable || !editor?.can().chain().focus().redo().run()}
					label={en.editor.toolbar.redo}
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
