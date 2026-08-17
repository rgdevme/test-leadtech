import type { PropsWithChildren } from "react"

import styles from "./index.module.css"

type ActionsProps = PropsWithChildren

export function Actions({ children }: ActionsProps) {
	return <div className={styles.actions}>{children}</div>
}
