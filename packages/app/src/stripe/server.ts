import "server-only";

import Stripe from "stripe";

let stripeClient: Stripe | undefined;

export const getStripe = () => {
  if (stripeClient) {
    return stripeClient;
  }

  const restrictedKey = process.env.STRIPE_APP_RESTRICTED_KEY;
  if (!restrictedKey) {
    throw new Error("STRIPE_APP_RESTRICTED_KEY must be configured.");
  }

  stripeClient = new Stripe(restrictedKey, {
    apiVersion: "2026-07-29.dahlia",
    typescript: true,
  });

  return stripeClient;
};
