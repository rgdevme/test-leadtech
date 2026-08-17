import "server-only"

import { createHash } from "node:crypto"

import {
	stripeMetadataKeys,
	subscriptionPlanIds,
	SubscriptionPlanKeys,
	type CreateCheckoutResponse
} from "@leadtech/common/contracts"

import { ApiError } from "@/errors/apiError"
import { defaultLocale } from "@/i18n/config"
import { routes } from "@/i18n/routes"
import { getSubscription } from "@/repositories/subscriptions"
import { getUserAccount, setStripeCustomerId } from "@/repositories/users"
import { getStripe } from "@/stripe/server"
import { getApplicationUrl } from "@/utils/http"

const integrationIdentifier = (idempotencyKey: string) => {
	const digest = createHash("sha256").update(idempotencyKey).digest()
	const suffix = Array.from(digest.subarray(0, 8), value =>
		String.fromCharCode(97 + (value % 26))
	).join("")
	return `leadtech_app_${suffix}`
}

export const createSubscriptionCheckout = async (
	uid: string,
	email: string | null,
	planKey: SubscriptionPlanKeys,
	idempotencyKey: string
): Promise<CreateCheckoutResponse> => {
	const subscription = await getSubscription(uid)
	if (subscription.entitled) {
		throw new ApiError(409, "conflict", "This account already has an active subscription.")
	}

	const priceId = subscriptionPlanIds[planKey]
	if (!priceId) {
		throw new ApiError(400, "invalid_request", "The selected plan is not available.")
	}

	const stripe = getStripe()

	try {
		const user = await getUserAccount(uid)
		let customerId = user.stripeCustomerId

		if (!customerId) {
			const customer = await stripe.customers.create(
				{
					...(email ? { email } : {}),
					metadata: { [stripeMetadataKeys.firebaseUid]: uid }
				},
				{ idempotencyKey: `${idempotencyKey}:customer` }
			)
			customerId = customer.id
			await setStripeCustomerId(uid, customerId)
		}

		const appUrl = getApplicationUrl()
		const checkout = await stripe.checkout.sessions.create(
			{
				mode: "subscription",
				customer: customerId,
				client_reference_id: uid,
				integration_identifier: integrationIdentifier(idempotencyKey),
				line_items: [{ price: priceId, quantity: 1 }],
				metadata: { [stripeMetadataKeys.firebaseUid]: uid },
				subscription_data: {
					metadata: { [stripeMetadataKeys.firebaseUid]: uid }
				},
				success_url: new URL(routes.pendingSubscription(defaultLocale), appUrl).toString(),
				cancel_url: new URL(
					`${routes.documents(defaultLocale)}?intent=subscribe&plan=${encodeURIComponent(planKey)}`,
					appUrl
				).toString()
			},
			{ idempotencyKey }
		)

		if (!checkout.url) {
			throw new Error("Stripe did not return a Checkout URL.")
		}

		return { checkoutUrl: checkout.url }
	} catch (error) {
		if (error instanceof ApiError) {
			throw error
		}

		throw new ApiError(502, "upstream_error", "Checkout is temporarily unavailable.", {
			cause: error
		})
	}
}
