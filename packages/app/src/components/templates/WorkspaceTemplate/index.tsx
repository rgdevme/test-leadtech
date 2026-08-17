"use client"

import { useRef, type PropsWithChildren } from "react"

import { useComponentSlots } from "@/hooks/useComponentSlots"
import { useEditorialMotion } from "@/hooks/useEditorialMotion"
import { Aside } from "./components/Aside"
import { Content } from "./components/Content"
import { Header } from "./components/Header"
import styles from "./index.module.css"

type WorkspaceTemplateProps = PropsWithChildren

const WorkspaceTemplate = ({ children }: WorkspaceTemplateProps) => {
	const scope = useRef<HTMLElement>(null)
	const slots = useComponentSlots({ header: Header, content: Content, aside: Aside }, children)
	useEditorialMotion(scope)

	return (
		<main
			className={styles.main}
			ref={scope}>
			<div className={styles.container}>
				{slots.header}
				<div
					className={styles.contentLayout}
					data-with-aside={Boolean(slots.aside)}>
					{slots.content}
					{slots.aside}
				</div>
			</div>
		</main>
	)
}

WorkspaceTemplate.Header = Header
WorkspaceTemplate.Content = Content
WorkspaceTemplate.Aside = Aside

export { WorkspaceTemplate }
