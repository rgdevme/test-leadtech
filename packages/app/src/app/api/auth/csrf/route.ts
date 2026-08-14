import { randomBytes } from "node:crypto"

import { NextResponse } from "next/server"

import { CSRF_COOKIE_NAME } from "@/guards/authentication"
import { noStoreHeaders, secureCookie } from "@/utils/http"

export const dynamic = "force-dynamic"

export const GET = () => {
	const csrfToken = randomBytes(32).toString("base64url")
	const response = NextResponse.json({ csrfToken }, { headers: noStoreHeaders })

	response.cookies.set(CSRF_COOKIE_NAME, csrfToken, {
		httpOnly: true,
		sameSite: "lax",
		secure: secureCookie(),
		path: "/",
		maxAge: 10 * 60
	})

	return response
}
