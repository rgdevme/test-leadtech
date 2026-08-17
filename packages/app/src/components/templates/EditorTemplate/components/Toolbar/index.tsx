import type { PropsWithChildren } from "react"
import styles from "./index.module.css"

type ToolbarProps = PropsWithChildren

export function Toolbar({ children }: ToolbarProps) {
	return <div className={styles.container}>{children}</div>
}
