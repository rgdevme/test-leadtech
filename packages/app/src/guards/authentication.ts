import "server-only"

import type { AuthUser } from "@leadtech/contracts"
import { cookies } from "next/headers"
import { cache } from "react"

import { ApiError } from "@/errors/apiError"
import { getFirebaseAdminAuth } from "@/firebase/server"

export const SESSION_COOKIE_NAME = "__session"
export const CSRF_COOKIE_NAME = "leadtech_csrf"

export const getSessionPrincipal = cache(async (): Promise<AuthUser | null> => {
	const cookieStore = await cookies()
	const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value

	if (!sessionCookie) {
		return null
	}

	try {
		const decodedToken = await getFirebaseAdminAuth().verifySessionCookie(sessionCookie, true)
		return {
			uid: decodedToken.uid,
			email: typeof decodedToken.email === "string" ? decodedToken.email : null
		}
	} catch {
		return null
	}
})

export const requireSessionPrincipal = async () => {
	const principal = await getSessionPrincipal()
	if (!principal) {
		throw new ApiError(401, "unauthenticated", "Sign in to continue.")
	}

	return principal
}
