import { z } from "zod"

export const subscriptionStatuses = [
	"none",
	"incomplete",
	"incomplete_expired",
	"trialing",
	"active",
	"past_due",
	"canceled",
	"unpaid",
	"paused"
] as const

export const subscriptionPlanIds = {
	write: "price_1U4HeLBU3frfYophbxGKIo6Y",
	studio: "price_1U4HfYBU3frfYoph2Spnjjut",
	studioYearly: "price_1U4HfxBU3frfYoph1dU2Bb0H"
} as const

export type SubscriptionPlanKeys = keyof typeof subscriptionPlanIds
export const subscriptionPlanKeys = Object.keys(subscriptionPlanIds) as SubscriptionPlanKeys[]

export const projectedSubscriptionStatuses = [
	"incomplete",
	"incomplete_expired",
	"trialing",
	"active",
	"past_due",
	"canceled",
	"unpaid",
	"paused"
] as const

export const entitledStripeStatuses = ["active", "trialing"] as const

export const subscriptionStatusSchema = z.enum(subscriptionStatuses)
export const projectedSubscriptionStatusSchema = z.enum(projectedSubscriptionStatuses)
export const subscriptionPlanKeySchema = z.literal(subscriptionPlanKeys)

export const subscriptionPlanSchema = z.object({
	key: subscriptionPlanKeySchema,
	name: z.string().min(1),
	description: z.string().min(1),
	unitAmount: z.int().nonnegative(),
	currency: z.string().length(3),
	interval: z.enum(["month", "year"]),
	features: z.array(z.string().min(1)).min(1),
	featured: z.boolean()
})

export const publicSubscriptionPlanKeys = subscriptionPlanKeys

export const listSubscriptionPlansResponseSchema = z.object({
	items: z.array(subscriptionPlanSchema)
})

export const createCheckoutRequestSchema = z.object({
	intent: z.literal("subscribe"),
	planKey: subscriptionPlanKeySchema
})

export const createCheckoutResponseSchema = z.object({
	checkoutUrl: z.url()
})

export const subscriptionResponseSchema = z.object({
	status: subscriptionStatusSchema,
	entitled: z.boolean(),
	updatedAt: z.iso.datetime().nullable()
})

export type SubscriptionStatus = z.infer<typeof subscriptionStatusSchema>
export type ProjectedSubscriptionStatus = z.infer<typeof projectedSubscriptionStatusSchema>
export type SubscriptionIntent = "subscribe"
export type SubscriptionPlanKey = z.infer<typeof subscriptionPlanKeySchema>
export type SubscriptionPlan = z.infer<typeof subscriptionPlanSchema>
export type ListSubscriptionPlansResponse = z.infer<typeof listSubscriptionPlansResponseSchema>
export type CreateCheckoutRequest = z.infer<typeof createCheckoutRequestSchema>
export type CreateCheckoutResponse = z.infer<typeof createCheckoutResponseSchema>
export type SubscriptionResponse = z.infer<typeof subscriptionResponseSchema>
