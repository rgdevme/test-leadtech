import type { PropsWithChildren } from "react"
import styles from "./index.module.css"

type HeaderProps = PropsWithChildren

export function Header({ children }: HeaderProps) {
	return <header className={styles.header}>{children}</header>
}
