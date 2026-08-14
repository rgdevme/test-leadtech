import type Stripe from "stripe";

export const supportedStripeEventTypes = [
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
  "invoice.paid",
  "invoice.payment_failed",
] as const;

export type SupportedStripeEvent =
  | Stripe.CheckoutSessionCompletedEvent
  | Stripe.CustomerSubscriptionCreatedEvent
  | Stripe.CustomerSubscriptionUpdatedEvent
  | Stripe.CustomerSubscriptionDeletedEvent
  | Stripe.InvoicePaidEvent
  | Stripe.InvoicePaymentFailedEvent;

export const isSupportedStripeEvent = (event: Stripe.Event): event is SupportedStripeEvent =>
  supportedStripeEventTypes.some((eventType) => eventType === event.type);

export const getStripeEventObjectId = (event: SupportedStripeEvent) => event.data.object.id;

export const getCheckoutSubscriptionId = (session: Stripe.Checkout.Session) => {
  if (typeof session.subscription === "string") {
    return session.subscription;
  }

  return session.subscription?.id ?? null;
};

export const getInvoiceSubscriptionId = (invoice: Stripe.Invoice) => {
  const subscription = invoice.parent?.subscription_details?.subscription;

  if (typeof subscription === "string") {
    return subscription;
  }

  return subscription?.id ?? null;
};
