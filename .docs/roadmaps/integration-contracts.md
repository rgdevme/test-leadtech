---
type: Technical Roadmap
title: Integration contracts and parallel delivery plan
description: Canonical boundaries, API contracts, persistence schemas, and sequencing for the Leadtech take-home implementation.
resource: ""
tags:
  - roadmap
  - contracts
  - architecture
timestamp: 2026-08-13T13:30:38Z
---

# Objective

Define the stable seams that let the website, application, and Firebase Functions workstreams proceed in parallel without guessing each other's payloads, routes, or ownership.

> [!IMPORTANT]
> This document is the canonical source for integration contracts. Project roadmaps link here and only describe project-specific work.

# Assignment constraints

- [ ] Deliver a public marketing surface with value proposition, benefits, pricing, trust, and a consistent subscription CTA.
- [ ] Deliver email/password registration, sign-in, sign-out, and server-validated sessions.
- [ ] Let authenticated owners list and read their documents after cancellation while restricting document mutations to active subscribers.
- [ ] Support document list, create, edit, save, rename, and confirmed delete.
- [ ] Persist Tiptap JSON and metadata in Firestore, not browser storage.
- [ ] Use Stripe Checkout in subscription mode and grant access only from verified webhook state.
- [ ] Run locally through Firebase emulators and Stripe CLI forwarding.
- [ ] Use TypeScript, pnpm, ESM, package-local environment files, and no committed secrets.
- [ ] Keep production-grade infrastructure, collaboration, native apps, admin UI, and email verification out of scope.

# Current architecture assessment

| Area           | Current state                                                                      | Required decision                                                                          |
| -------------- | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Workspace      | pnpm workspace with `website`, `app`, and `functions` packages                     | Preserve package ownership and add a shared contract package.                              |
| Task runner    | Root scripts use recursive pnpm; `turbo` and `turbo.json` are absent               | Add Turborepo before parallel implementation and configure cache-safe tasks.               |
| Website        | Next.js 16 placeholder on port 3000                                                | Static marketing surface; no backend or Stripe secrets.                                    |
| App            | Next.js 16 placeholder on port 3001 with Firebase, Stripe, and Tiptap dependencies | Own browser experience and all same-origin application APIs.                               |
| Functions      | Firebase Functions placeholder                                                     | Own the public Stripe webhook only.                                                        |
| Authentication | Firebase client/Admin initialization exists; guards are placeholders               | Exchange a recent Firebase ID token for a server-only session cookie with CSRF protection. |
| Data           | Firestore is deny-all and has no indexes                                           | Keep client Firestore deny-all; use Admin SDK only through trusted servers.                |
| Billing        | Environment placeholders exist; no endpoints                                       | Use Stripe-hosted Checkout and a webhook-written entitlement projection.                   |
| Runtime        | Repo rule requires Node 24 or newer; Firebase supports Node 20 and 22              | Use Node 24 for local tooling and Node 22 only for the Functions deployment runtime.       |

> [!WARNING]
> The Firebase project is emulator-only (`demo-leadtech`), so its production Firestore edition is not discoverable. Plan against Firestore Standard in Native mode, then verify the selected database edition and region before any real deployment.

# Target package graph

```text
@leadtech/contracts
       |              \
       v               v
@leadtech/app    @leadtech/functions

@leadtech/website -- HTTPS link only --> @leadtech/app
Stripe -- signed webhook --> @leadtech/functions -- Admin SDK --> Firestore
@leadtech/app -- Admin SDK --> Firestore
```

## Package ownership

| Package               | Owns                                                                                               | Must not own                                                                     |
| --------------------- | -------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| `@leadtech/contracts` | Runtime schemas, transport types, constants, API error codes                                       | React, Firebase SDK objects, Stripe SDK objects, secrets, business orchestration |
| `@leadtech/website`   | Marketing content, responsive landing UI, CTA links                                                | Authentication, Stripe calls, Firestore calls                                    |
| `@leadtech/app`       | Auth UI/session exchange, mutation-entitlement guards, document APIs, editor UI, Checkout creation | Stripe webhook handling, direct client Firestore access                          |
| `@leadtech/functions` | Stripe signature verification, event deduplication, entitlement projection                         | Browser UI, session cookies, document CRUD                                       |

# Contract package

Create `packages/contracts` as `@leadtech/contracts` and consume it through `workspace:*` dependencies.

## Technology

