import type { PropsWithChildren } from "react"

import { Container } from "@/components/atoms"
import { useComponentSlots } from "@/hooks/useComponentSlots"

import { Actions } from "./components/Actions"
import { Brand } from "./components/Brand"
import { Navigation } from "./components/Navigation"
import styles from "./index.module.css"

type SiteHeaderProps = PropsWithChildren<{
	menuLabel: string
}>

const SiteHeader = ({ children, menuLabel }: SiteHeaderProps) => {
	const slots = useComponentSlots(
		{ actions: Actions, brand: Brand, navigation: Navigation },
		children
	)

	return (
		<header className={styles.header}>
			<Container size='wide'>
				<div className={styles.island}>
					{slots.brand}
					<nav
						aria-label={menuLabel}
						className={styles.desktopNavigation}>
						{slots.navigation}
					</nav>
					<div className={styles.desktopActions}>{slots.actions}</div>
					<details className={styles.mobileMenu}>
						<summary
							aria-label={menuLabel}
							className={styles.mobileTrigger}>
							<span
								className={styles.hamburger}
								aria-hidden='true'>
								<i />
								<i />
							</span>
						</summary>
						<div className={styles.mobileOverlay}>
							<nav aria-label={menuLabel}>{slots.navigation}</nav>
							{slots.actions}
						</div>
					</details>
				</div>
			</Container>
		</header>
	)
}

SiteHeader.Brand = Brand
SiteHeader.Navigation = Navigation
SiteHeader.Actions = Actions

export { SiteHeader }
