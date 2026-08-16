import type { HTMLAttributes, PropsWithChildren } from "react"

type SpinnerProps = PropsWithChildren<
	HTMLAttributes<HTMLSpanElement> & {
		size?: "small" | "medium"
	}
>

export const Spinner = ({ className = "", size = "medium", ...props }: SpinnerProps) => (
	<span
		aria-hidden='true'
		className={`inline-block animate-spin rounded-full border-2 border-current border-r-sage-950/0 ${size === "small" ? "size-4" : "size-5"} ${className}`}
		{...props}
	/>
)
