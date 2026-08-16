import type { PropsWithChildren } from "react"

type FooterProps = PropsWithChildren

export function Footer({ children }: FooterProps) {
	return <>{children}</>
}
