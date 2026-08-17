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
export const subscriptionPlanKeySchema = z.string().regex(/^[a-f0-9]{64}$/)

export const subscriptionPlanSchema = z.object({
	key: subscriptionPlanKeySchema,
	name: z.string().min(1),
	description: z.string(),
	unitAmount: z.int().nonnegative(),
	currency: z.string().length(3),
	interval: z.enum(["day", "week", "month", "year"]),
	intervalCount: z.int().positive(),
	features: z.array(z.string().min(1)),
	featured: z.boolean()
})

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
