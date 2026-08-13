# Leadtech monorepo

Barebones pnpm workspace for the marketing website, authenticated application, and Firebase Functions backend.

## Packages

- packages/website: Next.js, Tailwind CSS, and GSAP marketing site.
- packages/app: Next.js application prepared for Firebase authentication, Stripe subscriptions, and TipTap editing.
- packages/functions: Firebase Functions TypeScript package reserved for Stripe webhook processing.

## Commands

- pnpm install
- pnpm dev
- pnpm dev:functions
- pnpm build
- pnpm lint
- pnpm typecheck

Copy each package's .env.example when implementation begins. Keep Stripe and Firebase server credentials out of source control. Stripe subscription access must only be granted after a signature-verified webhook has updated the user's server-side subscription record.

