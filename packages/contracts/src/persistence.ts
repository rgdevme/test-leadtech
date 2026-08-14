import { z } from "zod";

import { richTextDocumentSchema } from "./documents.js";
import { subscriptionStatusSchema } from "./billing.js";

export const firestoreTimestampValueSchema = z.object({
  seconds: z.number(),
  nanoseconds: z.number(),
});

export const userPersistenceSchema = z.object({
  uid: z.string().min(1),
  email: z.email().nullable(),
  stripeCustomerId: z.string().min(1).optional(),
  createdAt: firestoreTimestampValueSchema,
  updatedAt: firestoreTimestampValueSchema,
});

export const subscriptionPersistenceSchema = z.object({
  uid: z.string().min(1),
  stripeCustomerId: z.string().min(1),
  stripeSubscriptionId: z.string().min(1),
  stripePriceId: z.string().min(1),
  status: subscriptionStatusSchema.exclude(["none"]),
  entitlement: z.enum(["active", "inactive"]),
  cancelAtPeriodEnd: z.boolean(),
  lastStripeEventId: z.string().min(1),
  updatedAt: firestoreTimestampValueSchema,
});

export const documentPersistenceSchema = z.object({
  ownerId: z.string().min(1),
  title: z.string().trim().min(1).max(120),
  content: richTextDocumentSchema,
  version: z.int().positive(),
  createdAt: firestoreTimestampValueSchema,
  updatedAt: firestoreTimestampValueSchema,
});

export const stripeWebhookEventPersistenceSchema = z.object({
  type: z.string().min(1),
  objectId: z.string().nullable(),
  processedAt: firestoreTimestampValueSchema,
});

export type FirestoreTimestampValue = z.infer<typeof firestoreTimestampValueSchema>;
export type UserPersistence = z.infer<typeof userPersistenceSchema>;
export type SubscriptionPersistence = z.infer<typeof subscriptionPersistenceSchema>;
export type DocumentPersistence = z.infer<typeof documentPersistenceSchema>;
export type StripeWebhookEventPersistence = z.infer<typeof stripeWebhookEventPersistenceSchema>;
