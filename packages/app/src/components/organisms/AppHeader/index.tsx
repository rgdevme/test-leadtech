"use client"

import { IconFiles, IconLogout, IconUserCircle } from "@tabler/icons-react"
import NextLink from "next/link"
import { usePathname, useRouter } from "next/navigation"
import type { PropsWithChildren } from "react"
import { useState } from "react"

import { Button } from "@/components/atoms/Button"
import { Logo } from "@/components/atoms/Logo"
import { Text } from "@/components/atoms/Text"
import { en } from "@/data/locale/en"
import { firebaseAuth } from "@/firebase/client"
import { requestNoContent } from "@/utils/apiClient"

type AppHeaderProps = PropsWithChildren<{
	email: string | null
}>

const navItems = [
	{ href: "/documents", label: en.navigation.documents, Icon: IconFiles },
	{ href: "/profile", label: en.navigation.profile, Icon: IconUserCircle }
]

export const AppHeader = ({ email }: AppHeaderProps) => {
	const pathname = usePathname()
	const router = useRouter()
	const [signingOut, setSigningOut] = useState(false)

	const handleSignOut = async () => {
		setSigningOut(true)
		try {
			await requestNoContent("/api/auth/session", { method: "DELETE" })
			await firebaseAuth.signOut()
			router.replace("/sign-in")
			router.refresh()
		} finally {
			setSigningOut(false)
		}
	}

	return (
		<header className='sticky top-0 z-30 border-b border-sage-200 bg-sage-50/90 backdrop-blur-xl'>
			<div className='mx-auto flex min-h-18 max-w-[90rem] items-center justify-between gap-5 px-5 sm:px-8 lg:px-12'>
				<Logo
					href='/documents'
					size='compact'
				/>

				<nav
					aria-label='Workspace navigation'
					className='flex items-center gap-1 rounded-lg border border-sage-200 bg-sage-50 p-1'>
					{navItems.map(({ href, label, Icon }) => {
						const active = pathname === href || pathname.startsWith(`${href}/`)
						return (
							<NextLink
								aria-current={active ? "page" : undefined}
								className={`flex min-h-9 items-center gap-2 rounded-md px-3 text-sm font-semibold transition ${
									active ? "bg-sage-100 text-sage-950" : "text-sage-600 hover:text-sage-950"
								}`}
								href={href}
								key={href}>
								<Icon
									aria-hidden='true'
									size={17}
									stroke={1.9}
								/>
								<Text
									as='span'
									className='hidden sm:inline'
									unstyled>
									{label}
								</Text>
							</NextLink>
						)
					})}
				</nav>

				<div className='flex items-center gap-3'>
					{email ? (
						<Text
							as='span'
							className='hidden max-w-44 truncate text-xs text-sage-600 lg:block'
							unstyled>
							{email}
						</Text>
					) : null}
					<Button
						aria-label={en.navigation.signOut}
						className='min-h-9 px-2.5 sm:px-3'
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
							className='hidden sm:inline'
							unstyled>
							{en.navigation.signOut}
						</Text>
					</Button>
				</div>
			</div>
		</header>
	)
}
