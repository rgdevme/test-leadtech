import type { HTMLAttributes, PropsWithChildren } from "react"

type TextProps = PropsWithChildren<
	HTMLAttributes<HTMLElement> & {
		as?: "p" | "span"
		unstyled?: boolean
	}
>

export const Text = ({
	as: Component = "p",
	children,
	className = "",
	unstyled = false,
	...props
}: TextProps) => (
	<Component
		className={unstyled ? className : `leading-7 text-sage-600 ${className}`}
		{...props}>
		{children}
	</Component>
)
