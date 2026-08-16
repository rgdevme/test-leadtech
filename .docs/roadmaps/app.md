---
type: Project Roadmap
title: Authenticated editor application roadmap
description: Current responsibilities, flows, structure, and remaining validation for the DraftRoom application.
resource: ""
tags:
  - roadmap
  - nextjs
  - firebase-auth
  - stripe-checkout
  - tiptap
timestamp: 2026-08-16T10:55:04Z
---

# Outcome

Provide the authenticated DraftRoom workspace where users manage subscriptions and owned rich-text documents.

Shared boundaries and API behavior are defined in [Integration contracts and project boundaries](integration-contracts.md).

# Current state

- Registration, sign-in, sign-out, and server-validated sessions are implemented.
- The app shows separate signed-out, inactive-owner, pending-subscription, and active-subscriber states.
- Stripe Checkout is created by the app server from a public plan key.
- Document listing, reading, creation, editing, saving, renaming, and confirmed deletion are implemented.
- Inactive owners keep read access while document changes remain blocked.
- Tiptap JSON and document metadata are stored in Firestore.
- DraftRoom brand data, assets, contracts, and design settings come from `@leadtech/common`.

# Responsibilities

## Owns

- Firebase Authentication browser flows.
- Server session creation, validation, and deletion.
- Request origin validation for protected mutations.
- Document APIs and owner checks.
- Subscription status reads and Checkout Session creation.
- Document and account interface presentation.

## Does not own

- Public marketing content.
- Stripe webhook verification.
- Subscription projection writes.
- Direct browser access to Firestore.
- Production billing administration.

# Request flow

```text
Browser component
  -> same-origin route handler
  -> authentication and access guard
  -> service
  -> repository or provider adapter
  -> validated response
```

- Route handlers own HTTP parsing and response status.
- Guards own identity, request origin, ownership, and editing-access checks.
- Services coordinate one application action.
- Repositories own Firestore paths and persistence conversion.
- Shared request and response contracts come from `@leadtech/common/contracts`.

# Authentication flow

1. Firebase authenticates the email and password in the browser.
2. The browser sends a recent ID token and request token to the session endpoint.
3. The app server validates both values and creates a server-only session cookie.
4. Protected server work verifies the cookie before reading private data.
5. Sign-out clears both the server session and Firebase browser state.

# Subscription flow

1. An authenticated user selects a shared public plan.
2. The app server resolves the plan through its Stripe allowlist.
3. Stripe Checkout receives the Firebase UID as server-created correlation metadata.
4. The user returns to the pending screen after Checkout.
5. The app reads only the subscription projection written by Functions.
6. Editing becomes available after the projection is entitled.

# Document behavior

| Action                        | Inactive owner                 | Active subscriber          |
| ----------------------------- | ------------------------------ | -------------------------- |
| List and open owned documents | Allowed                        | Allowed                    |
| Create                        | Blocked with subscription path | Allowed                    |
| Edit, rename, and save        | Read-only                      | Allowed                    |
| Delete                        | Blocked                        | Allowed after confirmation |

- Updates include the expected document version.
- Save state is visible in the editor.
- Failed requests use safe user-facing errors.
- Ownership checks happen before a document is returned or changed.

# Component structure

```text
src/
  app/          Routes, layouts, and route handlers
  components/   Atomic Design presentation components and forms
  guards/       Authentication, request, ownership, and access checks
  services/     Application actions and provider coordination
  repositories/ Firestore persistence
  firebase/     Firebase browser and Admin setup
  stripe/       Server-side Stripe setup
  data/         App-specific locale data
  utils/        Shared app helpers
```

# Remaining validation

- Run the complete registration, Checkout, pending, webhook, and editor flow with sandbox credentials.
- Confirm delayed and repeated webhook delivery through the Firebase emulators.
- Confirm document content survives sign-out and a later sign-in.
- Confirm cancellation preserves reading and blocks every document mutation.
- Add new automated tests only after explicit approval.

# Current limits

- Password reset, email verification, OAuth, billing portal access, and account deletion are not included.
- Collaboration, offline editing, document sharing, and native apps are not included.
- Production deployment and production secret setup are not included.
