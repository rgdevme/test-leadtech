---
type: Project Roadmap
title: Firebase Functions roadmap
description: Delivery plan for verified Stripe webhook processing and Firestore entitlement projection in @leadtech/functions.
resource: ""
tags:
  - roadmap
  - firebase-functions
  - stripe
  - webhooks
timestamp: 2026-08-13T13:30:38Z
---

# Outcome

Deliver one small, idempotent Firebase HTTP Function that verifies Stripe webhook signatures and writes the server-authoritative subscription projection consumed by the app.

Canonical event and persistence schemas: [Integration contracts and parallel delivery plan](integration-contracts.md).

# Current state

- Firebase Functions 7, Firebase Admin 14, Stripe 22, and TypeScript are installed.
- Firebase config targets the Node.js 22 Functions runtime and local port 5001.
- The package compiles ESM-compatible NodeNext output but lacks `"type": "module"` in `package.json`.
- `src/index.ts` exports nothing.
- The environment example has a shared Stripe key name and webhook secret placeholder.
- Firestore rules are default-deny and no subscription/event collections exist.

# Boundaries

## Owns

- Public `stripeWebhook` HTTPS Function.
- Raw-body Stripe signature verification.
- Event filtering, duplicate detection, and current-subscription reconciliation.
- Atomic writes to `subscriptions/{uid}` and `stripeWebhookEvents/{eventId}`.
- Safe webhook logs and retry behavior.

## Does not own

- Checkout Session creation.
- Browser redirects or UI.
- Firebase session cookies.
- Document CRUD.
- Client entitlement decisions.

# Technology decisions

| Technology                        | Use                                               | Constraint                                                      |
| --------------------------------- | ------------------------------------------------- | --------------------------------------------------------------- |
| Firebase Functions v2 `onRequest` | Public Stripe webhook                             | Region is explicit and matches Firestore.                       |
| Node.js 22                        | Managed Functions runtime                         | Documented exception to the repo's Node 24 local-tooling rule.  |
| TypeScript ESM with NodeNext      | Function implementation                           | Add `"type": "module"`; use `.js` import extensions.            |
| Stripe Node SDK                   | Signature verification and Subscription retrieval | Instantiate one Stripe client with an explicit API version.     |
| Firebase Admin SDK                | Firestore transaction                             | No client rules or browser credentials.                         |
| Zod 4 and `@leadtech/contracts`   | Projection and configuration validation           | Do not parse the webhook payload before signature verification. |
| Google Secret Manager             | Deployed Stripe key and signing secret            | Use package `.env` only for local emulator values.              |

# Public endpoint contract

| Method | Local URL                                                       | Required header    | Response                                          |
| ------ | --------------------------------------------------------------- | ------------------ | ------------------------------------------------- |
| POST   | `http://127.0.0.1:5001/demo-leadtech/us-central1/stripeWebhook` | `Stripe-Signature` | `200 { "received": true }` after durable handling |

Response rules:

| Condition                              | Status                         | Body                    |
| -------------------------------------- | ------------------------------ | ----------------------- |
| Missing or invalid signature           | 400                            | `{ "received": false }` |
| Verified unsupported event             | 200                            | `{ "received": true }`  |
| Already processed event ID             | 200                            | `{ "received": true }`  |
| Successfully projected event           | 200                            | `{ "received": true }`  |
| Transient Stripe/Firestore failure     | 500                            | `{ "received": false }` |
| Permanent invalid correlation metadata | 200 after safe error recording | `{ "received": true }`  |

The endpoint does not use the app's common API error envelope because Stripe is its only caller and requires a fast acknowledgement contract.

# Event contract

Subscribe only to:

- `checkout.session.completed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.paid`
- `invoice.payment_failed`

## Required Stripe metadata

The app's Checkout creation must set:

```ts
export type StripeCorrelationMetadata = {
  firebaseUid: string;
};
```

Correlation order:

1. For Checkout events, read the Firebase UID from trusted Session or Subscription metadata created by the app.
2. For Subscription events, read `subscription.metadata.firebaseUid`.
3. For Invoice events, retrieve the referenced Subscription, then read its metadata.
4. Validate the UID against the Firebase UID format contract before constructing a Firestore path.
5. Never use email as an identifier and never accept client-supplied Firestore paths.

# Projection algorithm

```text
Receive raw request
  -> require Stripe-Signature
  -> verify signature against raw body
  -> filter supported event type
  -> check stripeWebhookEvents/{event.id}
  -> resolve Subscription ID and Firebase UID
  -> retrieve current Subscription when required
  -> verify an allowlisted Price ID is present
  -> normalize Stripe status and entitlement
  -> Firestore transaction:
       create event ledger entry if absent
       upsert subscriptions/{uid}
  -> acknowledge 200
```

