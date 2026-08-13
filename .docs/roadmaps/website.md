---
type: Project Roadmap
title: Marketing website roadmap
description: Delivery plan for the public conversion surface in the @leadtech/website workspace.
resource: ""
tags:
  - roadmap
  - website
  - nextjs
timestamp: 2026-08-13T13:30:38Z
---

# Outcome

Deliver a responsive public landing page that explains the writing product, presents the available paid plans, and sends the selected public plan key with the subscription intent into the app's registration flow.

Canonical shared contracts: [Integration contracts and parallel delivery plan](integration-contracts.md).

# Current state

- Next.js 16 App Router, React 19, Tailwind CSS 4, and GSAP 3 are installed.
- The package runs on port 3000.
- The root page, metadata, and global styles are placeholders.
- No component hierarchy, locale dictionary, public assets, environment example, or CTA contract exists.
- The package does not depend on Firebase, Stripe, or the shared contract package yet.

# Boundaries

## Owns

- Landing-page information architecture and marketing copy.
- Product positioning, benefits, pricing, trust, FAQ, and responsive presentation.
- Links into the app registration flow.
- Static metadata, social preview metadata, and accessibility of the marketing surface.

## Does not own

- Authentication or session state.
- Checkout Session creation.
- Subscription state.
- Firestore data.
- App error or entitlement behavior.

# Technology decisions

| Technology            | Use                                               | Constraint                                                        |
| --------------------- | ------------------------------------------------- | ----------------------------------------------------------------- |
| Next.js 16 App Router | Static page, metadata, optimized fonts and images | Keep the page a Server Component.                                 |
| React 19              | Component composition                             | Client boundaries only around interactive motion or FAQ behavior. |
| Tailwind CSS 4        | Responsive layout and visual tokens               | Centralize tokens in global theme styles.                         |
| GSAP 3                | Optional hero and section entrance motion         | Respect reduced motion and never block CTA interaction.           |
| `next/font`           | Self-hosted optimized typography                  | Avoid layout shift and external runtime font calls.               |
| Locale dictionary     | All user-facing strings                           | Store in `src/data/locale/en.ts`; no inline duplicate copy.       |

# Integration contract

## Environment

Add `packages/website/.env.example` with:

| Variable              | Example                 | Use                                   |
| --------------------- | ----------------------- | ------------------------------------- |
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3001` | Trusted absolute origin for app links |

## URL ownership

| Website interaction | Target                                                           | Owner |
| ------------------- | ---------------------------------------------------------------- | ----- |
| Primary hero CTA    | `${NEXT_PUBLIC_APP_URL}/sign-up?intent=subscribe`                | App   |
| Plan pricing CTA    | `${NEXT_PUBLIC_APP_URL}/sign-up?intent=subscribe&plan={planKey}` | App   |
| Existing-user link  | `${NEXT_PUBLIC_APP_URL}/sign-in`                                 | App   |

Rules:

- [ ] Validate `NEXT_PUBLIC_APP_URL` during build and fail with a descriptive error when absent or invalid.
- [ ] Import public plan keys and display metadata from `@leadtech/contracts` rather than duplicating a plan catalog.
- [ ] Pass only the allowlisted public `planKey`; never place Stripe Product IDs or Price IDs in URLs.
- [ ] Do not accept arbitrary `returnTo` values.
- [ ] Use consistent CTA language across sections.
- [ ] Do not call any app, Firebase, or Stripe endpoint from this package.

# Component architecture

Follow Atomic Design and place each component in its own folder.

```text
src/
  components/
    atoms/
      Button/
      Container/
      Heading/
      Logo/
      Text/
    molecules/
      BenefitItem/
      FaqItem/
      PriceSummary/
    organisms/
      BenefitsSection/
      FaqSection/
      Footer/
      Hero/
      PricingSection/
      SiteHeader/
    templates/
      MarketingTemplate/
    pages/
      LandingPage/
  data/locale/en.ts
  app/page.tsx
