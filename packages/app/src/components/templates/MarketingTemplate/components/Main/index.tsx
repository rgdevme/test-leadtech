import type { PropsWithChildren } from "react"

type MainProps = PropsWithChildren

export function Main({ children }: MainProps) {
	return <>{children}</>
}