| Technology                 | Purpose                                                     |
| -------------------------- | ----------------------------------------------------------- |
| TypeScript ESM             | Single source for compile-time contracts                    |
| Zod 4                      | Runtime validation at every untrusted boundary              |
| NodeNext module resolution | Emit ESM imports with `.js` extensions                      |
| Turborepo                  | Build the package before consumers and cache emitted output |

## Public exports

```text
packages/contracts/
  src/
    api.ts
    auth.ts
    billing.ts
    documents.ts
    persistence.ts
    stripe.ts
    index.ts
```

- [ ] Export types with `export type`.
- [ ] Export runtime schemas and constants as named values.
- [ ] Export one public subscription-plan catalog containing plan keys and display metadata but no Stripe identifiers.
- [ ] Convert Firestore `Timestamp` values to ISO 8601 strings at the API boundary.
- [ ] Do not expose Firebase or Stripe SDK types across packages.
- [ ] Keep package output deterministic and side-effect free.

# Shared transport contracts

## JSON primitives

```ts
export type JsonPrimitive = string | number | boolean | null;

export type JsonValue = JsonPrimitive | JsonObject | JsonValue[];

export type JsonObject = {
  [key: string]: JsonValue;
};
```

## Error envelope

```ts
export type ApiErrorCode =
  | "unauthenticated"
  | "forbidden"
  | "subscription_required"
  | "invalid_request"
  | "not_found"
  | "conflict"
  | "rate_limited"
  | "upstream_error"
  | "internal_error";

export type ApiErrorResponse = {
  error: {
    code: ApiErrorCode;
    message: string;
    fieldErrors?: Record<string, string[]>;
    requestId: string;
  };
};
```

| HTTP status | Error code              | Meaning                                                  |
| ----------- | ----------------------- | -------------------------------------------------------- |
| 400         | `invalid_request`       | Schema, CSRF, or malformed identifier failure            |
| 401         | `unauthenticated`       | Missing, expired, invalid, or revoked session            |
| 403         | `forbidden`             | Authenticated but not the resource owner                 |
| 403         | `subscription_required` | Authenticated owner attempted a subscriber-only mutation |
| 404         | `not_found`             | Resource does not exist for the authenticated owner      |
| 409         | `conflict`              | Stale document version or duplicate active checkout      |
| 429         | `rate_limited`          | Request throttled by the application or provider         |
| 502         | `upstream_error`        | Stripe or Firebase operation failed safely               |
| 500         | `internal_error`        | Unexpected server failure without sensitive details      |

## Authentication

```ts
export type AuthUser = {
  uid: string;
  email: string | null;
};

export type CsrfTokenResponse = {
  csrfToken: string;
};

export type CreateSessionRequest = {
  idToken: string;
  csrfToken: string;
};
```

### Session cookie contract

| Property     | Contract                                                                                     |
| ------------ | -------------------------------------------------------------------------------------------- |
| Name         | `__session`                                                                                  |
| Source       | Firebase Admin `createSessionCookie` after recent ID-token verification                      |
| Lifetime     | 5 days                                                                                       |
| Flags        | `httpOnly`, `sameSite=lax`, `path=/`, `secure` outside local HTTP                            |
| Verification | `verifySessionCookie(cookie, true)` on every protected server entrypoint                     |
| CSRF         | Double-submit token from `GET /api/auth/csrf`; token must match request body and CSRF cookie |
| Sign-out     | Clear session cookie, clear CSRF cookie, then sign out Firebase client state                 |

## Billing

```ts
export const subscriptionStatuses = [
  "none",
  "incomplete",
  "incomplete_expired",
  "trialing",
  "active",
  "past_due",
  "canceled",
  "unpaid",
  "paused",
] as const;

export type SubscriptionStatus = (typeof subscriptionStatuses)[number];

export type SubscriptionIntent = "subscribe";

export type SubscriptionPlanKey = string;

export type SubscriptionPlan = {
  key: SubscriptionPlanKey;
  name: string;
  description: string;
  unitAmount: number;
  currency: string;
  interval: "month" | "year";
  features: string[];
  featured: boolean;
};

export type ListSubscriptionPlansResponse = {
  items: SubscriptionPlan[];
};

export type CreateCheckoutRequest = {
  intent: SubscriptionIntent;
  planKey: SubscriptionPlanKey;
};

export type CreateCheckoutResponse = {
  checkoutUrl: string;
};

export type SubscriptionResponse = {
  status: SubscriptionStatus;
  entitled: boolean;
  updatedAt: string | null;
};
```

