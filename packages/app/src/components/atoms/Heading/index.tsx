import type { HTMLAttributes, PropsWithChildren } from "react"

import styles from "./index.module.css"

type HeadingProps = PropsWithChildren<
	HTMLAttributes<HTMLHeadingElement> & {
		as?: "h1" | "h2" | "h3" | "h4"
		size?: "body" | "card" | "display" | "section"
	}
>

export const Heading = ({
	as: Component = "h2",
	children,
	className = "",
	size = "body",
	...props
}: HeadingProps) => (
	<Component
		className={[styles.heading, className].filter(Boolean).join(" ")}
		data-size={size}
		{...props}>
		{children}
	</Component>
)
