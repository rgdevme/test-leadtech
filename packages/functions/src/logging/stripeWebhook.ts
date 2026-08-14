import { logger } from "firebase-functions";

import type { ProcessStripeWebhookResult } from "../services/processStripeWebhook.js";

export const logInvalidStripeWebhookSignature = () => {
  logger.warn("Stripe webhook rejected.", {
    outcome: "invalid_signature",
  });
};

export const logUnsupportedStripeWebhook = (eventId: string, eventType: string) => {
  logger.info("Stripe webhook ignored.", {
    eventId,
    eventType,
    outcome: "unsupported",
  });
};

export const logStripeWebhookResult = (result: ProcessStripeWebhookResult) => {
  const context = {
    eventId: result.eventId,
    eventType: result.eventType,
    objectId: result.objectId,
    outcome: result.outcome,
    ...("errorCode" in result ? { errorCode: result.errorCode } : {}),
    ...("firebaseUid" in result ? { firebaseUid: result.firebaseUid } : {}),
    ...("stripeSubscriptionId" in result && result.stripeSubscriptionId
      ? { stripeSubscriptionId: result.stripeSubscriptionId }
      : {}),
  };

  if (!result.ok) {
    logger.error("Stripe webhook processing failed.", context);
    return;
  }

  if (result.outcome === "rejected") {
    logger.warn("Stripe webhook correlation rejected.", context);
    return;
  }

  logger.info("Stripe webhook handled.", context);
};
