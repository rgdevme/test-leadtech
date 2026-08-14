"use client"

import { IconFiles, IconLogout, IconUserCircle } from "@tabler/icons-react"
import NextLink from "next/link"
import { usePathname, useRouter } from "next/navigation"
import type { PropsWithChildren } from "react"
import { useState } from "react"

import { Button } from "@/components/atoms/Button"
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
		<header className='sticky top-0 z-30 border-b border-line bg-canvas/90 backdrop-blur-xl'>
			<div className='mx-auto flex min-h-18 max-w-[90rem] items-center justify-between gap-5 px-5 sm:px-8 lg:px-12'>
				<NextLink
					className='flex items-center gap-3'
					href='/documents'>
					<span className='grid size-8 place-items-center rounded-md bg-charcoal font-serif text-lg text-white'>
						{en.brand.mark}
					</span>
					<span className='hidden text-sm font-bold tracking-[-0.015em] text-charcoal sm:inline'>
						{en.brand.name}
					</span>
				</NextLink>

				<nav
					aria-label='Workspace navigation'
					className='flex items-center gap-1 rounded-lg border border-line bg-white p-1'>
					{navItems.map(({ href, label, Icon }) => {
						const active = pathname === href || pathname.startsWith(`${href}/`)
						return (
							<NextLink
								aria-current={active ? "page" : undefined}
								className={`flex min-h-9 items-center gap-2 rounded-md px-3 text-sm font-semibold transition ${
									active ? "bg-bone text-charcoal" : "text-muted hover:text-charcoal"
								}`}
								href={href}
								key={href}>
								<Icon
									aria-hidden='true'
									size={17}
									stroke={1.9}
								/>
								<span className='hidden sm:inline'>{label}</span>
							</NextLink>
						)
					})}
				</nav>

				<div className='flex items-center gap-3'>
					{email ? (
						<span className='hidden max-w-44 truncate text-xs text-muted lg:block'>{email}</span>
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
						<span className='hidden sm:inline'>{en.navigation.signOut}</span>
					</Button>
				</div>
			</div>
		</header>
	)
}
