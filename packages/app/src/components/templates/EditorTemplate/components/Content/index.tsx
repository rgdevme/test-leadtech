import type { PropsWithChildren } from "react"
import styles from "./index.module.css"

type ContentProps = PropsWithChildren

export function Content({ children }: ContentProps) {
	return <div className={styles.container}>{children}</div>
}
