---
type: Technical Roadmap
title: Integration contracts and project boundaries
description: Current package ownership, shared contracts, service boundaries, and integration checks for DraftRoom.
resource: ""
tags:
  - roadmap
  - contracts
  - architecture
timestamp: 2026-08-16T10:55:04Z
---

# Objective

Keep the website, app, shared package, and Firebase Functions aligned without sharing provider objects, secrets, or business workflows.

This document is the source of truth for project boundaries and integration behavior. Project-specific details belong in the [app roadmap](app.md), [website roadmap](website.md), and [Functions roadmap](functions.md).

# Project graph

```text
@leadtech/common ──> @leadtech/website
       │
       ├───────────> @leadtech/app ──> Firebase Auth, Firestore, Stripe Checkout
       │
       └───────────> @leadtech/functions ──> Stripe webhook, Firestore

@leadtech/website ──public links──> @leadtech/app
Stripe ──signed webhook──> @leadtech/functions
```

# Package ownership

| Package               | Owns                                                                                              | Must not own                                                            |
| --------------------- | ------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| `@leadtech/common`    | Runtime contracts, shared types, brand data, assets, and the Tailwind theme                       | React components, provider SDK objects, secrets, and business workflows |
| `@leadtech/website`   | Public product information, pricing presentation, responsive marketing UI, and links to the app   | Authentication, Stripe calls, Firestore calls, and private data         |
| `@leadtech/app`       | Authentication UI, server sessions, document APIs, editor UI, Stripe plan catalog, and Checkout   | Stripe webhook processing and direct browser access to Firestore        |
| `@leadtech/functions` | Stripe signature verification, event filtering, duplicate protection, and subscription projection | Browser UI, session cookies, Checkout creation, and document APIs       |

# Common package

The shared package lives at `packages/common` and exposes four areas:

| Area                | Location                               | Consumers                   |
| ------------------- | -------------------------------------- | --------------------------- |
| Contracts           | `packages/common/src/contracts`        | Website, app, and Functions |
| Shared English data | `packages/common/src/data`             | Website and app             |
| Brand assets        | `packages/common/src/assets`           | Website and app             |
| Design theme        | `packages/common/src/styles/theme.css` | Website and app             |

Rules:

- Use `@leadtech/common/contracts` at transport, persistence, and provider boundaries.
- Keep Firebase and Stripe SDK types inside the package that calls the provider.
- Keep Stripe Product IDs, Price IDs, and credentials out of shared data and browser bundles.
- Convert provider timestamps and objects before returning API responses.
- Build `@leadtech/common` before consumers that need compiled contracts or locale data.

# Authentication boundary

| Step                       | Owner               | Result                               |
| -------------------------- | ------------------- | ------------------------------------ |
| Register or sign in        | App browser         | Firebase ID token                    |
| Exchange token             | App API             | Server-only session cookie           |
| Validate protected request | App server          | Verified user identity               |
| Sign out                   | App API and browser | Cleared server and Firebase sessions |

- Protected server entry points verify the session cookie.
- Mutations validate the request origin.
- Browsers do not receive Firebase Admin credentials.
- Firestore client rules remain deny-all because trusted servers use the Admin SDK.

# Billing boundary

```text
App loads configured Stripe Products and their active recurring Prices
  -> App returns public plans with opaque keys
  -> App resolves the selected public plan key
  -> App creates Stripe Checkout Session
  -> Stripe redirects user to pending screen
  -> Stripe sends signed event to Functions
  -> Functions verifies and records event
  -> Functions updates subscription projection
  -> App reads projection and enables editing
```

- The browser submits a public plan key, not a Stripe Product ID, Price ID, amount, or access state.
- The app resolves the plan key through the server-only `STRIPE_PLANS_IDS` Product allowlist.
- The Checkout success redirect does not grant access.
- Editing requires an entitled Stripe status and a subscription Price belonging to the Product recorded by Checkout.
- A delayed webhook leaves the user in the pending subscription state.
- Stripe Products and their active recurring Prices are the public plan catalog source.

