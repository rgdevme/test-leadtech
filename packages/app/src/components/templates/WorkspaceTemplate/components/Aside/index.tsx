import type { PropsWithChildren } from "react"
import styles from "./index.module.css"

type AsideProps = PropsWithChildren

export function Aside({ children }: AsideProps) {
	return <aside className={styles.aside}>{children}</aside>
}
