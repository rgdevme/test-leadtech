---
type: Design Guide
title: DraftRoom design system
description: Shared visual direction, color roles, shapes, typography, and motion rules for DraftRoom.
resource: ""
tags:
  - design
  - brand
  - accessibility
timestamp: 2026-08-16T10:55:04Z
---

# Purpose

Keep the website and application visually consistent while allowing each project to arrange its own interface.

The implementation source for fonts, colors, and motion settings is `packages/common/src/styles/theme.css`.

# Brand identity

- Use the "DraftRoom" name exactly as written.
- Read shared brand text from `packages/common/src/data/locale/en.ts`.
- Use the shared logo and favicon from `packages/common/src/assets`.
- Keep the brand calm, precise, focused, and practical.
- Avoid language or decoration that suggests collaboration, AI writing, or features outside the product scope.

# Color system

| Color family  | Purpose and usage                                                                                             |
| ------------- | ------------------------------------------------------------------------------------------------------------- |
| Sage neutrals | Page backgrounds, paper surfaces, text, borders, and quiet interface states.                                  |
| Yellow        | Meaningful action or communication like: primary actions, active emphasis, focused information, and warnings. |
| Blue          | Informational messages, links that need emphasis, and neutral status communication.                           |
| Green         | Confirmed success and healthy states.                                                                         |
| Red           | Destructive actions, failures, and errors.                                                                    |

# Typography

- Use the shared sans-serif family for interface and body text.
- Use the existing serif and monospace defaults only where their roles already apply.
- Use the `Text` atom for body copy, labels, and inline text.
- Use the `Heading` atom for headings.
- Do not modify letter spacing.
- Do not use Tailwind `tracking-*` utilities.
- Create hierarchy with size, weight, color, spacing, and line height.
- Keep paragraph lines comfortable to read and avoid overly wide text blocks.

# Shapes and surfaces

- Use borders and shadows when adjacent surfaces do not have enough contrast.
- Use warm paper-like surfaces rather than pure white panels.
- Use dark sections for strong contrast and major transitions in the marketing page.
- Use rounded cards and controls with simple, soft geometry.
- Use pill shapes for primary calls to action, labels, and compact status controls.
- Use thin borders to separate nearby surfaces.
- Use faint shadows to raise interactive or important elements without making them glossy.
- Keep decorative images quiet, faded, and secondary to text.

# Layout and spacing

- Keep content aligned to a consistent page container.
- Use generous space around major sections and tighter space inside related groups.
- Reduce empty space when it weakens the connection between a marker, label, heading, and its supporting text.
- Keep headings in the same visual column as the content they introduce unless a deliberate split layout improves scanning.
- Prevent sticky and animated content from leaving or clipping against its section boundary.
- Preserve useful content in the first viewport on common laptop and mobile sizes.

# Motion

- Use `350ms` as the default transition duration.
- Omit a component duration declaration when it matches the default.
- Use the shared motion curve from the common theme.
- Animate state changes smoothly, including expanding and collapsing content.
- Keep motion short, calm, and connected to user intent.
- Do not let animation delay navigation, input, or required content.
- Respect reduced-motion preferences.

# Interaction

- Keep body text and controls at accessible contrast levels.
- Make primary actions visually clear and consistent across surfaces.
- Avoid repeating the same primary action in the same view without a clear reason.
- Use data attributes to express visual component variants.
- Show visible keyboard focus on every interactive element.
- Use hover motion as supporting feedback, not the only sign that an element is interactive.
- Keep tap targets comfortable on small screens.

# Accessibility

- Use semantic elements and the existing text and heading atoms.
- Maintain logical heading order.
- Give icon-only controls an accessible name.
- Keep decorative images hidden from assistive technology.
- Do not communicate status through color alone.
- Check contrast after applying transparency, gradients, borders, and shadows.