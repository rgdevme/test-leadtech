import { z } from "zod";

import { projectedSubscriptionStatusSchema } from "./billing.js";
import {
  firebaseUidSchema,
  stripeCustomerIdSchema,
  stripeEventIdSchema,
  stripePriceIdSchema,
  stripeSubscriptionIdSchema,
} from "./stripe.js";

export const firestoreTimestampValueSchema = z.object({
  seconds: z.number().int(),
  nanoseconds: z.number().int().min(0).max(999_999_999),
});

export const subscriptionPersistenceDataSchema = z.object({
  uid: firebaseUidSchema,
  stripeCustomerId: stripeCustomerIdSchema,
  stripeSubscriptionId: stripeSubscriptionIdSchema,
  stripePriceId: stripePriceIdSchema,
  status: projectedSubscriptionStatusSchema,
  entitlement: z.enum(["active", "inactive"]),
  cancelAtPeriodEnd: z.boolean(),
  lastStripeEventId: stripeEventIdSchema,
});

export const subscriptionPersistenceSchema = subscriptionPersistenceDataSchema.extend({
  updatedAt: firestoreTimestampValueSchema,
});

export const stripeWebhookEventPersistenceDataSchema = z.object({
  type: z.string().min(1).max(128),
  objectId: z.string().min(1).max(255).nullable(),
});

export const stripeWebhookEventPersistenceSchema = stripeWebhookEventPersistenceDataSchema.extend({
  processedAt: firestoreTimestampValueSchema,
});

export type FirestoreTimestampValue = z.infer<typeof firestoreTimestampValueSchema>;
export type SubscriptionPersistenceData = z.infer<typeof subscriptionPersistenceDataSchema>;
export type SubscriptionPersistence = z.infer<typeof subscriptionPersistenceSchema>;
export type StripeWebhookEventPersistenceData = z.infer<
  typeof stripeWebhookEventPersistenceDataSchema
>;
export type StripeWebhookEventPersistence = z.infer<typeof stripeWebhookEventPersistenceSchema>;
