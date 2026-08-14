# Leadtech monorepo

pnpm workspace for the marketing website, authenticated application, shared runtime contracts, and Firebase Functions backend.

## Packages

- packages/website: Next.js, Tailwind CSS, and GSAP marketing site.
- packages/app: Next.js application prepared for Firebase authentication, Stripe subscriptions, and TipTap editing.
- packages/contracts: provider-independent runtime schemas and shared TypeScript contracts.
- packages/functions: signature-verified Stripe webhook processing and Firestore subscription projection.

## Commands

- `pnpm install`
- `pnpm dev`
- `pnpm dev:functions`
- `pnpm build`
- `pnpm check`

Keep Stripe and Firebase server credentials out of source control. Stripe subscription access is granted only after a signature-verified webhook atomically updates `subscriptions/{uid}` and records `stripeWebhookEvents/{eventId}`. The Checkout success redirect cannot grant access because it is a browser-controlled navigation, not proof of payment or current subscription state.

## Local Stripe webhook flow

1. In Stripe's sandbox, create a restricted API key with `Subscriptions` read access. Copy the `rk_test_...` value. The webhook uses this key to retrieve the current Subscription before projecting entitlement.

2. Start Stripe CLI forwarding and keep it running:

   ```sh
   pnpm --dir packages/functions dev:stripe
   ```

   Stripe requires each full event name. `customer.subscription` by itself is not a valid event. After the CLI reports `Ready!`, copy the `whsec_...` signing secret it prints.

3. Copy `packages/functions/.env.example` to `packages/functions/.env.local`, then set the two local secrets:

   ```env
   STRIPE_SUBSCRIPTION_READ_KEY=rk_test_yourRestrictedKey
   STRIPE_WEBHOOK_SIGNING_SECRET=whsec_REDACTED
   ```

   The Stripe CLI `whsec_...` value belongs only in `STRIPE_WEBHOOK_SIGNING_SECRET`. It is not an API key and cannot replace `STRIPE_SUBSCRIPTION_READ_KEY`.

4. Start the application packages, Firebase emulators, and Stripe forwarding together:

   ```sh
   pnpm dev
   ```

5. Complete a subscription Checkout from the app with Stripe's sandbox card `4242 4242 4242 4242`, any future expiry, and any CVC. The Checkout service must place the Firebase UID in both Session and Subscription `firebaseUid` metadata.

6. In the Emulator UI at `http://127.0.0.1:4000`, confirm that `subscriptions/{uid}` and `stripeWebhookEvents/{eventId}` were written. Re-deliver the event from Stripe Workbench and confirm that the projection timestamp does not change.

Stripe CLI-generated subscription fixtures do not include the application's required Firebase UID metadata by default. Such events are safely recorded as rejected and acknowledged instead of granting entitlement.

## Safe webhook troubleshooting

- A `400` response means the signature header is missing or does not match the exact raw request body. The Stripe CLI signing secret is different from a Dashboard endpoint secret.
- A verified unsupported event returns `200` and performs no write.
- A supported event with missing, invalid, or conflicting Firebase UID metadata is recorded in the event ledger and returns `200` to avoid endless retries.
- Stripe retrieval or Firestore failures return `500` so Stripe retries delivery.
- An active or trialing subscription remains inactive unless its Price ID is configured in `subscriptionPlanIds` and exposed through `publicSubscriptionPlans` in `@leadtech/contracts`.

## Known scope

The Functions package owns only the public Stripe webhook and subscription projection. Checkout Session creation, Firebase session cookies, browser redirects, document APIs, and UI entitlement decisions belong to the application package. This repository is a local test project; production deployment and production secret configuration are intentionally out of scope.
