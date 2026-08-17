import {
	firebaseUidSchema,
	stripeMetadataKeys,
	stripeSubscriptionIdSchema,
	subscriptionPlanIds
} from "@leadtech/common/contracts"
import type Stripe from "stripe"

import { getFirestoreDatabase } from "../firebase/admin.js"
import {
	hasStripeWebhookEvent,
	recordStripeWebhookEvent
} from "../repositories/stripeWebhookEvents.js"
import { persistSubscriptionProjection } from "../repositories/subscriptions.js"
import { getStripeClient } from "../stripe/client.js"
import {
	getCheckoutSubscriptionId,
	getInvoiceSubscriptionId,
	getStripeEventObjectId,
	type SupportedStripeEvent
} from "../stripe/events.js"
import { projectSubscription, SubscriptionProjectionError } from "./projectSubscription.js"

type PermanentCorrelationErrorCode =
	| "invalid_firebase_uid"
	| "mismatched_firebase_uid"
	| "missing_firebase_uid"
	| "missing_subscription"

class PermanentCorrelationError extends Error {
	readonly code: PermanentCorrelationErrorCode

	constructor(code: PermanentCorrelationErrorCode, message: string) {
		super(message)
		this.name = "PermanentCorrelationError"
		this.code = code
	}
}

type ResolvedSubscription = {
	firebaseUid: string
	forceCanceled: boolean
	subscription: Stripe.Subscription
}

const entitledPriceIds = new Set(Object.values(subscriptionPlanIds))

export type ProcessStripeWebhookResult =
	| {
			ok: true
			outcome: "duplicate" | "processed" | "rejected"
			eventId: string
			eventType: string
			objectId: string | null
			firebaseUid?: string
			stripeSubscriptionId?: string
			errorCode?: PermanentCorrelationErrorCode
	  }
	| {
			ok: false
			outcome: "retry"
			eventId: string
			eventType: string
			objectId: string | null
			errorCode: "invalid_projection" | "processing_failed"
	  }

const resolveFirebaseUid = (metadataValues: Array<string | undefined>) => {
	const configuredValues = metadataValues.filter((value): value is string => value !== undefined)

	if (configuredValues.length === 0) {
		throw new PermanentCorrelationError(
			"missing_firebase_uid",
			"Stripe metadata does not contain a Firebase UID."
		)
	}

	const parsedValues = configuredValues.map(value => firebaseUidSchema.safeParse(value))

	if (parsedValues.some(value => !value.success)) {
		throw new PermanentCorrelationError(
			"invalid_firebase_uid",
			"Stripe metadata contains an invalid Firebase UID."
		)
	}

	const firebaseUids = parsedValues.map(value => value.data)

	if (new Set(firebaseUids).size !== 1) {
		throw new PermanentCorrelationError(
			"mismatched_firebase_uid",
			"Stripe metadata contains conflicting Firebase UIDs."
		)
	}

	const firebaseUid = firebaseUids[0]

	if (!firebaseUid) {
		throw new PermanentCorrelationError(
			"missing_firebase_uid",
			"Stripe metadata does not contain a Firebase UID."
		)
	}

	return firebaseUid
}

const retrieveSubscription = async (subscriptionId: string) => {
	const parsedSubscriptionId = stripeSubscriptionIdSchema.safeParse(subscriptionId)

	if (!parsedSubscriptionId.success) {
		throw new PermanentCorrelationError(
			"missing_subscription",
			"The Stripe event does not reference a valid Subscription."
		)
	}

	return getStripeClient().subscriptions.retrieve(parsedSubscriptionId.data)
}

const resolveCheckoutSubscription = async (
	event: Stripe.CheckoutSessionCompletedEvent
): Promise<ResolvedSubscription> => {
	const session = event.data.object
	const subscriptionId = getCheckoutSubscriptionId(session)

	if (!subscriptionId) {
		throw new PermanentCorrelationError(
			"missing_subscription",
			"The Checkout Session does not reference a Subscription."
		)
	}

	const subscription = await retrieveSubscription(subscriptionId)

	return {
		firebaseUid: resolveFirebaseUid([
			session.metadata?.[stripeMetadataKeys.firebaseUid],
			subscription.metadata[stripeMetadataKeys.firebaseUid]
		]),
		forceCanceled: false,
		subscription
	}
}

