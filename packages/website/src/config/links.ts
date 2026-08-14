import { publicSubscriptionPlanKeys } from "@leadtech/contracts";

import { environment } from "@/config/environment";

export const createSignInUrl = () => new URL("/sign-in", environment.appUrl).toString();

export const createSubscribeUrl = (planKey?: string) => {
  const url = new URL("/sign-up", environment.appUrl);
  url.searchParams.set("intent", "subscribe");

  if (planKey) {
    if (
      !publicSubscriptionPlanKeys.includes(planKey as (typeof publicSubscriptionPlanKeys)[number])
    ) {
      throw new Error(`Unknown public subscription plan key: ${planKey}`);
    }

    url.searchParams.set("plan", planKey);
  }

  return url.toString();
};
