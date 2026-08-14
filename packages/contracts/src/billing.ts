import { planLocale } from "./data/locale/en.js";

export type SubscriptionPlanKey = string;

export type SubscriptionPlan = {
  key: SubscriptionPlanKey;
  name: string;
  description: string;
  unitAmount: number;
  currency: string;
  interval: "month" | "year";
  features: readonly string[];
  featured: boolean;
};

export const publicSubscriptionPlans = [
  {
    key: "writer-monthly",
    name: planLocale.writerMonthly.name,
    description: planLocale.writerMonthly.description,
    unitAmount: 900,
    currency: "USD",
    interval: "month",
    features: planLocale.writerMonthly.features,
    featured: true,
  },
] as const satisfies readonly SubscriptionPlan[];

export const publicSubscriptionPlanKeys = publicSubscriptionPlans.map(({ key }) => key);
