import type { InputHTMLAttributes, PropsWithChildren } from "react"
import styles from "./index.module.css"

type InputProps = PropsWithChildren<InputHTMLAttributes<HTMLInputElement>>

export const Input = ({ className = "", ...props }: InputProps) => (
	<input
		className={[styles.input, className].filter(Boolean).join(" ")}
		{...props}
	/>
)