Entitlement policy:

- `active` and `trialing` map to `entitled: true` only when the subscription contains a Price ID from the server allowlist.
- Every other status maps to `entitled: false`.
- The Checkout success redirect never changes entitlement.
- A delayed webhook leaves the user in a visible `pending confirmation` state.

Plan-selection policy:

- The client may provide `intent: "subscribe"` and a public `planKey`.
- A plan key is a stable product slug that matches `^[a-z0-9]+(?:-[a-z0-9]+)*$` and contains at most 64 characters.
- `GET /api/billing/plans` is the canonical client catalog and never exposes Stripe Price IDs.
- The website renders the same public catalog from `@leadtech/contracts`; the app endpoint filters it to currently selectable server mappings.
- The server resolves `planKey` through its allowlisted plan catalog and rejects unknown or unavailable keys.
- The client never submits a Stripe Product ID, Price ID, amount, currency, or entitlement status.

## Rich-text documents

```ts
export type RichTextMark = {
  type: string;
  attrs?: JsonObject;
};

export type RichTextNode = {
  type: string;
  attrs?: JsonObject;
  content?: RichTextNode[];
  marks?: RichTextMark[];
  text?: string;
};

export type RichTextDocument = RichTextNode & {
  type: "doc";
};

export type DocumentSummary = {
  id: string;
  title: string;
  version: number;
  createdAt: string;
  updatedAt: string;
};

export type DocumentRecord = DocumentSummary & {
  content: RichTextDocument;
};

export type ListDocumentsResponse = {
  items: DocumentSummary[];
};

export type UpdateDocumentRequest = {
  title?: string;
  content?: RichTextDocument;
  expectedVersion: number;
};
```

## Document access policy

| Capability                   | Authenticated inactive owner   | Active subscriber owner |
| ---------------------------- | ------------------------------ | ----------------------- |
| View documents page          | Allowed                        | Allowed                 |
| List owned documents         | Allowed                        | Allowed                 |
| Open and read owned document | Allowed in read-only mode      | Allowed                 |
| Create document              | Subscription modal; API denied | Allowed                 |
| Edit or rename document      | Read-only UI; API denied       | Allowed                 |
| Delete document              | API denied                     | Allowed                 |

An authenticated inactive owner includes a registered user with no subscription, a canceled subscriber, and a subscriber in any non-entitled billing state. Ownership remains mandatory for both read and mutation access.

Validation rules:

- [ ] Title is trimmed and contains 1 to 120 characters.
- [ ] A Tiptap root has `type: "doc"`.
- [ ] Serialized content is at most 500 KB to leave Firestore document headroom.
- [ ] Nested content has bounded depth and node count.
- [ ] `expectedVersion` is a positive integer.
- [ ] An update changes at least one of `title` or `content`.
- [ ] The server owns IDs, owner IDs, versions, and timestamps.

# HTTP API

All application endpoints are same-origin Next.js Route Handlers under `@leadtech/app`. All responses use JSON except successful 204 responses.

| Method | Endpoint                      | Auth              | Entitlement | Request                                               | Success                                  |
| ------ | ----------------------------- | ----------------- | ----------- | ----------------------------------------------------- | ---------------------------------------- |
| GET    | `/api/auth/csrf`              | No                | No          | None                                                  | `200 CsrfTokenResponse` plus CSRF cookie |
| POST   | `/api/auth/session`           | Firebase ID token | No          | `CreateSessionRequest`                                | `204` plus session cookie                |
| DELETE | `/api/auth/session`           | Optional cookie   | No          | None                                                  | `204` and cleared cookies                |
| GET    | `/api/billing/plans`          | Session           | No          | None                                                  | `200 ListSubscriptionPlansResponse`      |
| POST   | `/api/billing/checkout`       | Session           | No          | `CreateCheckoutRequest` plus `Idempotency-Key` header | `201 CreateCheckoutResponse`             |
| GET    | `/api/billing/subscription`   | Session           | No          | None                                                  | `200 SubscriptionResponse`               |
| GET    | `/api/documents`              | Session           | No          | None                                                  | `200 ListDocumentsResponse`              |
| POST   | `/api/documents`              | Session           | Yes         | Empty body                                            | `201 DocumentRecord`                     |
| GET    | `/api/documents/{documentId}` | Session           | No          | None                                                  | `200 DocumentRecord`                     |
| PATCH  | `/api/documents/{documentId}` | Session           | Yes         | `UpdateDocumentRequest`                               | `200 DocumentRecord`                     |
| DELETE | `/api/documents/{documentId}` | Session           | Yes         | None                                                  | `204`                                    |

