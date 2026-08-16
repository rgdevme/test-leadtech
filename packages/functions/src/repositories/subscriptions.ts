import {
	stripeWebhookEventPersistenceDataSchema,
	subscriptionPersistenceDataSchema,
	type StripeWebhookEventPersistenceData,
	type SubscriptionPersistenceData
} from "@leadtech/common/contracts"
import { FieldValue, type Firestore } from "firebase-admin/firestore"

import { getStripeWebhookEventReference } from "./stripeWebhookEvents.js"

const SUBSCRIPTIONS_COLLECTION = "subscriptions"

type PersistSubscriptionInput = {
	eventId: string
	event: StripeWebhookEventPersistenceData
	subscription: SubscriptionPersistenceData
}

export const persistSubscriptionProjection = async (
	firestore: Firestore,
	input: PersistSubscriptionInput
) => {
	const eventReference = getStripeWebhookEventReference(firestore, input.eventId)
	const eventData = stripeWebhookEventPersistenceDataSchema.parse(input.event)
	const subscriptionData = subscriptionPersistenceDataSchema.parse(input.subscription)
	const subscriptionReference = firestore
		.collection(SUBSCRIPTIONS_COLLECTION)
		.doc(subscriptionData.uid)

	return firestore.runTransaction(async transaction => {
		const eventSnapshot = await transaction.get(eventReference)

		if (eventSnapshot.exists) {
			return "duplicate" as const
		}

		transaction.create(eventReference, {
			...eventData,
			processedAt: FieldValue.serverTimestamp()
		})
		transaction.set(
			subscriptionReference,
			{
				...subscriptionData,
				updatedAt: FieldValue.serverTimestamp()
			},
			{ merge: false }
		)

		return "processed" as const
	})
}
