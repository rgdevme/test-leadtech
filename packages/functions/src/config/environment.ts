import { defineString } from "firebase-functions/params";
import { z } from "zod";

export const stripeSubscriptionReadKey = defineString("STRIPE_SUBSCRIPTION_READ_KEY");
export const stripeWebhookSigningSecret = defineString("STRIPE_WEBHOOK_SIGNING_SECRET");

type Environment = {
  stripeSubscriptionReadKey: string;
  stripeWebhookSigningSecret: string;
};

const secretSchema = z.string().min(1);

let environment: Environment | undefined;

export const initializeEnvironment = () => {
  const subscriptionReadKey = secretSchema.safeParse(stripeSubscriptionReadKey.value());
  const webhookSigningSecret = secretSchema.safeParse(stripeWebhookSigningSecret.value());

  if (!subscriptionReadKey.success) {
    throw new Error("STRIPE_SUBSCRIPTION_READ_KEY must be configured.");
  }

  if (!webhookSigningSecret.success) {
    throw new Error("STRIPE_WEBHOOK_SIGNING_SECRET must be configured.");
  }

  environment = {
    stripeSubscriptionReadKey: subscriptionReadKey.data,
    stripeWebhookSigningSecret: webhookSigningSecret.data,
  };

  return environment;
};

export const getEnvironment = () => {
  if (!environment) {
    throw new Error("The Functions environment has not been initialized.");
  }

  return environment;
};