```

- Use slot composition only for multi-region hosts such as `MarketingTemplate` or `SiteHeader`.
- Keep motion orchestration in a private hook owned by the consuming organism.
- Use `PropsWithChildren` for components that receive children.
- Keep route files thin and populate the concrete `LandingPage` page component.
- Keep all route-required default exports limited to Next.js special files.

# Content specification

## Required sections

- [ ] Header with product identity, sign-in link, and primary CTA.
- [ ] Hero with clear headline, subhead, and CTA.
- [ ] Two or three concise benefit statements.
- [ ] Feature or workflow section that demonstrates the editor value.
- [ ] Pricing section with at least one recurring paid plan and honest terms.
- [ ] Trust section using clearly labeled placeholder proof or concrete product assurances.
- [ ] FAQ covering billing, cancellation, document ownership, and browser support.
- [ ] Footer with repeated app links only when useful.

## Copy constraints

- [ ] Do not promise collaboration, native apps, AI writing, offline mode, or other out-of-scope features.
- [ ] Do not claim production security certifications or uptime guarantees.
- [ ] Explain that payment unlocks the editor after secure confirmation.
- [ ] Use consistent product, plan, interval, and price labels throughout the page.
- [ ] Store all strings in the dictionary and reference them from components.

# Delivery phases

## Phase 1: Foundation

- [ ] Add the package-local environment example.
- [ ] Add font, metadata, viewport, favicon, and social metadata.
- [ ] Define responsive color, spacing, type, radius, and focus tokens.
- [ ] Add the locale dictionary and content structure.
- [ ] Add atom barrels and the root component barrel.

Exit criteria:

- Page builds with no environment fallback.
- All copy comes from the English dictionary.
- Base atoms expose accessible focus and disabled states.

## Phase 2: Conversion surface

- [ ] Build the page from Page -> Template -> Organism -> Molecule -> Atom.
- [ ] Add `@leadtech/contracts` as a `workspace:*` dependency and render its public plan catalog.
- [ ] Implement the required sections and both CTA targets.
- [ ] Use semantic landmarks, heading order, lists, and buttons/links correctly.
- [ ] Send `intent=subscribe` and the selected public `planKey` from each pricing CTA.
- [ ] Confirm no CTA exposes a Stripe identifier, amount override, or entitlement value.
- [ ] Add intentional empty space and readable line lengths across breakpoints.

Exit criteria:

- A first-time visitor can identify the product, price, and next action without scrolling ambiguity.
- CTA links resolve to the app's documented routes.

## Phase 3: Motion and polish

- [ ] Add GSAP only where it reinforces hierarchy.
- [ ] Scope selectors to component refs and clean up animation contexts.
- [ ] Disable non-essential animation under `prefers-reduced-motion`.
- [ ] Verify keyboard order, focus visibility, contrast, and mobile tap targets.
- [ ] Check 320 px, tablet, laptop, and wide desktop layouts.
- [ ] Optimize images and remove unused client JavaScript.

Exit criteria:

- Motion cannot delay or obscure the CTA.
- No horizontal overflow, clipped content, or unexpected layout shift remains.

## Phase 4: Handoff

- [ ] Run existing format, lint, typecheck, and build tasks.
- [ ] Manually follow primary CTA, pricing CTA, and sign-in link.
- [ ] Record responsive screenshots for the submission demo if chosen.
- [ ] Document deliberate copy or animation tradeoffs in README.

# Parallel work agreement

The website workstream may start immediately after the URL and environment contracts are frozen.

Safe mocks:

- The app routes may return placeholders while links are being integrated.
- Public plan data may use a shared contract fixture until the server Price mapping is configured.

Integration blockers:

- Final CTA verification requires the app's sign-up route.
- Final plan availability requires every shared public key to map to an agreed Stripe sandbox Price on the app server.

# Risks and controls

| Risk                                                    | Control                                                                             |
| ------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| Marketing promises exceed implementation                | Restrict copy to the PDF acceptance scope.                                          |
| Cross-origin CTA is malformed                           | Build-time URL validation and manual link verification.                             |
| GSAP increases client bundle or causes hydration issues | Keep static layout server-rendered; isolate motion in the smallest client organism. |
| Mobile conversion is obscured                           | Keep the first CTA visible and verify small screens.                                |
| Plan catalog drifts between surfaces                    | Import public plan metadata from `@leadtech/contracts`; keep Price IDs server-only. |

# Proposed verification requiring approval

Do not create new tests until approved.

- Storybook render states for reusable atoms and molecules.
- Storybook interaction coverage only for meaningful FAQ or navigation behavior.
- Playwright acceptance story: `As a visitor, I can understand the product and open registration to subscribe.`

# Definition of done

- [ ] All PDF marketing and responsive requirements are visible.
- [ ] Hero and pricing CTAs use documented app destinations.
- [ ] Each pricing CTA carries `intent=subscribe` and its public plan key only.
- [ ] No sensitive or server-only dependency is present.
- [ ] Accessibility and reduced-motion behavior are manually verified.
- [ ] Existing checks pass.
- [ ] The end-to-end integration gate in the [canonical plan](integration-contracts.md#gate-2-integration) passes.

# Citations

1. [Next.js Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components)
2. [Next.js project structure](https://nextjs.org/docs/app/getting-started/project-structure)
3. [Next.js image optimization](https://nextjs.org/docs/app/api-reference/components/image)
4. [Next.js font optimization](https://nextjs.org/docs/app/getting-started/fonts)
