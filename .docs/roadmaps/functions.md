---
type: Project Roadmap
title: Firebase Functions roadmap
description: Current Stripe webhook responsibilities, processing flow, and remaining validation for DraftRoom Functions.
resource: ""
tags:
  - roadmap
  - firebase-functions
  - stripe
  - webhooks
timestamp: 2026-08-16T10:55:04Z
---

# Outcome

Maintain the server-confirmed subscription projection used by the app to decide whether document changes are allowed.

Shared boundaries and persistence ownership are defined in [Integration contracts and project boundaries](integration-contracts.md).

# Current state

- One Firebase HTTP Function exposes the Stripe webhook.
- The function runs as TypeScript ESM on the Firebase Node.js 22 runtime.
- Stripe signatures are verified against the raw body before event processing.
- Supported events are normalized against the current Stripe Subscription when needed.
- Processed event records and subscription projections are written atomically.
- Duplicate events return success without rewriting the subscription projection.
- Shared contracts come from `@leadtech/common/contracts`.

# Responsibilities

## Owns

- Public Stripe webhook handling.
- Stripe signature verification.
- Supported event filtering.
- Firebase UID correlation from server-created Stripe metadata.
- Current subscription retrieval.
- Allowed-price and status checks.
- Duplicate event protection.
- Subscription projection writes.

## Does not own

- Checkout Session creation.
- Browser redirects or interface state.
- Firebase session cookies.
- Document APIs.
- Client access decisions.

# Processing flow

```text
Receive raw request
  -> verify Stripe signature
  -> filter event type
  -> check duplicate event
  -> resolve Firebase UID and Subscription
  -> read current Stripe state when required
  -> validate status and allowed Price ID
  -> write event record and subscription projection atomically
  -> return success
```

# Response policy

| Condition                             | Response | Write behavior                             |
| ------------------------------------- | -------- | ------------------------------------------ |
| Missing or invalid signature          | `400`    | No write                                   |
| Verified unsupported event            | `200`    | No write                                   |
| Duplicate event                       | `200`    | No second write                            |
| Valid supported event                 | `200`    | Atomic event and projection write          |
| Permanent correlation problem         | `200`    | Record safe rejected outcome when possible |
| Temporary Stripe or Firestore failure | `500`    | Allow Stripe to retry                      |

# Secret setup

Local secret names and setup instructions live in [`packages/functions/.secret.example`](../../packages/functions/.secret.example).

- Use one restricted key for subscription reads.
- Use the signing secret printed by the local Stripe forwarding process.
- Never log credentials, raw webhook bodies, customer emails, or complete Stripe objects.
- Use separate sandbox and production credentials.

# File structure

```text
src/
  config/       Secret declarations and validation
  firebase/     Firebase Admin initialization
  http/         Public webhook boundary
  repositories/ Firestore event and subscription writes
  services/     Event processing and subscription projection
  stripe/       Stripe client and event correlation
  index.ts      Named Functions export
```

# Remaining validation

- Complete Checkout through the app while the Firebase emulators and Stripe forwarding are running.
- Confirm subscription creation, update, cancellation, invoice, duplicate, and delayed event behavior.
- Confirm a temporary provider failure returns `500` and succeeds on retry.
- Confirm permanent invalid correlation data cannot grant access.
- Add new unit or sandbox integration tests only after explicit approval.

# Current limits

- The package owns only the Stripe subscription webhook.
- Production deployment and Google Secret Manager setup are not included.
- Local sandbox validation requires Stripe CLI and Firebase emulator credentials.