const resolveSubscriptionEvent = async (
	event:
		| Stripe.CustomerSubscriptionCreatedEvent
		| Stripe.CustomerSubscriptionUpdatedEvent
		| Stripe.CustomerSubscriptionDeletedEvent
): Promise<ResolvedSubscription> => {
	const eventSubscription = event.data.object
	const forceCanceled = event.type === "customer.subscription.deleted"
	const subscription = forceCanceled
		? eventSubscription
		: await retrieveSubscription(eventSubscription.id)

	return {
		firebaseUid: resolveFirebaseUid([subscription.metadata[stripeMetadataKeys.firebaseUid]]),
		forceCanceled,
		subscription
	}
}

const resolveInvoiceSubscription = async (
	event: Stripe.InvoicePaidEvent | Stripe.InvoicePaymentFailedEvent
): Promise<ResolvedSubscription> => {
	const subscriptionId = getInvoiceSubscriptionId(event.data.object)

	if (!subscriptionId) {
		throw new PermanentCorrelationError(
			"missing_subscription",
			"The Invoice does not reference a Subscription."
		)
	}

	const subscription = await retrieveSubscription(subscriptionId)

	return {
		firebaseUid: resolveFirebaseUid([subscription.metadata[stripeMetadataKeys.firebaseUid]]),
		forceCanceled: false,
		subscription
	}
}

const resolveSubscription = async (event: SupportedStripeEvent): Promise<ResolvedSubscription> => {
	switch (event.type) {
		case "checkout.session.completed":
			return resolveCheckoutSubscription(event)
		case "customer.subscription.created":
		case "customer.subscription.updated":
		case "customer.subscription.deleted":
			return resolveSubscriptionEvent(event)
		case "invoice.paid":
		case "invoice.payment_failed":
			return resolveInvoiceSubscription(event)
	}
}

export const processStripeWebhook = async (
	event: SupportedStripeEvent
): Promise<ProcessStripeWebhookResult> => {
	const firestore = getFirestoreDatabase()
	const objectId = getStripeEventObjectId(event)

	try {
		if (await hasStripeWebhookEvent(firestore, event.id)) {
			return {
				ok: true,
				outcome: "duplicate",
				eventId: event.id,
				eventType: event.type,
				objectId
			}
		}

		let resolvedSubscription: ResolvedSubscription

		try {
			resolvedSubscription = await resolveSubscription(event)
		} catch (error) {
			if (!(error instanceof PermanentCorrelationError)) {
				throw error
			}

			const recordingOutcome = await recordStripeWebhookEvent(firestore, event.id, {
				type: event.type,
				objectId
			})

			return {
				ok: true,
				outcome: recordingOutcome === "duplicate" ? "duplicate" : "rejected",
				eventId: event.id,
				eventType: event.type,
				objectId,
				errorCode: error.code
			}
		}

		const projection = projectSubscription({
			eventId: event.id,
			firebaseUid: resolvedSubscription.firebaseUid,
			forceCanceled: resolvedSubscription.forceCanceled,
			entitledPriceIds,
			subscription: resolvedSubscription.subscription
		})
		const persistenceOutcome = await persistSubscriptionProjection(firestore, {
			eventId: event.id,
			event: {
				type: event.type,
				objectId
			},
			subscription: projection
		})

		return {
			ok: true,
			outcome: persistenceOutcome,
			eventId: event.id,
			eventType: event.type,
			objectId,
			firebaseUid: projection.uid,
			stripeSubscriptionId: projection.stripeSubscriptionId
		}
	} catch (error) {
		return {
			ok: false,
			outcome: "retry",
			eventId: event.id,
			eventType: event.type,
			objectId,
			errorCode: error instanceof SubscriptionProjectionError ? error.code : "processing_failed"
		}
	}
}
