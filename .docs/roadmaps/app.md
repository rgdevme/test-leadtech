---
type: Project Roadmap
title: Authenticated editor application roadmap
description: Delivery plan for authentication, subscription gating, document APIs, and the Tiptap workspace in @leadtech/app.
resource: ""
tags:
  - roadmap
  - app
  - authentication
  - editor
timestamp: 2026-08-13T13:30:38Z
---

# Outcome

Deliver a server-authorized writing workspace where authenticated owners retain read-only access to existing documents after cancellation, can select a subscription plan when attempting to create, and regain document mutation access only after Stripe webhook verification.

Canonical schemas and endpoints: [Integration contracts and parallel delivery plan](integration-contracts.md).

# Current state

- Next.js 16 App Router, React 19, Firebase Web/Admin SDKs, Stripe 22, and Tiptap 3 are installed.
- Route placeholders exist for sign-up, sign-in, profile, document list, and one document.
- Firebase client and Admin SDK initialization is hard-wired to emulator variables.
- Authentication and subscription guards are placeholder `never` types.
- No Route Handlers, domain services, stores, forms, component tree, schemas, or data access layer exist.
- Tiptap packages are installed but unused.
- Zustand, Mantine Form, and Zod are not installed.

# Boundaries

## Owns

- Email/password authentication UI and Firebase client calls.
- CSRF-protected ID-token to session-cookie exchange.
- Server authentication, ownership, and mutation-entitlement guards.
- Checkout Session creation and subscription-status reads.
- Server-only document CRUD APIs and Firestore access.
- Profile, pending-payment, document list, and editor experiences.

## Does not own

- Stripe webhook verification or entitlement writes.
- Public marketing copy and layout.
- Direct browser access to Firestore.
- Production billing administration or custom pricing UI.

# Technology decisions

| Technology              | Use                                                      | Constraint                                                       |
| ----------------------- | -------------------------------------------------------- | ---------------------------------------------------------------- |
| Next.js 16 App Router   | Server Components, route groups, Route Handlers, cookies | Keep data and secrets server-side; isolate interactive islands.  |
| Firebase Authentication | Email/password identity                                  | Set client persistence to `NONE` after exchanging the ID token.  |
| Firebase Admin SDK      | Session verification and Firestore server access         | Mark all adapters `server-only`.                                 |
| Firestore               | User, entitlement, document persistence                  | Admin SDK only; browser rules remain default-deny.               |
| Stripe Checkout         | Hosted subscription flow                                 | Client selects a public plan key; server resolves its Price ID.  |
| Tiptap 3 StarterKit     | WYSIWYG editing and JSON serialization                   | Client-only organism; persist `editor.getJSON()`.                |
| Mantine `useForm`       | Controlled sign-in and sign-up forms                     | Follow the repository form folder and ownership rules.           |
| Zod 4                   | Form, request, response, and persistence parsing         | Reuse `@leadtech/contracts` schemas at transport boundaries.     |
| Zustand                 | Shared editor save/conflict state only                   | Use atomic selectors; do not duplicate server data in the store. |

# Route architecture

```text
src/app/
  (public)/
    sign-in/page.tsx
    sign-up/page.tsx
  (authenticated)/
    layout.tsx
    profile/page.tsx
    subscribe/pending/page.tsx
    documents/page.tsx
    documents/[documentId]/page.tsx
  api/
    auth/csrf/route.ts
    auth/session/route.ts
    billing/plans/route.ts
    billing/checkout/route.ts
    billing/subscription/route.ts
    documents/route.ts
    documents/[documentId]/route.ts
```

- `(authenticated)/layout.tsx` verifies the Firebase session and redirects invalid sessions to `/sign-in`.
- The documents list and detail routes are available to every authenticated owner.
- Documents render read-only when the subscription projection is inactive.
- Every Route Handler independently applies authentication, ownership, and mutation-entitlement guards. UI state is not API authorization.
- `/profile` remains available to every signed-in user and displays current billing state.

# Internal layers

```text
src/
  contracts/          # package-specific aliases only; no duplicate schemas
  firebase/
  stripe/
  repositories/
  services/
  guards/
  hooks/
  stores/
  schemas/
  data/locale/en.ts
  components/
```