# Document access

| Capability               | Authenticated inactive owner | Active subscriber owner |
| ------------------------ | ---------------------------- | ----------------------- |
| List owned documents     | Allowed                      | Allowed                 |
| Open owned documents     | Read-only                    | Editable                |
| Create documents         | Denied                       | Allowed                 |
| Rename or save documents | Denied                       | Allowed                 |
| Delete documents         | Denied                       | Allowed                 |

- Ownership is required for every document request.
- Inactive owners keep read access after cancellation.
- Document changes use an expected version to prevent silent overwrites.
- Tiptap JSON is validated and stored in Firestore, not browser storage.

# App API surface

| Method                   | Route                         | Purpose                                               |
| ------------------------ | ----------------------------- | ----------------------------------------------------- |
| `GET`                    | `/api/auth/csrf`              | Issue the request token used during session creation. |
| `GET`, `POST`, `DELETE`  | `/api/auth/session`           | Read, create, or clear the server session.            |
| `GET`                    | `/api/billing/plans`          | Return selectable Stripe-backed public plans.         |
| `POST`                   | `/api/billing/checkout`       | Create a Stripe Checkout Session.                     |
| `GET`                    | `/api/billing/subscription`   | Return the projected subscription state.              |
| `GET`, `POST`            | `/api/documents`              | List or create documents.                             |
| `GET`, `PATCH`, `DELETE` | `/api/documents/{documentId}` | Read, update, or delete one owned document.           |

API rules:

- Parse untrusted input with shared schemas.
- Return the shared safe error shape.
- Do not return provider errors, raw tokens, credentials, or private provider objects.
- Return owner-scoped `404` responses when revealing resource existence would expose another user's data.
- Keep authentication, subscription, and document responses out of shared caches.

# Stripe webhook boundary

The Functions package exposes one public HTTP endpoint named `stripeWebhook`.

Processing order:

1. Read the exact raw request body.
2. Require and verify the Stripe signature.
3. Ignore verified unsupported events.
4. Check the event record for duplicate delivery.
5. Resolve the Firebase UID and selected Product from server-created Stripe metadata.
6. Read current subscription state when event order may be stale.
7. Validate the status and confirm a subscription Price belongs to the selected Product.
8. Write the event record and subscription projection in one Firestore transaction.
9. Return success only after durable handling.

- Invalid signatures return `400` without a write.
- Duplicate and unsupported verified events return `200`.
- Permanent metadata problems are recorded and acknowledged to prevent endless retries.
- Temporary Stripe or Firestore failures return `500` so Stripe can retry.

# Firestore ownership

| Collection            | Writer     | Reader                        | Purpose                                     |
| --------------------- | ---------- | ----------------------------- | ------------------------------------------- |
| `documents`           | App server | App server                    | Owner-scoped rich-text documents            |
| `subscriptions`       | Functions  | App server                    | Server-confirmed subscription access        |
| `stripeWebhookEvents` | Functions  | Functions and local operators | Duplicate protection and processing outcome |

The exact persistence schemas live in `packages/common/src/contracts/persistence.ts`.

# Integration checks

1. Build `@leadtech/common` and all consumers.
2. Start the website, app, Firebase emulators, and Stripe forwarding.
3. Register and create a server session.
4. Confirm an inactive user can read owned documents but cannot change them.
5. Complete Stripe Checkout and remain pending before webhook confirmation.
6. Confirm a verified webhook writes both the event record and subscription projection.
7. Confirm editing becomes available only after the projected state is entitled.
8. Redeliver the same event and confirm no second projection write occurs.
9. Cancel the subscription and confirm read access remains while changes are blocked.

# Current limits

- Production deployment and production secret setup are not included.
- Collaboration, offline editing, native apps, email verification, and administration are not included.
- Provider integration tests still require local sandbox credentials and explicit approval before new tests are added.
