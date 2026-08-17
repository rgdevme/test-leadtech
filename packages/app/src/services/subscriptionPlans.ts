import "server-only"

import { createHash } from "node:crypto"

import {
	stripeProductIdSchema,
	subscriptionPlanSchema,
	type SubscriptionPlan,
	type SubscriptionPlanKey
} from "@leadtech/common/contracts"
import type Stripe from "stripe"
import { z } from "zod"

import { getStripe } from "@/stripe/server"

type StripeSubscriptionPlan = {
	priceId: string
	productId: string
	publicPlan: SubscriptionPlan
}

type FixedRecurringPrice = Stripe.Price & {
	recurring: NonNullable<Stripe.Price["recurring"]>
	unit_amount: number
}

type StripeProductPrices = {
	prices: FixedRecurringPrice[]
	product: Stripe.Product
}

const stripeProductIdsSchema = z.array(stripeProductIdSchema).min(1)

const getConfiguredProductIds = () => {
	const configuredIds = process.env.STRIPE_PLANS_IDS

	if (!configuredIds) {
		throw new Error("STRIPE_PLANS_IDS must be configured.")
	}

	const parsedIds = stripeProductIdsSchema.safeParse(
		configuredIds
			.split(",")
			.map(productId => productId.trim())
			.filter(Boolean)
	)

	if (!parsedIds.success) {
		throw new Error("STRIPE_PLANS_IDS must contain comma-separated Stripe Product IDs.")
	}

	if (new Set(parsedIds.data).size !== parsedIds.data.length) {
		throw new Error("STRIPE_PLANS_IDS must not contain duplicate Stripe Product IDs.")
	}

	return parsedIds.data
}

const createPlanKey = (stripeId: string): SubscriptionPlanKey =>
	subscriptionPlanSchema.shape.key.parse(createHash("sha256").update(stripeId).digest("hex"))

const normalizeRecurringPrice = (price: Stripe.Price): FixedRecurringPrice => {
	if (!price.active || price.type !== "recurring" || !price.recurring) {
		throw new Error("A configured Stripe Product Price must be active and recurring.")
	}

	if (price.unit_amount === null) {
		throw new Error("A configured Stripe Product Price must have a fixed unit amount.")
	}

	return price as FixedRecurringPrice
}

const getDefaultPriceId = (product: Stripe.Product) =>
	typeof product.default_price === "string" ? product.default_price : product.default_price?.id

const normalizeProductPrice = (
	product: Stripe.Product,
	price: FixedRecurringPrice
): StripeSubscriptionPlan => {
	if (!product.active) {
		throw new Error("A configured Stripe Product must be active.")
	}

	const publicPlan = subscriptionPlanSchema.parse({
		key: createPlanKey(price.id),
		name: product.name,
		description: product.description ?? "",
		unitAmount: price.unit_amount,
		currency: price.currency,
		interval: price.recurring.interval,
		intervalCount: price.recurring.interval_count,
		features: product.marketing_features.map(feature => feature.name),
		featured: product.metadata.featured === "true" && price.id === getDefaultPriceId(product)
	})

	return {
		priceId: price.id,
		productId: product.id,
		publicPlan
	}
}

const retrieveProductPrices = async (productId: string): Promise<StripeProductPrices> => {
	const stripe = getStripe()
	const [product, pricePage] = await Promise.all([
		stripe.products.retrieve(productId),
		stripe.prices.list({ active: true, limit: 100, product: productId, type: "recurring" })
	])

	if (pricePage.has_more) {
		throw new Error("A configured Stripe Product cannot have more than 100 active Prices.")
	}

	if (pricePage.data.length === 0) {
		throw new Error("A configured Stripe Product must have an active recurring Price.")
	}

	const defaultPriceId = getDefaultPriceId(product)
	const prices = pricePage.data
		.map(normalizeRecurringPrice)
		.sort((left, right) => Number(right.id === defaultPriceId) - Number(left.id === defaultPriceId))

	return { prices, product }
}

const listStripeSubscriptionPlans = async () => {
	const productPrices = await Promise.all(getConfiguredProductIds().map(retrieveProductPrices))
	return productPrices.flatMap(({ prices, product }) =>
		prices.map(price => normalizeProductPrice(product, price))
	)
}

export const listSubscriptionPlans = async () =>
	(await listStripeSubscriptionPlans()).map(({ publicPlan }) => publicPlan)

export const getSubscriptionCheckoutPlan = async (
	planKey: SubscriptionPlanKey
): Promise<Pick<StripeSubscriptionPlan, "priceId" | "productId"> | null> => {
	const plan = (await listStripeSubscriptionPlans()).find(
		({ publicPlan }) => publicPlan.key === planKey
	)

	if (!plan) {
		return null
	}

	return { priceId: plan.priceId, productId: plan.productId }
}
