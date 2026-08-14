import type { PropsWithChildren } from "react"

type ContentProps = PropsWithChildren

export function Content({ children }: ContentProps) {
	return <div className='mx-auto w-full max-w-5xl px-5 py-10 sm:px-8 sm:py-16'>{children}</div>
}
