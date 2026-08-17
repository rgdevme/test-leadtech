"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

import { firebaseAuth } from "@/firebase/client"
import { useLocale } from "@/hooks/useLocale"
import { routes } from "@/i18n/routes"
import { requestNoContent } from "@/utils/apiClient"

export const useSignOut = () => {
	const { locale } = useLocale()
	const router = useRouter()
	const [signingOut, setSigningOut] = useState(false)

	const signOut = async () => {
		setSigningOut(true)
		try {
			await requestNoContent("/api/auth/session", { method: "DELETE" })
			await firebaseAuth.signOut()
			router.replace(routes.home(locale))
			router.refresh()
		} finally {
			setSigningOut(false)
		}
	}

	return { signOut, signingOut }
}
