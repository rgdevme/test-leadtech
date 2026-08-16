---
type: Project Roadmap
title: Marketing website roadmap
description: Current responsibilities, conversion flow, interaction decisions, and remaining validation for the DraftRoom website.
resource: ""
tags:
  - roadmap
  - marketing
  - nextjs
  - accessibility
timestamp: 2026-08-16T10:55:04Z
---

# Outcome

Explain DraftRoom clearly and direct visitors to registration or sign-in without introducing backend dependencies.

Shared boundaries are defined in [Integration contracts and project boundaries](integration-contracts.md). Visual rules are defined in [Design system](../design.md).

# Current state

- The responsive landing page includes product value, benefits, workflow, trust, pricing, FAQ, and footer sections.
- Shared plan data, brand data, logo, favicon, and design settings come from `@leadtech/common`.
- Registration, sign-in, and pricing links target the app through validated public origins.
- Metadata, Open Graph imagery, sitemap, robots, and the web manifest are implemented.
- Motion respects reduced-motion preferences.

# Responsibilities

## Owns

- Public product and pricing information.
- Responsive page structure and presentation.
- Accessible navigation and app links.
- Search and social metadata.
- Marketing interaction and motion behavior.

## Does not own

- Authentication or private user state.
- Stripe or Firebase SDK calls.
- Checkout Session creation.
- Document data or subscription decisions.

# Page structure

| Section  | Goal                                                                     |
| -------- | ------------------------------------------------------------------------ |
| Header   | Keep navigation, sign-in, and the primary registration action available. |
| Hero     | State the product value and invite visitors to explore benefits.         |
| Benefits | Explain the focused writing tools.                                       |
| Workflow | Show how a document moves from creation to a saved state.                |
| Trust    | Explain ownership, reading access, and payment confirmation.             |
| Pricing  | Present the shared public plan and registration link.                    |
| FAQ      | Answer billing, cancellation, ownership, and browser questions.          |
| Footer   | Repeat the clearest final action and product identity.                   |

# Content rules

- Keep all user-facing copy in locale data.
- Use DraftRoom brand text from `@leadtech/common/data/locale/en`.
- Use public plan content from `@leadtech/common`.
- Do not promise collaboration, AI writing, offline editing, native apps, or production guarantees.
- Never expose Stripe identifiers, credentials, or private application state.

# App link contract

| Link           | Destination                                                             |
| -------------- | ----------------------------------------------------------------------- |
| Start writing  | App registration route                                                  |
| Sign in        | App sign-in route                                                       |
| Pricing action | App registration route with the public subscription intent and plan key |

- Build links from the validated `NEXT_PUBLIC_APP_URL` origin.
- Keep internal section links within the marketing page.
- Never place Stripe Product IDs or Price IDs in URLs.

# Component structure

```text
src/
  app/          Locale routes and metadata
  components/   Atomic Design components and the landing page
  config/       Public environment and app links
  data/         Website-specific locale data
  hooks/        Shared presentation hooks
  i18n/         Locale selection and dictionary loading
```

# Remaining validation

- Check the complete page at small, medium, and wide viewport sizes.
- Follow every registration, sign-in, pricing, navigation, and scroll link.
- Check FAQ keyboard behavior and reduced-motion behavior.
- Confirm no title, card, or product image is clipped during scroll.
- Add new browser or component tests only after explicit approval.

# Current limits

- The website supports English content only.
- It does not read authentication or subscription state.
- Production hosting, analytics, and experimentation are not included.
