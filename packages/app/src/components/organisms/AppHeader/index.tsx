"use client"

import { IconFiles, IconUserCircle } from "@tabler/icons-react"
import NextLink from "next/link"
import { usePathname } from "next/navigation"
import type { PropsWithChildren, ReactNode } from "react"
import { useEffect, useRef } from "react"

import { Logo } from "@/components/atoms/Logo"
import { Text } from "@/components/atoms/Text"
import { CreateDocumentAction } from "@/components/organisms/CreateDocumentAction"
import { useLocale } from "@/hooks/useLocale"
import { routes } from "@/i18n/routes"
import styles from "./index.module.css"

type AppHeaderProps = PropsWithChildren

export const AppHeader: (props: AppHeaderProps) => ReactNode = () => {
	const { dictionary, locale } = useLocale()
	const pathname = usePathname()
	const headerRef = useRef<HTMLElement>(null)
	const documentsPath = routes.documents(locale)

	const navItems = [
		{
			href: documentsPath,
			label: dictionary.workspace.navigation.documents,
			Icon: IconFiles
		},
		{
			href: routes.profile(locale),
			label: dictionary.workspace.navigation.profile,
			Icon: IconUserCircle
		}
	]

	useEffect(() => {
		if (!headerRef.current) return
		const height = headerRef.current.offsetHeight
		document.documentElement.style.setProperty("--app-header-height", `${height}px`)
	}, [])

	return (
		<header
			className={styles.header}
			ref={headerRef}>
			<div className={styles.row}>
				<Logo
					href={routes.documents(locale)}
					size='compact'
				/>

				<nav
					aria-label={dictionary.workspace.navigation.workspace}
					className={styles.navigation}>
					{navItems.map(({ href, label, Icon }) => {
						const active = pathname === href || pathname.startsWith(`${href}/`)
						return (
							<NextLink
								aria-current={active ? "page" : undefined}
								className={styles.navigationLink}
								data-active={active}
								href={href}
								key={href}>
								<Icon
									aria-hidden='true'
									size={17}
									stroke={1.9}
								/>
								<Text
									as='span'
									className={styles.text}
									unstyled>
									{label}
								</Text>
							</NextLink>
						)
					})}
				</nav>
				{pathname === documentsPath ? <CreateDocumentAction /> : null}
			</div>
		</header>
	)
}
