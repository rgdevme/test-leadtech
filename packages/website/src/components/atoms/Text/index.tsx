import type { HTMLAttributes, PropsWithChildren } from "react"

import styles from "./index.module.css"

type TextProps = PropsWithChildren<
	HTMLAttributes<HTMLElement> & {
		as?: "em" | "p" | "span" | "strong"
		tone?: "default" | "muted" | "inverse"
		size?: "small" | "body" | "lead"
		unstyled?: boolean
		variant?: "body" | "eyebrow"
	}
>

export const Text = ({
	as: Component = "p",
	children,
	className = "",
	size = "body",
	tone = "default",
	unstyled = false,
	variant = "body",
	...props
}: TextProps) => (
	<Component
		className={unstyled ? className : [styles.text, className].filter(Boolean).join(" ")}
		data-size={unstyled ? undefined : size}
		data-tone={unstyled ? undefined : tone}
		data-variant={unstyled ? undefined : variant}
		{...props}>
		{children}
	</Component>
)
