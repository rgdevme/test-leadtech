/**
 * Placeholder for the server-only subscription guard.
 * Implementation must read subscription state written by verified Stripe
 * webhooks rather than trusting client state or a checkout redirect.
 */
export type SubscriptionGuard = never;
