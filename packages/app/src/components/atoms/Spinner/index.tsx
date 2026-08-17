import type { HTMLAttributes, PropsWithChildren } from "react"
import styles from "./index.module.css"

type SpinnerProps = PropsWithChildren<
	HTMLAttributes<HTMLSpanElement> & {
		size?: "small" | "medium"
	}
>

export const Spinner = ({ className = "", size = "medium", ...props }: SpinnerProps) => (
	<span
		aria-hidden='true'
		className={[styles.spinner, className].filter(Boolean).join(" ")}
		data-size={size}
		{...props}
	/>
)
