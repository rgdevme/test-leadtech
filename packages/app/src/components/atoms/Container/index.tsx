import type { PropsWithChildren } from "react"

import styles from "./index.module.css"

type ContainerProps = PropsWithChildren<{
	size?: "default" | "wide"
}>

export const Container = ({ children, size = "default" }: ContainerProps) => (
	<div
		className={styles.container}
		data-size={size}>
		{children}
	</div>
)
