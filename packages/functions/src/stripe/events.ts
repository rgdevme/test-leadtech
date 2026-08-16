import { supportedStripeWebhookEvents } from "@leadtech/common/contracts"
import type Stripe from "stripe"

export type SupportedStripeEvent =
	| Stripe.CheckoutSessionCompletedEvent
	| Stripe.CustomerSubscriptionCreatedEvent
	| Stripe.CustomerSubscriptionUpdatedEvent
	| Stripe.CustomerSubscriptionDeletedEvent
	| Stripe.InvoicePaidEvent
	| Stripe.InvoicePaymentFailedEvent

export const isSupportedStripeEvent = (event: Stripe.Event): event is SupportedStripeEvent =>
	supportedStripeWebhookEvents.some(eventType => eventType === event.type)

export const getStripeEventObjectId = (event: SupportedStripeEvent) => event.data.object.id

export const getCheckoutSubscriptionId = (session: Stripe.Checkout.Session) => {
	if (typeof session.subscription === "string") {
		return session.subscription
	}

	return session.subscription?.id ?? null
}

export const getInvoiceSubscriptionId = (invoice: Stripe.Invoice) => {
	const subscription = invoice.parent?.subscription_details?.subscription

	if (typeof subscription === "string") {
		return subscription
	}

	return subscription?.id ?? null
}
