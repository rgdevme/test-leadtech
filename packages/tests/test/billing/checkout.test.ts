import { randomUUID } from "node:crypto"

import { expect, test } from "@playwright/test"
import {
	createCheckoutResponseSchema,
	stripeMetadataKeys,
	subscriptionPlanIds
} from "@leadtech/common/contracts"
import Stripe from "stripe"

import input from "./input.json" with { type: "json" }
import seed from "./seed.json" with { type: "json" }
import { applicationUrl, stripeApiKey } from "../../environment.js"
import {
	cleanupFirebaseState,
	createFirebaseUser,
	getStoredUser,
	seedSubscription
} from "../helpers/firebase.js"
import { createTestIdentity } from "../helpers/identity.js"
import { createSessionContext } from "../helpers/session.js"
import { cleanupStripeResources, getStripeCheckoutSessionId } from "../helpers/stripe.js"

/** As a subscriber, I can start one correctly configured Checkout flow from an authenticated account. */
test.describe("to create a safe Stripe Checkout as a subscriber, I...", () => {
	test.skip(!stripeApiKey, "STRIPE_API_KEY is unavailable; Stripe sandbox tests are skipped.")

	test("can't create Checkout with an invalid request or an active entitlement", async ({
		playwright,
		request
	}) => {
		const identity = createTestIdentity(seed.emailPrefix)
		await createFirebaseUser(identity)
		const context = await createSessionContext(playwright, identity, "198.51.100.61")

		try {
			const unauthenticated = await request.post("/api/billing/checkout", {
				data: { intent: "subscribe", planKey: input.planKey },
				headers: {
					"Idempotency-Key": randomUUID(),
					Origin: applicationUrl
				}
			})
			const invalidOrigin = await context.post("/api/billing/checkout", {
				data: { intent: "subscribe", planKey: input.planKey },
				headers: { "Idempotency-Key": randomUUID(), Origin: "https://untrusted.example" }
			})
			const invalidPlan = await context.post("/api/billing/checkout", {
				data: { intent: "subscribe", planKey: input.invalidPlanKey },
				headers: { "Idempotency-Key": randomUUID() }
			})
			const invalidIdempotencyKey = await context.post("/api/billing/checkout", {
				data: { intent: "subscribe", planKey: input.planKey },
				headers: { "Idempotency-Key": input.invalidIdempotencyKey }
			})

			expect([
				unauthenticated.status(),
				invalidOrigin.status(),
				invalidPlan.status(),
				invalidIdempotencyKey.status()
			]).toEqual([401, 403, 400, 400])

			await seedSubscription(identity.uid)
			const activeEntitlement = await context.post("/api/billing/checkout", {
				data: { intent: "subscribe", planKey: input.planKey },
				headers: { "Idempotency-Key": randomUUID() }
			})
			expect(activeEntitlement.status()).toBe(409)
		} finally {
			await context.dispose()
			await cleanupFirebaseState([identity.uid])
		}
	})

	test("can create idempotent Checkout sessions with the expected Stripe data", async ({
		playwright
	}) => {
		const stripe = new Stripe(stripeApiKey!)
		const identity = createTestIdentity(seed.emailPrefix)
		const sessionIds = new Set<string>()
		let customerId: string | undefined
		await createFirebaseUser(identity)
		const context = await createSessionContext(playwright, identity, "198.51.100.62")

		try {
			const idempotencyKey = randomUUID()
			const firstResponse = await context.post("/api/billing/checkout", {
				data: { intent: "subscribe", planKey: input.planKey },
				headers: { "Idempotency-Key": idempotencyKey }
			})
			expect(firstResponse.status()).toBe(201)
			const firstCheckout = createCheckoutResponseSchema.parse(await firstResponse.json())
			const firstSessionId = getStripeCheckoutSessionId(firstCheckout.checkoutUrl)
			sessionIds.add(firstSessionId)

			const repeatedResponse = await context.post("/api/billing/checkout", {
				data: { intent: "subscribe", planKey: input.planKey },
				headers: { "Idempotency-Key": idempotencyKey }
			})
			expect(repeatedResponse.status()).toBe(201)
			const repeatedCheckout = createCheckoutResponseSchema.parse(await repeatedResponse.json())
			expect(getStripeCheckoutSessionId(repeatedCheckout.checkoutUrl)).toBe(firstSessionId)

			const nextResponse = await context.post("/api/billing/checkout", {
				data: { intent: "subscribe", planKey: input.planKey },
				headers: { "Idempotency-Key": randomUUID() }
			})
			expect(nextResponse.status()).toBe(201)
			const nextCheckout = createCheckoutResponseSchema.parse(await nextResponse.json())
			const nextSessionId = getStripeCheckoutSessionId(nextCheckout.checkoutUrl)
			sessionIds.add(nextSessionId)
			expect(nextSessionId).not.toBe(firstSessionId)

			const storedUser = await getStoredUser(identity.uid)
			customerId = storedUser.get("stripeCustomerId") as string | undefined
			expect(customerId).toMatch(/^cus_[A-Za-z0-9]+$/)

			const [firstSession, nextSession] = await Promise.all([
				stripe.checkout.sessions.retrieve(firstSessionId, { expand: ["line_items"] }),
				stripe.checkout.sessions.retrieve(nextSessionId, { expand: ["line_items"] })
			])
			const customer = await stripe.customers.retrieve(customerId!)
			expect(customer).toMatchObject({
				email: identity.email,
				metadata: { [stripeMetadataKeys.firebaseUid]: identity.uid }
			})
			const expectedSuccessUrl = `${applicationUrl}/en/subscribe/pending`
			const expectedCancelUrl = `${applicationUrl}/en/documents?intent=subscribe&plan=write`

			for (const checkoutSession of [firstSession, nextSession]) {
				expect(checkoutSession).toMatchObject({
					cancel_url: expectedCancelUrl,
					client_reference_id: identity.uid,
					customer: customerId,
					metadata: { [stripeMetadataKeys.firebaseUid]: identity.uid },
					mode: "subscription",
					success_url: expectedSuccessUrl
				})
				expect(checkoutSession.line_items?.data[0]?.price?.id).toBe(subscriptionPlanIds.write)
			}
		} finally {
			await context.dispose()
			if (!customerId) {
				const storedUser = await getStoredUser(identity.uid)
				customerId = storedUser.get("stripeCustomerId") as string | undefined
			}
			try {
				await cleanupStripeResources(stripe, customerId, sessionIds)
			} finally {
				await cleanupFirebaseState([identity.uid])
			}
		}
	})
})
