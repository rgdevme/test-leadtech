import { expect, test, type APIRequestContext } from "@playwright/test"

import { documentRecordSchema, listDocumentsResponseSchema } from "@leadtech/common/contracts"

import input from "./input.json" with { type: "json" }
import seed from "./seed.json" with { type: "json" }
import { applicationUrl } from "../../environment.js"
import {
	cleanupFirebaseState,
	createFirebaseUser,
	deleteSubscription,
	seedDocument,
	seedSubscription
} from "../helpers/firebase.js"
import { createTestIdentity, type TestIdentity } from "../helpers/identity.js"
import { createSessionContext } from "../helpers/session.js"

type AuthorizationState = {
	activeContext: APIRequestContext
	activeDocumentId: string
	activeIdentity: TestIdentity
	inactiveContext: APIRequestContext
	inactiveDocumentId: string
	inactiveIdentity: TestIdentity
}

const createAuthorizationState = async (
	playwright: Parameters<typeof createSessionContext>[0]
): Promise<AuthorizationState> => {
	const activeIdentity = createTestIdentity("active-writer")
	const inactiveIdentity = createTestIdentity("inactive-writer")
	const activeDocumentId = `document_${activeIdentity.uid}`
	const inactiveDocumentId = `document_${inactiveIdentity.uid}`

	await Promise.all([createFirebaseUser(activeIdentity), createFirebaseUser(inactiveIdentity)])
	await Promise.all([
		seedDocument(activeIdentity.uid, activeDocumentId, seed.activeTitle),
		seedDocument(inactiveIdentity.uid, inactiveDocumentId, seed.inactiveTitle),
		seedSubscription(activeIdentity.uid)
	])
	const [activeContext, inactiveContext] = await Promise.all([
		createSessionContext(playwright, activeIdentity, "198.51.100.41"),
		createSessionContext(playwright, inactiveIdentity, "198.51.100.42")
	])

	return {
		activeContext,
		activeDocumentId,
		activeIdentity,
		inactiveContext,
		inactiveDocumentId,
		inactiveIdentity
	}
}

const cleanupAuthorizationState = async (state: AuthorizationState) => {
	await Promise.all([state.activeContext.dispose(), state.inactiveContext.dispose()])
	await cleanupFirebaseState(
		[state.activeIdentity.uid, state.inactiveIdentity.uid],
		[state.activeDocumentId, state.inactiveDocumentId]
	)
}

/** As a document owner, I can access only my documents according to my current entitlement. */
test.describe("to protect document ownership and paid access as a document owner, I...", () => {
	test("can't access document endpoints without authentication", async ({ request }) => {
		const headers = { Origin: applicationUrl }
		const responses = await Promise.all([
			request.get("/api/documents"),
			request.post("/api/documents", { headers }),
			request.get("/api/documents/unknown"),
			request.patch("/api/documents/unknown", {
				data: { expectedVersion: 1, title: input.renamedTitle },
				headers
			}),
			request.delete("/api/documents/unknown", { headers })
		])

		expect(responses.map(response => response.status())).toEqual([401, 401, 401, 401, 401])
	})

	test("can't discover or mutate another owner's document", async ({ playwright }) => {
		const state = await createAuthorizationState(playwright)

		try {
			const responses = await Promise.all([
				state.inactiveContext.get(`/api/documents/${state.activeDocumentId}`),
				state.inactiveContext.patch(`/api/documents/${state.activeDocumentId}`, {
					data: { expectedVersion: 1, title: input.renamedTitle }
				}),
				state.inactiveContext.delete(`/api/documents/${state.activeDocumentId}`)
			])

			expect(responses.map(response => response.status())).toEqual([404, 404, 404])
		} finally {
			await cleanupAuthorizationState(state)
		}
	})

	test("can read while inactive but can't mutate documents", async ({ playwright }) => {
		const state = await createAuthorizationState(playwright)

		try {
			const listResponse = await state.inactiveContext.get("/api/documents")
			const list = listDocumentsResponseSchema.parse(await listResponse.json())
			expect(list.items.map(document => document.id)).toEqual([state.inactiveDocumentId])

			const readResponse = await state.inactiveContext.get(
				`/api/documents/${state.inactiveDocumentId}`
			)
			expect(readResponse.status()).toBe(200)

			const mutationResponses = await Promise.all([
				state.inactiveContext.post("/api/documents"),
				state.inactiveContext.patch(`/api/documents/${state.inactiveDocumentId}`, {
					data: { expectedVersion: 1, title: input.renamedTitle }
				}),
				state.inactiveContext.delete(`/api/documents/${state.inactiveDocumentId}`)
			])
			expect(mutationResponses.map(response => response.status())).toEqual([403, 403, 403])
		} finally {
			await cleanupAuthorizationState(state)
		}
	})

	test("can mutate owned documents only while entitlement remains active", async ({
		playwright
	}) => {
		const state = await createAuthorizationState(playwright)

		try {
			const createResponse = await state.activeContext.post("/api/documents")
			expect(createResponse.status()).toBe(201)
			const created = documentRecordSchema.parse(await createResponse.json())

			const updateResponse = await state.activeContext.patch(`/api/documents/${created.id}`, {
				data: {
					content: input.content,
					expectedVersion: created.version,
					title: input.renamedTitle
				}
			})
			expect(updateResponse.status()).toBe(200)
			const updated = documentRecordSchema.parse(await updateResponse.json())
			expect(updated).toMatchObject({ title: input.renamedTitle, version: 2 })

			const deleteResponse = await state.activeContext.delete(`/api/documents/${created.id}`)
			expect(deleteResponse.status()).toBe(204)

			await deleteSubscription(state.activeIdentity.uid)
			const revokedResponse = await state.activeContext.post("/api/documents")
			expect(revokedResponse.status()).toBe(403)
			expect((await revokedResponse.json()).error.code).toBe("subscription_required")
		} finally {
			await cleanupAuthorizationState(state)
		}
	})
})
