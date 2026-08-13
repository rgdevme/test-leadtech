---
title: Conventions
---

### Reusability & modularization

- **Look for existing components**: Before creating any new component, check the existing component tree.
- Shared hooks live in `hooks/`. Shared state stores in `stores/`. Shared utilities in `utils/`.
- Barrel exports in `components/index.ts` must stay current.
- **Use the dictionary**: Duplicate user-facing strings are a defect. All strings live in `data/locale/en.ts`.
