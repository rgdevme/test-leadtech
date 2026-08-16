import Stripe from "stripe"

import { getEnvironment } from "../config/environment.js"

let stripeClient: Stripe | undefined

export const initializeStripeClient = () => {
	const { stripeAPIKey } = getEnvironment()
	stripeClient = new Stripe(stripeAPIKey, {
		apiVersion: "2026-07-29.dahlia",
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
