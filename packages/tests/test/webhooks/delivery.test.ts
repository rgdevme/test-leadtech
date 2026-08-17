import { randomUUID } from "node:crypto"

import { stripeMetadataKeys } from "@leadtech/common/contracts"
import Stripe from "stripe"
import { afterAll, describe, expect, test } from "vitest"

import input from "./input.json" with { type: "json" }
import seed from "./seed.json" with { type: "json" }
import { stripeApiKey, stripeWebhookSigningSecret } from "../../environment.js"
import { stripeWebhookUrl } from "../helpers/environment.js"
import {
	cleanupWebhookState,
	closeFirebaseAdmin,
	getStoredSubscription,
	getStoredWebhookEvent
} from "../helpers/firebase.js"

const stripe = new Stripe(stripeApiKey!)

const createIdentifier = () => randomUUID().replaceAll("-", "")

const createSubscriptionEvent = ({
	eventId,
	priceId = `price_${createIdentifier()}`,
	type = "customer.subscription.deleted",
	uid
}: {
	eventId: string
	priceId?: string
	type?: "customer.subscription.deleted" | "customer.subscription.updated"
	uid?: string
}) => {
	const identifier = createIdentifier()
	const productId = `prod_${identifier}`

	return {
		api_version: "2026-07-29.dahlia",
		created: Math.floor(Date.now() / 1000),
		data: {
			object: {
				cancel_at_period_end: false,
				customer: `cus_${identifier}`,
				id: `sub_${identifier}`,
				items: {
					data: [{ price: { id: priceId, product: productId } }]
				},
				metadata: {
					...(uid ? { [stripeMetadataKeys.firebaseUid]: uid } : {}),
					[stripeMetadataKeys.subscriptionProductId]: productId
				},
				object: "subscription",
				status: "active"
			}
		},
		id: eventId,
		livemode: false,
		object: "event",
		pending_webhooks: 1,
		request: { id: null, idempotency_key: null },
		type
	}
}

const createUnsupportedEvent = (eventId: string) => ({
	api_version: "2026-07-29.dahlia",
	created: Math.floor(Date.now() / 1000),
	data: { object: { id: `prod_${createIdentifier()}`, object: "product" } },
	id: eventId,
	livemode: false,
	object: "event",
	pending_webhooks: 1,
	request: { id: null, idempotency_key: null },
	type: input.unsupportedType
})

const sendSignedEvent = async (event: object) => {
	const payload = JSON.stringify(event)
	const signature = stripe.webhooks.generateTestHeaderString({
		payload,
		secret: stripeWebhookSigningSecret
	})

	return fetch(stripeWebhookUrl, {
		body: payload,
		headers: {
			"Content-Type": "application/json",
			"stripe-signature": signature
		},
		method: "POST"
	})
}

afterAll(async () => {
	await closeFirebaseAdmin()
})

/** As an operator, I can trust only authentic and durably handled Stripe webhook deliveries. */
describe("to project paid access safely as an operator, I...", () => {
	test("can't accept unsupported methods or unsigned payloads", async () => {
		const eventId = `evt_${seed.eventPrefix}${createIdentifier()}`
		const event = createUnsupportedEvent(eventId)

		try {
			const methodResponse = await fetch(stripeWebhookUrl, { method: "GET" })
			expect(methodResponse.status).toBe(400)

			const missingSignatureResponse = await fetch(stripeWebhookUrl, {
				body: JSON.stringify(event),
				headers: { "Content-Type": "application/json" },
				method: "POST"
			})
			expect(missingSignatureResponse.status).toBe(400)

			const invalidSignatureResponse = await fetch(stripeWebhookUrl, {
				body: JSON.stringify(event),
				headers: {
					"Content-Type": "application/json",
					"stripe-signature": "invalid"
				},
				method: "POST"
			})
			expect(invalidSignatureResponse.status).toBe(400)
			expect((await getStoredWebhookEvent(eventId)).exists).toBe(false)
		} finally {
			await cleanupWebhookState([eventId], [])
		}
	})

	test("can acknowledge a signed unsupported event without writing state", async () => {
		const eventId = `evt_${seed.eventPrefix}${createIdentifier()}`

		try {
			const response = await sendSignedEvent(createUnsupportedEvent(eventId))
			expect(response.status).toBe(200)
			expect((await getStoredWebhookEvent(eventId)).exists).toBe(false)
		} finally {
			await cleanupWebhookState([eventId], [])
		}
	})

	test("can atomically record one supported event and its subscription projection", async () => {
		const eventId = `evt_${seed.eventPrefix}${createIdentifier()}`
		const uid = `${seed.uidPrefix}_${createIdentifier()}`
		const event = createSubscriptionEvent({ eventId, uid })

		try {
			const response = await sendSignedEvent(event)
			expect(response.status).toBe(200)
			const [eventRecord, subscription] = await Promise.all([
				getStoredWebhookEvent(eventId),
				getStoredSubscription(uid)
			])
			expect(eventRecord.exists).toBe(true)
			expect(subscription.data()).toMatchObject({
				entitlement: "inactive",
				lastStripeEventId: eventId,
				status: "canceled",
				uid
			})
		} finally {
			await cleanupWebhookState([eventId], [uid])
		}
	})

	test("can ignore duplicate and concurrent deliveries without rewriting the projection", async () => {
		const eventId = `evt_${seed.eventPrefix}${createIdentifier()}`
		const uid = `${seed.uidPrefix}_${createIdentifier()}`
		const event = createSubscriptionEvent({ eventId, uid })

		try {
			const responses = await Promise.all([sendSignedEvent(event), sendSignedEvent(event)])
			expect(responses.map(response => response.status)).toEqual([200, 200])

			const firstProjection = await getStoredSubscription(uid)
			const firstUpdatedAt = firstProjection.get("updatedAt")
			const duplicateResponse = await sendSignedEvent(event)
			expect(duplicateResponse.status).toBe(200)

			const duplicateProjection = await getStoredSubscription(uid)
			expect(duplicateProjection.get("updatedAt").isEqual(firstUpdatedAt)).toBe(true)
		} finally {
			await cleanupWebhookState([eventId], [uid])
		}
	})

	test("can't grant access when Firebase correlation is missing", async () => {
		const eventId = `evt_${seed.eventPrefix}${createIdentifier()}`

		try {
			const response = await sendSignedEvent(createSubscriptionEvent({ eventId }))
			expect(response.status).toBe(200)
			expect((await getStoredWebhookEvent(eventId)).exists).toBe(true)
		} finally {
			await cleanupWebhookState([eventId], [])
		}
	})

	test("can request a retry and later persist the corrected delivery", async () => {
		const eventId = `evt_${seed.eventPrefix}${createIdentifier()}`
		const uid = `${seed.uidPrefix}_${createIdentifier()}`

		try {
			const failedResponse = await sendSignedEvent(
				createSubscriptionEvent({ eventId, priceId: input.invalidPriceId, uid })
			)
			expect(failedResponse.status).toBe(500)
			expect((await getStoredWebhookEvent(eventId)).exists).toBe(false)

			const retryResponse = await sendSignedEvent(createSubscriptionEvent({ eventId, uid }))
			expect(retryResponse.status).toBe(200)
			expect((await getStoredWebhookEvent(eventId)).exists).toBe(true)
			expect((await getStoredSubscription(uid)).exists).toBe(true)
		} finally {
			await cleanupWebhookState([eventId], [uid])
		}
	})
})
