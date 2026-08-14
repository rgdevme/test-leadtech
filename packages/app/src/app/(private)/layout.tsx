import { redirect } from "next/navigation"
import type { PropsWithChildren } from "react"

import { AppHeader } from "@/components/organisms/AppHeader"
import { getSessionPrincipal } from "@/guards/authentication"

type AuthenticatedLayoutProps = PropsWithChildren

export default async function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
	const principal = await getSessionPrincipal()
	if (!principal) {
		redirect("/api/auth/session")
	}

	return (
		<>
			<AppHeader email={principal.email} />
			{children}
		</>
	)
}
