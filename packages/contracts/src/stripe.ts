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

export type SupportedStripeWebhookEvent = (typeof supportedStripeWebhookEvents)[number];
