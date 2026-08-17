# DraftRoom

DraftRoom is a focused browser writing workspace. The repository contains the public website and authenticated editor in a single application, shared contracts, tests, and Stripe webhook processing.

## Project architecture

```text
Browser
  └─ packages/app       Marketing, authentication, billing, documents, and editor
          │
          └─ Firestore  Users, documents, subscriptions, and webhook records

Stripe ──signed webhook──> packages/functions ──> Firestore

packages/common ──shared contracts──> app, functions, and tests
```

### `packages/app`

- Presents the DraftRoom product, benefits, pricing, trust information, and FAQ.
- Provides registration, sign-in, sign-out, subscription checkout, and subscription status.
- Provides owner-only document listing, reading, creation, editing, renaming, saving, and deletion.
- Uses server-validated Firebase sessions and server-side Firestore access.
- Allows inactive owners to read saved documents while limiting changes to active subscribers.

### `packages/functions`

- Receives the public Stripe webhook.
- Verifies Stripe signatures before processing events.
- Records processed events and projects subscription access into Firestore in one transaction.
- Uses Node.js 22 because it is the Firebase Functions runtime supported by this project.

### `packages/common`

- Owns provider-independent API, document, billing, persistence, authentication, and Stripe contracts.
- Exposes contracts as compiled TypeScript.
- Does not contain React components, provider SDK objects, secrets, or business workflows.

## Project technologies

| Technology                   | Purpose                                                                  |
| ---------------------------- | ------------------------------------------------------------------------ |
| TypeScript                   | Provides strict types across every project.                              |
| pnpm workspaces              | Installs and links the monorepo packages.                                |
| Turborepo                    | Orders builds and runs development and validation tasks across projects. |
| Next.js and React            | Power the website and authenticated application.                         |
| Tailwind CSS and CSS Modules | Provide shared design settings and component-scoped styles.              |
| GSAP                         | Handles focused marketing and interface motion.                          |
| Tiptap                       | Provides the rich-text editor.                                           |
| Firebase Authentication      | Registers users and verifies identity.                                   |
| Cloud Firestore              | Stores documents, subscriptions, and processed webhook events.           |
| Firebase Functions           | Hosts the Stripe webhook on Node.js 22.                                  |
| Stripe Checkout and webhooks | Collect subscription payments and confirm access on the server.          |
| Zod                          | Validates shared contracts and untrusted input.                          |
| Zustand                      | Manages shared client state.                                             |
| Mantine Form                 | Manages controlled authentication forms.                                 |

## Set up the project

### Requirements

- Node.js 22 for local project tooling.
- pnpm 11.
- Firebase CLI for the local Emulator Suite.
- Stripe CLI for local webhook forwarding.

### 1. Install dependencies

```bash
pnpm install # deps
pnpm --filter @leadtech/tests exec playwright install chromium # testing
```

### 2. Configure the apps' environment variables

Environment examples are provided for the app, Functions, and tests, with comments on each variable's purpose, source, example value, and default value.

Copy each example file, and rename it to replace `example` with `local`.

You also need a `firebase.config.json` file at the root of the repo, with the credentials provided by your firebase project:

```json
{
	"apiKey": "<apiKey>",
	"authDomain": "<authDomain>",
	"projectId": "<projectId>",
	"storageBucket": "<storageBucket>",
	"messagingSenderId": "<messagingSenderId>",
	"appId": "<appId>"
}
```

### 3. Install Stripe and authenticate with your account

- Install and authenticate:

```bash
pnpm install --global @stripe/cli
stripe login
```

Then, create an API key and store it in:

