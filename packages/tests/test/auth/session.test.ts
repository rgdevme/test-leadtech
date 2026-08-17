import { test, expect } from "@playwright/test"

import { csrfTokenResponseSchema } from "@leadtech/common/contracts"

import input from "./input.json" with { type: "json" }
import seed from "./seed.json" with { type: "json" }
import { applicationUrl } from "../../environment.js"
import { cleanupFirebaseState, createFirebaseUser, getTestAuth } from "../helpers/firebase.js"
import { createTestIdentity } from "../helpers/identity.js"
import { getEmulatorIdToken } from "../helpers/session.js"

/** As a writer, I can establish and end a server-validated session to access my workspace. */
test.describe("to access a protected workspace as a writer, I...", () => {
	test("can register, receive a secure session, and sign out", async ({ context, page }) => {
		const identity = createTestIdentity(seed.emailPrefix, input.password)
		let createdUid: string | undefined

		try {
			await page.goto("/en/sign-up")
			await page.getByLabel("Email address").fill(identity.email)
			await page.getByLabel("Password", { exact: true }).fill(identity.password)
			await page.getByLabel("Confirm password").fill(identity.password)
			await page.getByRole("button", { name: "Create account" }).click()

			await expect(page).toHaveURL(/\/en\/documents/)
			const sessionCookie = (await context.cookies()).find(cookie => cookie.name === "__session")
			expect(sessionCookie).toMatchObject({
				httpOnly: true,
				path: "/",
				sameSite: "Lax",
				secure: false
			})

			createdUid = (await getTestAuth().getUserByEmail(identity.email)).uid
			await page.goto("/en/profile")
			await page.getByRole("button", { name: "Sign out" }).click()
			await expect(page).toHaveURL(/\/en$/)
			await page.goto("/en/documents")
			await expect(page).toHaveURL(/\/en\/sign-in\?session=expired/)
		} finally {
			if (createdUid) {
				await cleanupFirebaseState([createdUid])
			}
		}
	})

	test("can sign in and sees safe feedback for invalid credentials", async ({ page }) => {
		const identity = createTestIdentity(seed.emailPrefix, input.password)
		await createFirebaseUser(identity)

		try {
			await page.goto("/en/sign-in")
			await page.getByLabel("Email address").fill(identity.email)
			await page.getByLabel("Password").fill(input.wrongPassword)
			await page.getByRole("button", { name: "Sign in" }).click()
			await expect(page.getByText("We could not complete that request. Try again.")).toBeVisible()

			await page.getByLabel("Password").fill(identity.password)
			await page.getByRole("button", { name: "Sign in" }).click()
			await expect(page).toHaveURL(/\/en\/documents/)
		} finally {
			await cleanupFirebaseState([identity.uid])
		}
	})

	test("can't submit invalid registration values", async ({ page }) => {
		await page.goto("/en/sign-up")
		const email = page.getByLabel("Email address")
		await email.fill(input.invalidEmail)
		await page.getByLabel("Password", { exact: true }).fill(input.password)
		await page.getByLabel("Confirm password").fill(input.mismatchedPassword)
		await page.getByRole("button", { name: "Create account" }).click()

		expect(await email.evaluate(element => (element as HTMLInputElement).validity.valid)).toBe(
			false
		)
		await email.fill(createTestIdentity(seed.emailPrefix).email)
		await page.getByRole("button", { name: "Create account" }).click()
		await expect(page.getByText("Passwords must match.")).toBeVisible()
		await expect(page).toHaveURL(/\/en\/sign-up/)
	})

	test("can't create a session without matching CSRF and origin values", async ({ playwright }) => {
		const identity = createTestIdentity(seed.emailPrefix, input.password)
		await createFirebaseUser(identity)
		const idToken = await getEmulatorIdToken(identity)
		const context = await playwright.request.newContext({
			baseURL: applicationUrl,
			extraHTTPHeaders: { "x-forwarded-for": seed.forwardedAddress }
		})

		try {
			const csrfResponse = await context.get("/api/auth/csrf")
			const csrf = csrfTokenResponseSchema.parse(await csrfResponse.json())
			const mismatchResponse = await context.post("/api/auth/session", {
				data: { csrfToken: `${csrf.csrfToken}x`, idToken },
				headers: { Origin: applicationUrl }
			})
			expect(mismatchResponse.status()).toBe(400)

			const originResponse = await context.post("/api/auth/session", {
				data: { csrfToken: csrf.csrfToken, idToken },
				headers: { Origin: "https://untrusted.example" }
			})
			expect(originResponse.status()).toBe(403)
		} finally {
			await context.dispose()
			await cleanupFirebaseState([identity.uid])
		}
	})

	test("can't use an invalid session cookie on a protected route", async ({ context, page }) => {
		await context.addCookies([
			{
				domain: "localhost",
				httpOnly: true,
				name: "__session",
				path: "/",
				sameSite: "Lax",
				secure: false,
				value: "invalid-session"
			}
		])

		await page.goto("/en/documents")
		await expect(page).toHaveURL(/\/en\/sign-in\?session=expired/)
	})

	test("can't exceed the session-attempt rate limit", async ({ playwright }) => {
		const context = await playwright.request.newContext({
			baseURL: applicationUrl,
			extraHTTPHeaders: { "x-forwarded-for": "198.51.100.32" }
		})

		try {
			for (let attempt = 0; attempt < 10; attempt += 1) {
				const response = await context.post("/api/auth/session", { data: {} })
				expect(response.status()).toBe(403)
			}

			const limitedResponse = await context.post("/api/auth/session", { data: {} })
			expect(limitedResponse.status()).toBe(429)
			expect(limitedResponse.headers()["retry-after"]).toBeDefined()
		} finally {
			await context.dispose()
		}
	})
})
