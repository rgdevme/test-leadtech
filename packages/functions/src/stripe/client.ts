import Stripe from "stripe"

import { getEnvironment } from "../config/environment.js"

const STRIPE_API_VERSION = "2026-07-29.dahlia"

let stripeClient: Stripe | undefined

export const initializeStripeClient = () => {
	const { stripeSubscriptionReadKey } = getEnvironment()
	stripeClient = new Stripe(stripeSubscriptionReadKey, {
		apiVersion: STRIPE_API_VERSION,
		emitEventBodies: false,
		maxNetworkRetries: 1,
		telemetry: false,
		timeout: 10_000,
		typescript: true
	})

	return stripeClient
}

export const getStripeClient = () => {
	if (!stripeClient) {
		throw new Error("Stripe has not been initialized.")
	}

	return stripeClient
}
