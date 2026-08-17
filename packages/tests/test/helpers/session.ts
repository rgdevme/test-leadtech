import type { APIRequestContext, PlaywrightWorkerArgs } from "@playwright/test"

import { csrfTokenResponseSchema } from "@leadtech/common/contracts"

import { applicationUrl } from "../../environment.js"
import { authEmulatorUrl } from "./environment.js"
import type { TestIdentity } from "./identity.js"

type AuthEmulatorResponse = {
	idToken?: unknown
}

export const getEmulatorIdToken = async (identity: TestIdentity) => {
	const response = await fetch(
		`${authEmulatorUrl}/identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=draftroom-tests`,
		{
			body: JSON.stringify({
				email: identity.email,
				password: identity.password,
				returnSecureToken: true
			}),
			headers: { "Content-Type": "application/json" },
			method: "POST"
		}
	)
	const body = (await response.json()) as AuthEmulatorResponse

	if (!response.ok || typeof body.idToken !== "string") {
		throw new Error(`Could not obtain an emulator ID token for ${identity.uid}.`)
	}

	return body.idToken
}

export const createSessionContext = async (
	playwright: PlaywrightWorkerArgs["playwright"],
	identity: TestIdentity,
	forwardedAddress: string
): Promise<APIRequestContext> => {
	const context = await playwright.request.newContext({
		baseURL: applicationUrl,
		extraHTTPHeaders: {
			Origin: applicationUrl,
			"x-forwarded-for": forwardedAddress
		}
	})
	const csrfResponse = await context.get("/api/auth/csrf")
	const csrf = csrfTokenResponseSchema.parse(await csrfResponse.json())
	const idToken = await getEmulatorIdToken(identity)
	const sessionResponse = await context.post("/api/auth/session", {
		data: { csrfToken: csrf.csrfToken, idToken }
	})

	if (!sessionResponse.ok()) {
		await context.dispose()
		throw new Error(`Could not create a server session for ${identity.uid}.`)
	}

	return context
}