## Entitlement policy

```ts
export const entitledStripeStatuses = ["active", "trialing"] as const;
```

- [ ] Require both an entitled status and membership in `STRIPE_ENTITLED_PRICE_IDS`.
- [ ] Treat `incomplete`, `incomplete_expired`, `past_due`, `canceled`, `unpaid`, and `paused` as inactive.
- [ ] On `customer.subscription.deleted`, project `canceled` and inactive even if retrieval is unavailable.
- [ ] Store Stripe IDs and normalized status, not the entire provider object.
- [ ] Use server timestamp for `updatedAt`.

## Duplicate and ordering control

- [ ] Check `stripeWebhookEvents/{event.id}` before an external retrieval when possible.
- [ ] Recheck the event document inside the final Firestore transaction.
- [ ] Retrieve the current Subscription for events that may arrive out of order.
- [ ] Let the current Stripe object win instead of trusting event arrival order.
- [ ] Treat a duplicate event as success without rewriting projection timestamps.
- [ ] Keep network calls outside Firestore transaction callbacks because callbacks may retry.

# Secret contract

| Variable/secret                 | Scope              | Permission                                                                         |
| ------------------------------- | ------------------ | ---------------------------------------------------------------------------------- |
| `STRIPE_WEBHOOK_SECRET`         | Function secret    | Verify the configured webhook endpoint only                                        |
| `STRIPE_WEBHOOK_RESTRICTED_KEY` | Function secret    | Read Subscription and related Checkout/Invoice objects required for reconciliation |
| `STRIPE_ENTITLED_PRICE_IDS`     | Function parameter | Non-secret allowlist of subscription Prices                                        |

- [ ] Replace the ambiguous `STRIPE_RESTRICTED_KEY` name in the package example.
- [ ] Bind deployed secrets with Firebase `defineSecret` or equivalent Google Secret Manager integration.
- [ ] Use a separate restricted key from the app Checkout service.
- [ ] Do not print secret values, raw bodies, customer emails, or full Stripe objects.
- [ ] Log event ID, event type, outcome, and safe correlation IDs only.
- [ ] Use distinct sandbox and production secrets.

# File architecture

```text
src/
  config/
    environment.ts
  firebase/
    admin.ts
  stripe/
    client.ts
    events.ts
  repositories/
    stripeWebhookEvents.ts
    subscriptions.ts
  services/
    projectSubscription.ts
    processStripeWebhook.ts
  http/
    stripeWebhook.ts
  index.ts
```

- Keep `index.ts` as a named export surface only.
- Keep signature verification at the HTTP boundary.
- Keep event branching in `processStripeWebhook`.
- Keep normalization and entitlement policy in `projectSubscription`.
- Keep Firestore paths and codecs in repositories.
- Return `{ ok: boolean }` from orchestration to the HTTP boundary and map failures there.

# Firestore writes

