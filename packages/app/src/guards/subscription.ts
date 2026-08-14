import "server-only";

import { ApiError } from "@/errors/apiError";
import { getSubscription } from "@/repositories/subscriptions";

export const requireMutationEntitlement = async (uid: string) => {
  const subscription = await getSubscription(uid);
  if (!subscription.entitled) {
    throw new ApiError(
      403,
      "subscription_required",
      "An active subscription is required to change documents.",
    );
  }

  return subscription;
};
