"use client"

import { IconFiles, IconLogout, IconUserCircle } from "@tabler/icons-react"
import NextLink from "next/link"
import { usePathname, useRouter } from "next/navigation"
import type { PropsWithChildren } from "react"
import { useState } from "react"

import { Button } from "@/components/atoms/Button"
import { Logo } from "@/components/atoms/Logo"
import { Text } from "@/components/atoms/Text"
import { firebaseAuth } from "@/firebase/client"
import { useLocale } from "@/hooks/useLocale"
import { routes } from "@/i18n/routes"
import { requestNoContent } from "@/utils/apiClient"
import styles from "./index.module.css"

type AppHeaderProps = PropsWithChildren<{
	email: string | null
}>

export const AppHeader = ({ email }: AppHeaderProps) => {
	const { dictionary, locale } = useLocale()
	const pathname = usePathname()
	const router = useRouter()
	const [signingOut, setSigningOut] = useState(false)
	const navItems = [
		{
			href: routes.documents(locale),
			label: dictionary.workspace.navigation.documents,
			Icon: IconFiles
		},
		{
			href: routes.profile(locale),
			label: dictionary.workspace.navigation.profile,
			Icon: IconUserCircle
		}
	]

	const handleSignOut = async () => {
		setSigningOut(true)
		try {
			await requestNoContent("/api/auth/session", { method: "DELETE" })
			await firebaseAuth.signOut()
			router.replace(routes.signIn(locale))
			router.refresh()
		} finally {
			setSigningOut(false)
		}
	}

	return (
		<header className={styles.header}>
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

				<div className={styles.row2}>
					{email ? (
						<Text
							as='span'
							className={styles.text2}
							unstyled>
							{email}
						</Text>
					) : null}
					<Button
						aria-label={dictionary.workspace.navigation.signOut}
						className={styles.action}
						loading={signingOut}
						onClick={() => void handleSignOut()}
						variant='quiet'>
						<IconLogout
							aria-hidden='true'
							size={17}
							stroke={1.9}
						/>
						<Text
							as='span'
							className={styles.text3}
							unstyled>
							{dictionary.workspace.navigation.signOut}
						</Text>
					</Button>
				</div>
			</div>
		</header>
	)
}
