"use client"

import type { PropsWithChildren } from "react"

import { useComponentSlots } from "@/hooks/useComponentSlots"
import { Content } from "./components/Content"
import { Header } from "./components/Header"
import { Toolbar } from "./components/Toolbar"
import styles from "./index.module.css"

type EditorTemplateProps = PropsWithChildren

const EditorTemplate = ({ children }: EditorTemplateProps) => {
	const slots = useComponentSlots({ header: Header, toolbar: Toolbar, content: Content }, children)

	return (
		<main className={styles.main}>
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