- [functions' .secret.local](packages/functions/.secret.local).
- [tests' .secret.local](packages/tests/.secret.local).
- [app's .env.local](packages/app/.env.local).

### 4. Get your Stripe webhook secret

- Run the following script:
  ```bash
  pnpm dev:stripe
  ```
- Copy the resulting webhook secret into [functions' .secret.local](packages/functions/.secret.local).
- Copy the resulting webhook secret into [tests' .secret.local](packages/tests/.secret.local).

## Run the project

Turborepo runs package checks as early as their dependencies allow, builds `packages/common` before the app and Functions, then runs the cached emulator and browser suite against those artifacts.

Build and start the local production stack:

```bash
pnpm start
```

`pnpm start` restores or creates the required build outputs, starts the production Next.js server, and attaches the Firebase emulators and Stripe webhook listener as persistent Turbo sidecars.

| Project   | Result                                                           |
| --------- | ---------------------------------------------------------------- |
| App       | Starts the production Next.js server on `http://localhost:3000`. |
| Functions | Starts Firebase emulators and Stripe CLI forwarding.             |

## Run the development servers

```bash
pnpm dev
```

Turborepo runs the persistent `dev` task in every project that provides one, after building common:

Useful focused commands:

- `pnpm dev:app`: builds `packages/common`, then starts only the app.
- `pnpm dev:functions`: builds `packages/common` and Functions, then starts Firebase and Stripe.
- `pnpm dev:stripe`: builds `packages/common`, then starts only Stripe webhook forwarding.
- `pnpm check`: runs package formatting, linting, and typechecking through Turborepo.
- `pnpm test`: builds test dependencies, then runs the cached emulator suite.

## Testing

| Suite                                     | What and why                                                                         | Runner and services                                                                    |
| ----------------------------------------- | ------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------- |
| Authentication and document authorization | Protects registration, sessions, ownership, and subscription-gated document changes. | Playwright with the built app and Firebase Auth and Firestore emulators.               |
| Firestore direct access                   | Proves browser clients cannot bypass the server authorization boundary.              | Vitest with `@firebase/rules-unit-testing` and the Firestore emulator.                 |
| Stripe webhook delivery                   | Protects signature validation, idempotency, retries, and subscription projection.    | Vitest with the Functions and Firestore emulators and deterministic Stripe signatures. |
| Stripe Checkout provider                  | Verifies Checkout requests and created resources against Stripe's real sandbox.      | Playwright with the built app, Firebase emulators, and the Stripe sandbox API.         |

Run static checks or the cached emulator suite directly. This suite is deterministic and cached by Turborepo.

```bash
pnpm check
pnpm test
```

Run the uncached live provider suite separately. This suite is never cached and requires a Stripe sandbox secret key in `packages/tests/.secret.local`.

```bash
pnpm test:provider
```

## Test the Stripe webhook flow

1. Create a Stripe sandbox restricted key with `Subscriptions` read access.
2. Add the key and local webhook signing secret to `packages/functions/.secret.local`.
3. Run `pnpm dev`.
4. Wait for Stripe CLI to report `Ready!` and confirm its `whsec_...` value matches `STRIPE_WEBHOOK_SIGNING_SECRET`.
5. Register in the app and complete Checkout with Stripe's sandbox card `4242 4242 4242 4242`, any future expiry, and any CVC.
6. Open the Emulator UI at `http://127.0.0.1:4000`.
7. Confirm `subscriptions/{uid}` and `stripeWebhookEvents/{eventId}` were written.
8. Redeliver the event from Stripe Workbench and confirm the projection timestamp does not change.

---

## Tradeoffs

- **Webhook-backed entitlement:** The application reads subscription access from Firestore instead of calling Stripe during every document request. This keeps authorization fast and centralized, but payment access is eventually consistent while the webhook is pending.
- **Server-side Firebase access:** Browser clients cannot read or write Firestore directly. Application routes use verified Firebase sessions and enforce document ownership and subscription access on the server. This adds server-side code, but keeps authorization decisions out of the browser.
- **Debounced autosave:** The editor saves after a short pause instead of requiring a manual save action. This reduces unnecessary writes and keeps writing uninterrupted, but requires visible retry and version-conflict states when persistence fails.
- **Local-first delivery:** Firebase emulators and Stripe sandbox mode make the project safe and repeatable for local evaluation. Production deployment, monitoring, and operational hardening remain outside the current scope.

### What I would do with another day

With another day, I would focus on hands-on UI and UX refinement in the authenticated application. Once the core behavior is stable, I prefer to review the product directly and adjust spacing, typography, visual hierarchy, interaction feedback, and responsive details by hand.

The first pass would include an accessibility review with consistent keyboard focus states, a skip link, clearer editor focus treatment, and stronger modal and form behavior. The goal would be to give the interface a more deliberate human touch without expanding the product scope.

I would also consider adopting a UI framework such as Mantine. Building the interface without a full component framework kept this small project focused and avoided setup overhead. On a larger project, the investment would be worthwhile because shared components, accessibility behavior, and design conventions become more valuable as the interface grows.

That setup would include project-level component patterns and agent rules that explain how to compose, style, and extend the framework correctly. Giving the agent those constraints early would help it produce consistent UI code without bypassing the established design system.

## AI disclosure

I used Codex to speed up development with the following configuration (mainly):

- Model: GPT-5.6 Sol
- Effort: High
- Speed: Normal

I selected the architecture, technologies, project structure, and priorities to focus on. This included bootstrapping the project with Turborepo for task orchestration and caching, and ESLint and Prettier for code quality and formatting.

AI assisted with creating three delivery roadmaps which were executed in parallel Git worktrees. After the roadmap work was working correctly, the worktrees were merged and the public website and authenticated application were integrated into one product flow.

Every merge and integration required formatting, linting, and type checking to pass. Tests were implemented after the project structure and integrations were stable enough.

I used my project rules in [`.docs/.rules`](.docs/.rules/) to guide the Codex agent. To compose and manage those rules, I used a tool I developed. You may run `pnpm dlx @luxia/agnos@latest --once` to compose the documentation and rules, and install the skills I provided to the agent.

_You may find the project-specific docs, including roadmaps, design guidelines, and rules, in [`.docs`](.docs/)._
