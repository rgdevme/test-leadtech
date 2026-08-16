import type { PropsWithChildren } from "react"

import { Text } from "@/components/atoms/Text"
import styles from "./index.module.css"

type ButtonProps = PropsWithChildren<{
	href: string
	variant?: "primary" | "secondary" | "text"
	showArrow?: boolean
}>

export const Button = ({ children, href, variant = "primary", showArrow = true }: ButtonProps) => (
	<a
		className={styles.button}
		data-variant={variant}
		href={href}>
		<Text
			as='span'
			unstyled>
			{children}
		</Text>
		{showArrow ? (
			<span
				aria-hidden='true'
				className={styles.icon}>
				↗
			</span>
		) : null}
	</a>
)
