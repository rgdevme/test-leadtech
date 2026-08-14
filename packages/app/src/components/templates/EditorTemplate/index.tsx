"use client"

import type { PropsWithChildren } from "react"

import { useComponentSlots } from "@/hooks/useComponentSlots"
import { Content } from "./components/Content"
import { Header } from "./components/Header"
import { Toolbar } from "./components/Toolbar"

type EditorTemplateProps = PropsWithChildren

const EditorTemplate = ({ children }: EditorTemplateProps) => {
	const slots = useComponentSlots({ header: Header, toolbar: Toolbar, content: Content }, children)

	return (
		<main className='min-h-[calc(100vh-4.5rem)] w-full max-w-full overflow-x-hidden bg-canvas'>
			{slots.header}
			{slots.toolbar}
			{slots.content}
		</main>
	)
}

EditorTemplate.Header = Header
EditorTemplate.Toolbar = Toolbar
EditorTemplate.Content = Content

export { EditorTemplate }
