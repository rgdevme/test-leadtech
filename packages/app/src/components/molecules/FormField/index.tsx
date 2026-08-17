import type { PropsWithChildren, ReactNode } from "react"
import styles from "./index.module.css"

type FormFieldProps = PropsWithChildren<{
	error?: ReactNode
	label: string
	name: string
}>

export const FormField = ({ children, error, label, name }: FormFieldProps) => (
	<div className={styles.grid}>
		<label
			className={styles.label}
			htmlFor={name}>
			{label}
		</label>
		{children}
		{error ? (
			<p
				className={styles.error}
				id={`${name}-error`}
				role='alert'>
				{error}
			</p>
		) : null}
	</div>
)
