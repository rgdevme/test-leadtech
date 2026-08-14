import type { HTMLAttributes, PropsWithChildren } from "react"

type HeadingLevel = 1 | 2 | 3 | 4

type HeadingProps = PropsWithChildren<
	HTMLAttributes<HTMLHeadingElement> & {
		level?: HeadingLevel
		serif?: boolean
	}
>

export const Heading = ({
	children,
	className = "",
	level = 2,
	serif = false,
	...props
}: HeadingProps) => {
	const Component = `h${level}` as const

	return (
		<Component
			className={`${serif ? "font-serif" : ""} text-balance text-charcoal ${className}`}
			{...props}>
			{children}
		</Component>
	)
}