## Endpoint invariants

- [ ] Parse every path, header, and body with the shared schemas.
- [ ] Require `Content-Type: application/json` when a JSON body is present.
- [ ] Return `Cache-Control: no-store` for auth, subscription, and document responses.
- [ ] Generate a request ID and include it in safe server logs and error envelopes.
- [ ] Never include provider errors, secrets, raw tokens, or environment values in responses.
- [ ] Authorize before resource access; return owner-scoped `404` where existence must not leak.
- [ ] Use a Firestore transaction for versioned updates.
- [ ] Use the client-generated UUID from `Idempotency-Key` when creating Stripe objects; reuse it on retry.
- [ ] Resolve a validated client `planKey` to its Price ID through the server catalog; never accept Stripe identifiers, amount, or currency from the client.
- [ ] Apply entitlement checks only to POST, PATCH, and DELETE document operations; GET operations require authentication and ownership.

# Stripe webhook contract

Firebase Functions exposes one public endpoint:

| Method | Function         | Producer             | Authentication                                  | Success                    |
| ------ | ---------------- | -------------------- | ----------------------------------------------- | -------------------------- |
| POST   | `/stripeWebhook` | Stripe or Stripe CLI | `Stripe-Signature` over the unmodified raw body | `200 { "received": true }` |

Subscribed event types:

- `checkout.session.completed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.paid`
- `invoice.payment_failed`

Processing invariants:

1. Verify the signature before parsing or logging event fields.
2. Reject missing or invalid signatures with 400.
3. Ignore unsupported event types with 200 after verification.
4. Use `stripeWebhookEvents/{eventId}` as the duplicate-delivery ledger.
5. Resolve the Firebase UID from server-created Stripe metadata, never from arbitrary client data.
6. Retrieve the current Subscription when event order could produce stale state.
7. Project the normalized status and configured-price match into `subscriptions/{uid}`.
8. Commit the event ledger and subscription projection atomically.
9. Return a 2xx only after durable processing; let Stripe retry transient failures.

# Firestore persistence contracts

Firestore uses server-only Admin SDK access. Existing default-deny rules remain the external client boundary.

## `users/{uid}`

```ts
export type FirestoreTimestampValue = {
  seconds: number;
  nanoseconds: number;
};

export type UserPersistence = {
  uid: string;
  email: string | null;
  stripeCustomerId?: string;
  createdAt: FirestoreTimestampValue;
  updatedAt: FirestoreTimestampValue;
};
```

## `subscriptions/{uid}`

```ts
export type SubscriptionPersistence = {
  uid: string;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  stripePriceId: string;
  status: Exclude<SubscriptionStatus, "none">;
  entitlement: "active" | "inactive";
  cancelAtPeriodEnd: boolean;
  lastStripeEventId: string;
  updatedAt: FirestoreTimestampValue;
};
```

## `documents/{documentId}`

```ts
export type DocumentPersistence = {
  ownerId: string;
  title: string;
  content: RichTextDocument;
  version: number;
  createdAt: FirestoreTimestampValue;
  updatedAt: FirestoreTimestampValue;
};
```

Required list query:

```ts
documents.where("ownerId", "==", uid).orderBy("updatedAt", "desc");
```

Add a composite index on `documents.ownerId ASC, documents.updatedAt DESC`. Exempt `documents.content` from indexing.

## `stripeWebhookEvents/{eventId}`

```ts
export type StripeWebhookEventPersistence = {
  type: string;
  objectId: string | null;
  processedAt: FirestoreTimestampValue;
};
```

# Environment contract

