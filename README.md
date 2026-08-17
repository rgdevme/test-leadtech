# DraftRoom

DraftRoom is a focused browser writing workspace. The repository contains the public website, authenticated editor, shared project resources, and Stripe webhook processing.

## Project architecture

```text
Browser
  ├─ packages/website   Public product and pricing website
  └─ packages/app       Authentication, billing, documents, and editor
          │
          └─ Firestore  Users, documents, subscriptions, and webhook records

Stripe ──signed webhook──> packages/functions ──> Firestore

packages/common ──shared contracts, data, assets, and theme──> all projects
```

### `packages/website`

- Presents the DraftRoom product, benefits, pricing, trust information, and FAQ.
- Links visitors to registration and sign-in in `packages/app`.
- Uses shared plan data, brand data, assets, and design settings from `packages/common`.
- Does not access Firebase, Stripe, or private application data.

### `packages/app`

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
- Owns shared English locale data, including the DraftRoom identity and public plan copy.
- Owns the shared logo, favicon, Tailwind theme, font family, colors, and motion curve.
- Exposes contracts as compiled TypeScript and exposes assets and styles from source files.
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

- Node.js 24 or newer for local project tooling.
- pnpm 11.
- Firebase CLI for the local Emulator Suite.
- Stripe CLI for local webhook forwarding.

### 1. Install dependencies

```bash
pnpm install
```

### 2. Configure the apps' environment variables

All projects have each an `.env.example` (functions has `secret.example`) indicating the used variables with comments on their purpose, source, an example value, and a default value.

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
- [app's .env.local](packages/app/.env.local).

### 3. Get your Stripe webhook secret

- Run the following script:
  ```bash
  pnpm --filter @leadtech/functions dev:stripe
  ```
- Copy the resulting webhook secret into [.secret.local](packages/functions/.secret.local).

## Run the project

> Turborepo builds `packages/common` before its consumers, then builds the website, app, and Functions output. A successful build prepares the repository for `pnpm start`.

To run the built project:

```bash
pnpm build
pnpm start
```

The root command uses pnpm workspace recursion to run every available `start` script in parallel:

| Project   | Result                                                                     |
| --------- | -------------------------------------------------------------------------- |
| Website   | Starts the production Next.js server on `http://localhost:3000`.           |
| App       | Starts the production Next.js server on `http://localhost:3001`.           |
| Functions | Loads the compiled Functions package and runs the stripe webhook listener. |

## Run the development servers

```bash
pnpm dev
```

Turborepo runs the persistent `dev` task in every project that provides one, after building common:

| Project   | Result                                                            |
| --------- | ----------------------------------------------------------------- |
| Website   | Starts Next.js development on `http://localhost:3000`.            |
| App       | Starts Next.js development on `http://localhost:3001`.            |
| Functions | Starts the Firebase emulators and Stripe CLI forwarding together. |

Useful focused commands:

- `pnpm dev:apps`: builds `packages/common`, then starts only the website and app.
- `pnpm dev:functions`: starts only the Functions development process.
- `pnpm check`: runs formatting, linting, and typechecking through Turborepo.

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
