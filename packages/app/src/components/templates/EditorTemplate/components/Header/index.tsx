import type { PropsWithChildren } from "react"

type HeaderProps = PropsWithChildren

export function Header({ children }: HeaderProps) {
	return (
		<header className='border-b border-sage-200 bg-sage-50 px-5 py-4 sm:px-8'>{children}</header>
	)
}
