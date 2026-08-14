import {
  stripeEventIdSchema,
  stripeWebhookEventPersistenceDataSchema,
  type StripeWebhookEventPersistenceData,
} from "@leadtech/contracts";
import { FieldValue, type DocumentReference, type Firestore } from "firebase-admin/firestore";

const STRIPE_WEBHOOK_EVENTS_COLLECTION = "stripeWebhookEvents";

export const getStripeWebhookEventReference = (
  firestore: Firestore,
  eventId: string,
): DocumentReference =>
  firestore.collection(STRIPE_WEBHOOK_EVENTS_COLLECTION).doc(stripeEventIdSchema.parse(eventId));

export const hasStripeWebhookEvent = async (firestore: Firestore, eventId: string) => {
  const snapshot = await getStripeWebhookEventReference(firestore, eventId).get();

  return snapshot.exists;
};

export const recordStripeWebhookEvent = async (
  firestore: Firestore,
  eventId: string,
  data: StripeWebhookEventPersistenceData,
) => {
  const eventReference = getStripeWebhookEventReference(firestore, eventId);
  const eventData = stripeWebhookEventPersistenceDataSchema.parse(data);

  return firestore.runTransaction(async (transaction) => {
    const eventSnapshot = await transaction.get(eventReference);

    if (eventSnapshot.exists) {
      return "duplicate" as const;
    }

    transaction.create(eventReference, {
      ...eventData,
      processedAt: FieldValue.serverTimestamp(),
    });

    return "recorded" as const;
  });
};