Use the persistence contracts in [Firestore persistence contracts](integration-contracts.md#firestore-persistence-contracts).

Transaction requirements:

- [ ] Read the event ledger entry before writes.
- [ ] Exit successfully when it already exists.
- [ ] Create the ledger record and set the subscription projection in one transaction.
- [ ] Use `merge: false` for the normalized projection so removed fields do not linger.
- [ ] Never write user-editable authorization fields.
- [ ] Confirm the Firestore region matches the Function region before deployment.

# Error and retry policy

| Failure                           | Classification               | Behavior                                                                  |
| --------------------------------- | ---------------------------- | ------------------------------------------------------------------------- |
| Bad signature                     | Permanent caller error       | 400; no Firestore write                                                   |
| Unsupported event                 | Expected                     | 200; no projection                                                        |
| Missing correlation metadata      | Permanent integration defect | Safe structured error, record if possible, 200 to prevent endless retries |
| Stripe 429/5xx or network timeout | Transient                    | 500 so Stripe retries                                                     |
| Firestore contention/unavailable  | Transient                    | 500 so Stripe retries                                                     |
| Duplicate event                   | Expected                     | 200 without mutation                                                      |
| Invalid projected schema          | Integration defect           | Safe error, 500 while actionable                                          |

> [!IMPORTANT]
> Do not catch and acknowledge transient failures. Stripe retry delivery is part of the reliability design.

# Delivery phases

## Phase 1: Runtime foundation

- [ ] Add `@leadtech/contracts` and Zod with pnpm.
- [ ] Set `"type": "module"` and preserve NodeNext `.js` imports.
- [ ] Add environment parsing and secret bindings.
- [ ] Initialize Firebase Admin and Stripe clients once per warm instance.
- [ ] Add safe structured logger helpers using existing logging levels.

Exit criteria:

- The package builds as ESM for the Node.js 22 Functions runtime.
- Missing configuration fails at startup without exposing values.

## Phase 2: Signature boundary

- [ ] Implement v2 `onRequest` with explicit region and secret bindings.
- [ ] Read the unmodified raw request body.
- [ ] Verify `Stripe-Signature` before accessing event data.
- [ ] Filter the configured event allowlist.
- [ ] Implement the response table above.

Exit criteria:

- Invalid signatures cannot reach service or repository code.
- Valid unsupported events acknowledge safely.

## Phase 3: Projection and idempotency

- [ ] Implement UID/Subscription correlation for each event family.
- [ ] Retrieve current Subscription state where ordering can be stale.
- [ ] Normalize status and Price ID entitlement.
- [ ] Implement the duplicate-event ledger and atomic projection transaction.
- [ ] Add safe logging for processed, duplicate, ignored, and retryable outcomes.

Exit criteria:

- Replaying one event does not change state twice.
- Delivering valid events out of order converges on the current Stripe Subscription.

## Phase 4: Emulator integration

- [ ] Start Firebase Auth, Firestore, and Functions emulators.
- [ ] Run Stripe CLI forwarding to the local function URL.
- [ ] Complete Checkout through the app.
- [ ] Observe `subscriptions/{uid}` and `stripeWebhookEvents/{eventId}` writes.
- [ ] Confirm the app remains pending before the webhook and unlocks after it.
- [ ] Replay an event and confirm no second mutation.

Exit criteria:

- The PDF's server-side webhook acceptance criterion passes locally.
- The app consumes the projection without calling Stripe.

## Phase 5: Handoff

- [ ] Run existing format, lint, typecheck, build, and relevant approved tests.
- [ ] Document the exact Stripe CLI forwarding command and URL in README.
- [ ] Document sandbox event types and safe troubleshooting steps.
- [ ] Confirm `.env.example` contains every required name and no value.

# Parallel work agreement

The Functions workstream can start after the contracts and Stripe metadata keys are frozen.

Safe fixtures:

- Use Stripe CLI sandbox fixtures to develop without the app UI.
- Use a known emulator UID and a sandbox Price ID from the configured allowlist.
- Write only documents that conform to the canonical persistence schema.

Integration blockers:

- Real Checkout correlation requires the app to set `firebaseUid` metadata.
- Final entitlement validation requires every selectable app plan Price ID to appear in the Functions allowlist.

# Risks and controls

| Risk                                        | Control                                                          |
| ------------------------------------------- | ---------------------------------------------------------------- |
| Forged webhook                              | Verify signature over exact raw body.                            |
| Duplicate delivery                          | Durable event-ID ledger plus transactional recheck.              |
| Out-of-order events                         | Retrieve current Subscription before projection.                 |
| Unknown plan grants access                  | Require allowlisted Price ID membership in addition to status.   |
| Secret compromise                           | Separate restricted keys in Secret Manager with least privilege. |
| Endless retry for permanent metadata defect | Classify, record safely, and acknowledge after verification.     |
| Silent lost event                           | Return 500 for transient provider/database failures.             |

# Proposed verification requiring approval

Do not create new tests until approved.

- Unit: event-to-subscription correlation, status/Price entitlement mapping, and error classification.
- Integration against real Stripe sandbox plus Firebase emulator: signature verification, duplicate replay, event ordering, and Firestore projection.
- No third-party mocks; skip sandbox integration when credentials are unavailable.

Suggested story:

`As a subscriber, my editor access reflects the latest signature-verified Stripe subscription state.`

# Definition of done

- [ ] Signature verification precedes all event parsing and persistence.
- [ ] Supported events project current state idempotently.
- [ ] Only allowlisted Prices and entitled statuses grant access.
- [ ] Duplicate, delayed, out-of-order, invalid, and transient paths follow the response policy.
- [ ] Secrets remain out of source, logs, and committed environment files.
- [ ] Existing checks pass.
- [ ] The [integration gate](integration-contracts.md#gate-2-integration) passes.

# Citations

1. [Stripe webhooks](https://docs.stripe.com/webhooks)
2. [Stripe webhook signature verification](https://docs.stripe.com/webhooks/signature)
3. [Stripe subscription Checkout](https://docs.stripe.com/payments/checkout/build-subscriptions)
4. [Cloud Functions HTTP events](https://firebase.google.com/docs/functions/http-events)
5. [Cloud Functions Node.js runtimes and ESM](https://firebase.google.com/docs/functions/manage-functions)
6. [Cloud Firestore transactions](https://firebase.google.com/docs/firestore/manage-data/transactions)
7. [Stripe restricted API keys](https://docs.stripe.com/keys/restricted-api-keys)
