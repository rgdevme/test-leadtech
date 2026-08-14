import { z } from "zod";

export const subscriptionStatuses = [
  "none",
  "incomplete",
  "incomplete_expired",
  "trialing",
  "active",
  "past_due",
  "canceled",
  "unpaid",
  "paused",
] as const;

export const subscriptionPlanIds = {
  write: "price_1U4HeLBU3frfYophbxGKIo6Y",
  studio: "price_1U4HfYBU3frfYoph2Spnjjut",
  studioYearly: "price_1U4HfxBU3frfYoph1dU2Bb0H",
} as const;

export type SubscriptionPlanKeys = keyof typeof subscriptionPlanIds;
const subscriptionPlanKeys = Object.keys(subscriptionPlanIds) as SubscriptionPlanKeys[];

export const subscriptionStatusSchema = z.enum(subscriptionStatuses);

export const subscriptionPlanKeySchema = z.literal(subscriptionPlanKeys);

export const subscriptionPlanSchema = z.object({
  key: subscriptionPlanKeySchema,
  name: z.string().min(1),
  description: z.string().min(1),
  unitAmount: z.int().nonnegative(),
  currency: z.string().length(3),
  interval: z.enum(["month", "year"]),
  features: z.array(z.string().min(1)).min(1),
  featured: z.boolean(),
});

export const publicSubscriptionPlans = [
  {
    key: "write",
    name: "Writing",
    description: "A focused workspace for a steady writing practice.",
    unitAmount: 1200,
    currency: "usd",
    interval: "month",
    features: ["Unlimited documents", "Rich-text editing", "Automatic version-safe saving"],
    featured: false,
  },
  {
    key: "studio",
    name: "Studio",
    description: "More room for long-form projects and an active archive.",
    unitAmount: 2200,
    currency: "usd",
    interval: "month",
    features: [
      "Everything in Writing",
      "Priority workspace access",
      "Cancel without losing read access",
    ],
    featured: true,
  },
  {
    key: "studioYearly",
    name: "Studio annual",
    description: "A full year of focused writing at a quieter monthly cost.",
    unitAmount: 22000,
    currency: "usd",
    interval: "year",
    features: ["Everything in Studio", "Two months included", "One annual renewal"],
    featured: false,
  },
] as const satisfies readonly SubscriptionPlan[];

export const publicSubscriptionPlanKeys = publicSubscriptionPlans.map(({ key }) => key);

export const listSubscriptionPlansResponseSchema = z.object({
  items: z.array(subscriptionPlanSchema),
});

export const createCheckoutRequestSchema = z.object({
  intent: z.literal("subscribe"),
  planKey: subscriptionPlanKeySchema,
});

export const createCheckoutResponseSchema = z.object({
  checkoutUrl: z.url(),
});

export const subscriptionResponseSchema = z.object({
  status: subscriptionStatusSchema,
  entitled: z.boolean(),
  updatedAt: z.iso.datetime().nullable(),
});

export type SubscriptionStatus = z.infer<typeof subscriptionStatusSchema>;
export type SubscriptionIntent = "subscribe";
export type SubscriptionPlanKey = z.infer<typeof subscriptionPlanKeySchema>;
export type SubscriptionPlan = z.infer<typeof subscriptionPlanSchema>;
export type ListSubscriptionPlansResponse = z.infer<typeof listSubscriptionPlansResponseSchema>;
export type CreateCheckoutRequest = z.infer<typeof createCheckoutRequestSchema>;
export type CreateCheckoutResponse = z.infer<typeof createCheckoutResponseSchema>;
export type SubscriptionResponse = z.infer<typeof subscriptionResponseSchema>;