| Layer         | Responsibility                                                         |
| ------------- | ---------------------------------------------------------------------- |
| Route Handler | Parse HTTP input, invoke guard/service, map result to response         |
| Guard         | Verify session and entitlement; return typed principal or failure      |
| Service       | Orchestrate one use case and preserve domain invariants                |
| Repository    | Convert Firestore documents and timestamps to domain values            |
| Adapter       | Configure Firebase Admin, Firebase client, or Stripe                   |
| Hook/store    | Own client-only editor behavior and cross-component presentation state |

# Authentication contract

Implement the endpoints and cookie policy defined in [Authentication](integration-contracts.md#authentication).

## Sign-up and sign-in flow

1. Fetch `GET /api/auth/csrf` and retain the returned token only for the exchange.
2. Call Firebase Auth email/password sign-up or sign-in with in-memory persistence.
3. Obtain a fresh ID token.
4. POST `{ idToken, csrfToken }` to `/api/auth/session`.
5. The server validates CSRF, verifies recent `auth_time`, and creates `__session` for five days.
6. Sign out the client SDK to clear the ID token from browser persistence.
7. Parse only the allowlisted `intent=subscribe` and a syntactically valid public `plan` key from the incoming URL.
8. After session creation, redirect to `/documents?intent=subscribe&plan={planKey}` when the intent is present; omit `plan` when none was selected.
9. The documents page opens the subscription modal and preselects the requested available plan, but starts Checkout only after explicit confirmation.

Query parameters influence presentation only. They never establish entitlement and never contain Stripe identifiers.

## Sign-out flow

1. DELETE `/api/auth/session`.
2. Clear the Firebase client session defensively.
3. Redirect to `/sign-in`.

## Security controls

- [ ] Compare the CSRF body token to the CSRF cookie using constant-time comparison.
- [ ] Validate `Origin` against `APP_URL` on session and other mutation endpoints.
- [ ] Accept only recent sign-in tokens for session creation.
- [ ] Verify session revocation for protected actions.
- [ ] Never use client state, URL parameters, or decoded-but-unverified JWT claims for authorization.
- [ ] Clear invalid cookies before redirecting to sign-in.
- [ ] Rate-limit session creation and authentication UI retries without disclosing account existence.

# Billing contract

## Plan catalog

`GET /api/billing/plans`:

- [ ] Require a valid session, but not an active subscription.
- [ ] Return the public catalog defined by `ListSubscriptionPlansResponse`.
- [ ] Include stable plan key, display name, description, amount, currency, interval, features, and featured state.
- [ ] Exclude Stripe Product IDs and Price IDs.
- [ ] Return only currently selectable plans.

The subscription modal fetches this endpoint instead of embedding a second plan catalog in the client.

## Checkout creation

`POST /api/billing/checkout`:

- [ ] Require a valid session, but not an active subscription.
- [ ] Parse `CreateCheckoutRequest` with `intent: "subscribe"` and `planKey`.
- [ ] Validate a UUID `Idempotency-Key` header.
- [ ] Create or reuse the Stripe Customer associated with `users/{uid}`.
- [ ] Resolve `planKey` through `STRIPE_PLAN_PRICE_MAP` and reject unknown or unavailable plans.
- [ ] Never accept a client Price ID, Product ID, amount, currency, or entitlement value.
- [ ] Create a hosted Checkout Session in `subscription` mode.
- [ ] Omit `payment_method_types` so Dashboard-configured dynamic methods remain available.
- [ ] Set `client_reference_id` and safe metadata to the Firebase UID.
- [ ] Set `subscription_data.metadata.firebaseUid` for subscription webhook correlation.
- [ ] Set success URL to `/subscribe/pending` and cancel URL to `/documents?intent=subscribe&plan={planKey}`.
- [ ] Pass Stripe `integration_identifier` using the agreed integration label plus random eight-letter suffix.
- [ ] Return only `checkoutUrl`.

## Subscription read

`GET /api/billing/subscription`:

- [ ] Read `subscriptions/{uid}` from Firestore.
- [ ] Return `none` and `entitled: false` when no projection exists.
- [ ] Never query Stripe in the request path.
- [ ] Return `no-store` and the ISO projection timestamp.

## Delayed webhook UX

- [ ] `/subscribe/pending` explains that payment succeeded but access awaits secure confirmation.
- [ ] Poll the subscription endpoint with a bounded interval and a 30-second deadline.
- [ ] Redirect to `/documents` only after `entitled: true` is read from Firestore.
- [ ] Preserve a retry/status-refresh action after the deadline.
- [ ] Never infer access from `session_id`, query parameters, or Checkout return state.

> [!NOTE]
> Stripe Tax is deliberately not enabled for this take-home. Enabling `automatic_tax` requires confirming active tax registrations and is not equivalent to completing tax setup.

# Document API contract

Implement the routes in [HTTP API](integration-contracts.md#http-api).

## Data access rules

- [ ] Run every document route after the session guard.
- [ ] Scope every query by `ownerId === principal.uid`.
- [ ] Permit GET list and detail operations for every authenticated owner regardless of subscription state.
- [ ] Apply the entitlement guard to POST, PATCH, and DELETE only.
- [ ] Return `subscription_required` for an authenticated owner's denied mutation.
- [ ] Parse every Firestore record before returning it.
- [ ] Use server timestamps for `createdAt` and `updatedAt`.
- [ ] Create documents with `Untitled document`, an empty Tiptap `doc`, and version 1.
- [ ] Query summaries by owner and descending update time.
- [ ] Use a Firestore transaction for PATCH and increment version exactly once.
- [ ] Return 409 with the current version when `expectedVersion` is stale.
- [ ] Delete only after server-side owner and entitlement checks.
- [ ] Return owner-scoped 404 for missing or foreign documents.

## Inactive-owner experience

- [ ] Render the documents page, owned summaries, timestamps, and empty state normally.
- [ ] Open an owned document in read-only mode with title and rich text visible.
- [ ] Hide or disable editor mutation controls without hiding the content.
- [ ] Open the subscription modal when the user activates Create document.
- [ ] If a create, edit, rename, or delete request returns `subscription_required` after entitlement changes, switch to read-only state and open the modal instead of retrying the mutation.
- [ ] Also open the modal when the route contains `intent=subscribe`.
- [ ] Fetch and lay out every available plan in the modal.
- [ ] Preselect the valid `plan` query value; otherwise use the server-designated featured plan.
- [ ] Submit `{ intent: "subscribe", planKey }` only after the user selects and confirms a plan.
- [ ] Keep the user on the documents page if the modal is dismissed.

## Autosave protocol

1. Load the document, version, and current subscription state.
2. Initialize Tiptap without emitting an update.
3. Configure the editor as non-editable when the owner is inactive and suppress all autosave behavior.
4. For active subscribers, store editor updates in the client hook and mark the editor dirty.
5. Debounce PATCH by 750 ms and serialize saves so only one request is in flight.
6. Send the last acknowledged version as `expectedVersion`.
7. On success, replace the acknowledged version and clear dirty state only if no newer local change exists.
8. On 409, stop autosave and show an explicit conflict state with reload action.
9. On network failure, retain dirty content in memory and show retry; do not claim it is saved.

No localStorage persistence is required by the assignment. Warn before navigation while an unsaved in-memory change exists.

# Component architecture

## Atomic Design layout

```text
src/components/
  atoms/
    Button/
    Dialog/
    Heading/
    IconButton/
    Input/
    Link/
    Spinner/
    Text/
  molecules/
    ConfirmDeleteDialog/
    DocumentListItem/
    EmptyState/
    FormField/
    SubscriptionPlanCard/
    SaveIndicator/
    SubscriptionBadge/
  organisms/
    AppHeader/
    DocumentList/
    EditorToolbar/
    RichTextEditor/
    SubscriptionModal/
    SubscriptionPanel/
  templates/
    AuthTemplate/
    EditorTemplate/
    WorkspaceTemplate/
  pages/
    DocumentEditorPage/
    DocumentsPage/
    ProfilePage/
    SignInPage/
    SignUpPage/
  forms/
    SignInForm/
    SignUpForm/
```

- Use slot-based composition for `EditorTemplate` and `WorkspaceTemplate` because they own multiple named layout regions.
- Keep Tiptap initialization and autosave orchestration in hooks private to `RichTextEditor`.
- Move a slot to the shared component tree only after it gains a second consumer.
- Update barrels whenever a reusable component is added.

## Form ownership

Each auth form follows the mandated structure:

```text
SignInForm/
  index.ts
  presentation.tsx
  bootstap.ts
  schemas.ts
```

- `bootstap.ts` configures controlled Mantine `useForm`, complete first-render values, Zod validation, and `form.submitting`.
- `presentation.tsx` receives the form, renders fields only, and does not submit or render `<form>`.
- The page consumer renders `<form>`, binds `form.onSubmit`, and owns navigation effects.
- Return the complete sign-in/sign-up promise so `form.submitting` remains correct.
- Place Firebase error translation in the form action only if orchestration exceeds one SDK call.

# Client state

Create `stores/useEditorStore.ts` only for state shared across editor regions:

```ts
export type EditorSaveState = "clean" | "dirty" | "saving" | "failed" | "conflict";

export type EditorStoreShape = {
  saveState: EditorSaveState;
  lastSavedAt: string | null;
  setSaveState: (saveState: EditorSaveState) => void;
  setLastSavedAt: (lastSavedAt: string | null) => void;
  reset: () => void;
};
```

- Select one field/action at a time.
- Keep document content, server version, and Tiptap Editor instances out of the global store.
- Keep form state in Mantine and dialog state local unless multiple unrelated consumers need it.
- Do not persist the store.

# Delivery phases

## Phase 1: Foundation and contracts

- [ ] Add `@leadtech/contracts`, Zod, Mantine Form, and Zustand dependencies with pnpm.
- [ ] Split Firebase client configuration into emulator and non-emulator modes.
- [ ] Create server-only Stripe and Firestore adapters.
- [ ] Add environment validation and update `.env.example` names/instructions.
- [ ] Implement error mapping, request IDs, and JSON response helpers.
- [ ] Add the locale dictionary and component barrels.

Exit criteria:

- Shared schemas compile in the app.
- Production configuration no longer requires emulator hosts.
- Server-only imports fail if pulled into a client component.

## Phase 2: Authentication

- [ ] Implement CSRF and session Route Handlers.
- [ ] Implement email/password sign-up, sign-in, and sign-out forms.
- [ ] Implement authenticated layout guard and session principal helper.
- [ ] Handle logged-out and logged-in UI states.
- [ ] Create or update `users/{uid}` through trusted server code.

Exit criteria:

- A user can register, sign in, refresh a protected page, and sign out.
- Direct requests without a valid server session are denied.

## Phase 3: Billing and entitlement

- [ ] Implement the public plan-catalog service and authenticated plans endpoint.
- [ ] Implement the plan-selection subscription modal.
- [ ] Implement Checkout Session creation.
- [ ] Implement subscription-status endpoint and profile panel.
- [ ] Implement pending-confirmation polling state.
- [ ] Implement the document mutation-entitlement API guard.
- [ ] Preserve and validate `intent` and `plan` through sign-up or sign-in navigation.

Exit criteria:

- Checkout redirect alone never unlocks documents.
- A known plan key resolves to its server-held Price ID, while unknown plan keys fail validation.
- A seeded active projection unlocks document mutations without calling Stripe.

## Phase 4: Document management

- [ ] Implement repository and all document Route Handlers.
- [ ] Add the Firestore composite index and content index exemption.
- [ ] Implement document list, new-document action, empty state, rename, and delete confirmation.
- [ ] Keep list and detail reads available to inactive owners.
- [ ] Open the subscription modal instead of calling POST when an inactive owner selects Create document.
- [ ] Display timestamps from server values.
- [ ] Return visible errors for failed create, load, rename, and delete actions.

Exit criteria:

- Subscriber CRUD works through the documented HTTP contracts.
- Inactive owners can list and read their documents, while mutation paths fail with `subscription_required`.
- Foreign, stale, and missing access paths fail safely.

## Phase 5: Rich-text editing

- [ ] Implement Tiptap StarterKit toolbar and editor canvas.
- [ ] Load and parse document JSON.
- [ ] Render inactive-owner documents through a non-editable Tiptap instance.
- [ ] Implement serialized debounced autosave and version conflicts.
- [ ] Implement save indicator, retry, and unsaved-navigation warning.
- [ ] Ensure editor keyboard behavior and toolbar labels are accessible.

Exit criteria:

- Content and title survive logout/login.
- Save failures are never presented as success.

## Phase 6: Integration and polish

- [ ] Integrate real emulator webhook projections from the Functions package.
- [ ] Verify logged-out, inactive read-only, plan modal, pending, subscriber, empty, error, and conflict states.
- [ ] Run existing format, lint, typecheck, build, and relevant approved tests.
- [ ] Complete the PDF demo flow and README handoff.

# Parallel work agreement

The app can proceed after contract freeze using these substitutes:

- Seed `subscriptions/{uid}` with a contract-valid projection to build subscriber UI before Functions is complete.
- Use Stripe sandbox Checkout while the webhook endpoint is unfinished; remain in pending state.
- Use contract fixtures for document API UI while repositories are being implemented.

Do not change shared payloads inside this package. Propose contract changes in the canonical document/package and coordinate both consumers.

# Risks and controls

| Risk                                    | Control                                                                |
| --------------------------------------- | ---------------------------------------------------------------------- |
| Client-only authorization bypass        | Verify session and ownership for reads; add entitlement for mutations. |
| Canceled user loses document visibility | Require only authentication and ownership for document GET routes.     |
| Client tampers with plan or price       | Accept a public plan key and resolve it through the server allowlist.  |
| CSRF on session exchange                | Double-submit token, trusted Origin, same-site cookie.                 |
| Duplicate Checkout Sessions             | Client UUID plus Stripe idempotency key and active-subscription check. |
| Lost autosave updates                   | Serialized writes and optimistic version checks.                       |
| Firestore document-size abuse           | Runtime size, depth, and node-count limits.                            |
| Secret leakage into browser             | `server-only` adapters and no secret `NEXT_PUBLIC_*` variables.        |
| Delayed webhook confusion               | Explicit pending state and bounded polling.                            |
| Tax misconfiguration                    | Keep automatic tax disabled until registrations are confirmed.         |

# Proposed verification requiring approval

Do not create new tests until approved.

- Unit: auth error translation, entitlement mapping, Tiptap JSON size/depth validation, and persistence codecs.
- Component stories: inputs, save indicator states, subscription badge, empty state, and delete confirmation.
- End-to-end: register/sign-in/session refresh; canceled-user list/read access; create-to-plan-modal behavior; unknown-plan rejection; webhook unlock; document CRUD and persistence; delayed-webhook pending state.

Suggested story:

`As a document owner, I can still read my work after cancellation and resubscribe from the create flow.`

# Definition of done

- [ ] Authenticated sessions are server-validated and revocable.
- [ ] Subscriber state comes only from the Firestore webhook projection.
- [ ] All documented APIs and error mappings are implemented.
- [ ] Inactive owners can list and read their documents but cannot mutate them.
- [ ] Create opens the plan modal and Checkout accepts only an allowlisted plan key.
- [ ] Document ownership, mutation entitlement, size, and version invariants hold.
- [ ] Required empty, pending, saving, failed, conflict, and delete-confirmation states are visible.
- [ ] Existing checks pass.
- [ ] The [integration gate](integration-contracts.md#gate-2-integration) passes.

# Citations

1. [Firebase session cookies](https://firebase.google.com/docs/auth/admin/manage-cookies)
2. [Next.js cookies](https://nextjs.org/docs/app/api-reference/functions/cookies)
3. [Next.js Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
4. [Next.js data security](https://nextjs.org/docs/app/guides/data-security)
5. [Cloud Firestore transactions](https://firebase.google.com/docs/firestore/manage-data/transactions)
6. [Stripe Checkout subscriptions](https://docs.stripe.com/payments/checkout/build-subscriptions)
7. [Stripe idempotent requests](https://docs.stripe.com/api/idempotent_requests)
8. [Mantine controlled forms](https://mantine.dev/form/uncontrolled/)
9. [Mantine schema validation](https://mantine.dev/form/schema-validation/)
10. [Tiptap React editor](https://tiptap.dev/docs/editor/getting-started/install/react)
11. [Tiptap setContent JSON behavior](https://tiptap.dev/docs/editor/api/commands/content/set-content)
