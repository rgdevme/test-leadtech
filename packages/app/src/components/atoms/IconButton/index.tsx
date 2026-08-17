import type { ButtonHTMLAttributes, PropsWithChildren } from "react"
import styles from "./index.module.css"

type IconButtonProps = PropsWithChildren<
	ButtonHTMLAttributes<HTMLButtonElement> & {
		label: string
	}
>

export const IconButton = ({
	children,
	className = "",
	label,
	type = "button",
	...props
}: IconButtonProps) => (
	<button
		aria-label={label}
		className={[styles.button, className].filter(Boolean).join(" ")}
		title={label}
		type={type}
		{...props}>
		{children}
	</button>
)
