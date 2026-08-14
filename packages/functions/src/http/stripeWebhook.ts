import { onInit } from "firebase-functions/v2/core";
import { onRequest } from "firebase-functions/v2/https";

import { getEnvironment, initializeEnvironment } from "../config/environment.js";
import { initializeFirebaseAdmin } from "../firebase/admin.js";
import {
  logInvalidStripeWebhookSignature,
  logStripeWebhookResult,
  logUnsupportedStripeWebhook,
} from "../logging/stripeWebhook.js";
import { processStripeWebhook } from "../services/processStripeWebhook.js";
import { getStripeClient, initializeStripeClient } from "../stripe/client.js";
import { isSupportedStripeEvent } from "../stripe/events.js";

const acknowledgeWebhook = { received: true } as const;
const rejectWebhook = { received: false } as const;

onInit(() => {
  initializeEnvironment();
  initializeFirebaseAdmin();
  initializeStripeClient();
});

export const stripeWebhook = onRequest(
  {
    cors: false,
    invoker: "public",
    region: "us-central1",
    timeoutSeconds: 60,
  },
  async (request, response) => {
    if (request.method !== "POST") {
      response.status(400).json(rejectWebhook);
      return;
    }

    const signature = request.header("stripe-signature");

    if (!signature) {
      logInvalidStripeWebhookSignature();
      response.status(400).json(rejectWebhook);
      return;
    }

    let event;

    try {
      event = getStripeClient().webhooks.constructEvent(
        request.rawBody,
        signature,
        getEnvironment().stripeWebhookSigningSecret,
      );
    } catch {
      logInvalidStripeWebhookSignature();
      response.status(400).json(rejectWebhook);
      return;
    }

    if (!isSupportedStripeEvent(event)) {
      logUnsupportedStripeWebhook(event.id, event.type);
      response.status(200).json(acknowledgeWebhook);
      return;
    }

    const result = await processStripeWebhook(event);
    logStripeWebhookResult(result);

    if (!result.ok) {
      response.status(500).json(rejectWebhook);
      return;
    }

    response.status(200).json(acknowledgeWebhook);
  },
);
