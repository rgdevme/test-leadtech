"use client"

import { useRef, type PropsWithChildren } from "react"

import { useComponentSlots } from "@/hooks/useComponentSlots"
import { useEditorialMotion } from "@/hooks/useEditorialMotion"
import { Aside } from "./components/Aside"
import { Content } from "./components/Content"
import { Header } from "./components/Header"

type WorkspaceTemplateProps = PropsWithChildren

const WorkspaceTemplate = ({ children }: WorkspaceTemplateProps) => {
	const scope = useRef<HTMLElement>(null)
	const slots = useComponentSlots({ header: Header, content: Content, aside: Aside }, children)
	useEditorialMotion(scope)

	return (
		<main
			className='min-h-[calc(100vh-4.5rem)] w-full max-w-full overflow-x-hidden bg-sage-50'
			ref={scope}>
			<div className='mx-auto max-w-[90rem] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24'>
				{slots.header}
				<div className={slots.aside ? "grid gap-12 lg:grid-cols-[minmax(0,1fr)_20rem]" : ""}>
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
