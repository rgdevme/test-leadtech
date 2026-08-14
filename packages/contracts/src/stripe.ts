import { z } from "zod";

export const stripeMetadataKeys = {
  firebaseUid: "firebaseUid",
} as const;

export const supportedStripeWebhookEvents = [
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
  "invoice.paid",
  "invoice.payment_failed",
] as const;

export const firebaseUidSchema = z
  .string()
  .min(1)
  .max(128)
  .refine((uid) => !uid.includes("/"));

export const stripeCustomerIdSchema = z.string().regex(/^cus_[A-Za-z0-9]+$/);
export const stripeEventIdSchema = z.string().regex(/^evt_[A-Za-z0-9]+$/);
export const stripePriceIdSchema = z.string().regex(/^price_[A-Za-z0-9]+$/);
export const stripeSubscriptionIdSchema = z.string().regex(/^sub_[A-Za-z0-9]+$/);

export const stripeCorrelationMetadataSchema = z.object({
  [stripeMetadataKeys.firebaseUid]: firebaseUidSchema,
});

export type SupportedStripeWebhookEvent = (typeof supportedStripeWebhookEvents)[number];
export type StripeCorrelationMetadata = z.infer<typeof stripeCorrelationMetadataSchema>;