| Package   | Variable                                  | Exposure           | Purpose                                         |
| --------- | ----------------------------------------- | ------------------ | ----------------------------------------------- |
| Website   | `NEXT_PUBLIC_APP_URL`                     | Browser-safe       | Absolute app origin for CTA links               |
| App       | `NEXT_PUBLIC_FIREBASE_*`                  | Browser-safe       | Firebase Web SDK configuration                  |
| App       | `NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST` | Browser-safe local | Auth emulator host                              |
| App       | `NEXT_PUBLIC_FIRESTORE_EMULATOR_HOST`     | Browser-safe local | Firestore emulator host if retained for tooling |
| App       | `FIREBASE_PROJECT_ID`                     | Server             | Admin SDK project                               |
| App       | `FIREBASE_AUTH_EMULATOR_HOST`             | Server local       | Auth emulator connection                        |
| App       | `FIRESTORE_EMULATOR_HOST`                 | Server local       | Firestore emulator connection                   |
| App       | `APP_URL`                                 | Server             | Trusted origin and Stripe return URL base       |
| App       | `STRIPE_APP_RESTRICTED_KEY`               | Secret             | Minimum Checkout and Customer permissions       |
| App       | `STRIPE_PLAN_PRICE_MAP`                   | Server             | Public plan keys mapped to sandbox Price IDs    |
| Functions | `STRIPE_WEBHOOK_RESTRICTED_KEY`           | Secret             | Minimum Subscription retrieval permissions      |
| Functions | `STRIPE_WEBHOOK_SECRET`                   | Secret             | Webhook signature verification                  |
| Functions | `STRIPE_ENTITLED_PRICE_IDS`               | Server             | Comma-separated entitlement Price allowlist     |

> [!CAUTION]
> Real GCP deployments must bind Stripe secrets from Google Secret Manager with least-privilege service access. `.env.example` files contain names and instructions only.

# Parallel execution plan

## Gate 0: Contract freeze

- [ ] Add `@leadtech/contracts` with the types and schemas above.
- [ ] Add Turborepo and a `turbo.json` with `build`, `check:*`, `dev`, and correct outputs.
- [ ] Configure remote caching only against a user-approved AWS or GCP implementation; keep local caching functional when remote credentials are unavailable.
- [ ] Add `workspace:*` dependencies from app and functions to contracts.
- [ ] Add package-local environment examples without values.
- [ ] Confirm API names, cookie name, Firestore paths, public plan keys, server Price allowlist, and error mapping.
- [ ] Tag the commit or record its hash as the contract baseline.

## Gate 1: Parallel package implementation

After Gate 0, these workstreams can proceed concurrently:

- [Website roadmap](website.md)
- [Application roadmap](app.md)
- [Firebase Functions roadmap](functions.md)

Allowed independent stubs:

- Website links may target the documented app URLs before app pages exist.
- App subscription reads may use an emulator seed conforming to `SubscriptionPersistence` before webhook completion.
- Functions may use Stripe CLI fixtures and Firestore emulator documents before UI completion.

## Gate 2: Integration

- [ ] Run Firebase Auth, Firestore, and Functions emulators under `demo-leadtech`.
- [ ] Run website on 3000 and app on 3001.
- [ ] Forward Stripe CLI events to the local `stripeWebhook` function.
- [ ] Complete landing plan selection -> register -> documents -> subscription modal -> Checkout -> pending -> entitled -> create/edit/save/rename/delete.
- [ ] Confirm logout/login persistence and inactive-user list/read access.
- [ ] Confirm create opens the plan modal and all document mutation APIs deny inactive users.
- [ ] Run existing format, lint, typecheck, build, and relevant test suites in parallel.
- [ ] Do not add new tests until their proposed cases receive explicit approval.

# Acceptance handoff

- [ ] README architecture diagram references these boundaries.
- [ ] README explains Stripe CLI forwarding and test-card flow.
- [ ] README explains why the redirect cannot grant access.
- [ ] README documents known limitations and scoped-out features.
- [ ] Demo covers the exact end-to-end path required by the PDF.
- [ ] No secret or provider payload appears in source, logs, screenshots, or docs.

# Citations

1. [Firebase session cookies and CSRF guidance](https://firebase.google.com/docs/auth/admin/manage-cookies)
2. [Cloud Firestore server clients bypass Security Rules](https://firebase.google.com/docs/firestore/security/test-rules-emulator)
3. [Cloud Firestore transactions](https://firebase.google.com/docs/firestore/manage-data/transactions)
4. [Cloud Firestore indexes](https://firebase.google.com/docs/firestore/query-data/indexing)
5. [Stripe Checkout subscriptions](https://docs.stripe.com/payments/checkout/build-subscriptions)
6. [Stripe webhook signatures, duplicate events, and event ordering](https://docs.stripe.com/webhooks)
7. [Stripe idempotent requests](https://docs.stripe.com/api/idempotent_requests)
8. [Tiptap JSON content](https://tiptap.dev/docs/editor/api/commands/content/set-content)
9. [Next.js Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components)
10. [Turborepo internal packages](https://turborepo.dev/docs/core-concepts/internal-packages)
11. [Turborepo remote caching](https://turborepo.dev/docs/core-concepts/remote-caching)
