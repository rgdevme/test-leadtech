import Stripe from "stripe"

export const getStripeCheckoutSessionId = (checkoutUrl: string) => {
	const sessionId = new URL(checkoutUrl).pathname
		.split("/")
		.find(segment => /^cs_(?:test|live)_[A-Za-z0-9]+$/.test(segment))

	if (!sessionId) {
		throw new Error("Stripe Checkout URL does not contain a session identifier.")
	}

	return sessionId
}

export const cleanupStripeResources = async (
	stripe: Stripe,
	customerId: string | undefined,
	sessionIds: Iterable<string>
) => {
	for (const sessionId of new Set(sessionIds)) {
		const session = await stripe.checkout.sessions.retrieve(sessionId)
		if (session.status === "open") {
			await stripe.checkout.sessions.expire(sessionId)
		}
	}

	if (customerId) {
		await stripe.customers.del(customerId)
	}
}
