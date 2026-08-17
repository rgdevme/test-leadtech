---
type: Rule
title: Coding standards
description: Repository-wide language, package, quality, and implementation standards.
resource: ""
tags:
  - coding
  - typescript
timestamp: 2026-08-17T00:00:00Z
---

Enforced repo-wide. Non-negotiable.

### Package Manager

**Use `pnpm` only.**

Never use other package manages, like `npm`, `yarn`, or `bun`.

### Turborepo

- **TurboRepo with remote caching**: Use remote caching to ensure fast build and deploy times.
  - subcommands like `<command>:<sub>` should write to the same cache as the parent `<command>`

### Language & module system

- **ESM only**: Use Node 22 for repository tooling, packages, and managed runtimes.
- **Node runtime pinning**: Pin Node 22 in every package engine and platform runtime configuration.
- **NodeNext resolution**: Import paths use .js extension even when importing .ts.
- import type for types, import for runtime values.
- No default exports except plugin entries.
- No top-level await. No CJS.

### TypeScript

- End-to-end.
- No `any` without justification.
- Strict mode + noUncheckedIndexedAccess + verbatimModuleSyntax.
- Always use `type`. Avoid `interface` unless necessary.
- Always use `async/await` and `try/catch`. Avoid `.then()` chains.
- Always use named exports. Avoid default exports unless necessary.
- Always use arrow functions. Avoid named functions unless necessary or when explicitly told to use them.
- Always declare function components, never class components.
- Use aliases (`@`) to keep the import paths clean.

### Reusability & modularization

- **No duplication**: If a pattern appears twice, extract it immediately. Zero tolerance.
- Before creating components, utilities, hooks, etc; check the existing tree.
- Use barrel exports and keep them updated.
- **Use the dictionary**: Duplicate user-facing strings are a defect. All strings live in `data/locale/en.ts`.

### Naming

- camelCase variables/functions, PascalCase types, UPPER_SNAKE constants.

### Comments

- Self-documenting code: Prefer clear naming over comments.
- Default: no comments. Self-documenting code first. Never restate what the code does.
- JSDoc only on public API surfaces (exported types, plugin contracts). Internal helpers don't get JSDoc.
- Comments explain why, never what. Rename a variable instead of describing what code does.
- // TODO: and // FIXME: reserved for tracked issues, not casual notes.

- Prefer clear naming over comments.
- Comments are only for non-obvious reasoning.
- Never restate what can be inferred from code.
- Do not use comments for documentation. Use the `.docs` and ADRs for documentation.
- Prefer an ADR reference over inline explanation.
- **Self-documenting code**: Comments should be used to explain:
  - Complex reasoning
  - Functions, params, arguments, and return type documentation
- Remove all section comments where the code is self-documenting (e.g. `// Save handler` above a function named `handleSave`).
  - Do not leave `TODO` or `FIXME` comments unresolved in committed code.

- Do not use comments for documentation.
- Use the `.docs` and `ADRs` for documentation.
- Never restate what can be inferred from code.
- **Self-documenting code**: Prefer clear naming over comments.
- Comments should explain complex or non-obvious reasoning for functions, params, arguments, and return type documentation.
- Do not leave `TODO` or `FIXME` comments unresolved in committed code.
- Do not duplicate information already in a canonical source file.

### Errors

- Throw Error with descriptive messages, preserving causes via { cause: originalErr }.
- Catch only when you can do something useful. Empty try/catch reserved for genuinely optional cleanup (e.g., unlink of a maybe-missing file).
- Return { ok: boolean } from orchestrator-level functions; don't throw across the CLI boundary.

### Logging

- Five levels: info, success, warn, error, debug. Use the level that matches the meaning.
- No manual ANSI codes: The logger handles color and TTY detection.
- Hook implementations log without manual indentation prefixes; the orchestrator wraps the logger.
- would: <action> prefix for dry-run output.

### File organization

- One concept per file.
- Single package (`@luxia/agnos`): core under `src/core/`, domains under `src/domains/<id>/`, agent adapters under `src/agents/adapters/<id>/`.
- Public surface via `src/core/index.ts` re-exports.
- Shared types in `src/core/types/public.ts`.
- Tests in `test/<area>/<concept>.test.ts`.

### Code health

- Use EsLint, Prettier, and `tsc` to validate code.
- Use `lint:fix` and `format:fix` to lint and format automatically.
- Core and critical functionality must be tested before commiting.
- Execute linting, formatting, typecheking and testing before commiting. Always.
- Execute any pre-commit tasks in paralel, whenever posible.

### Principles

- Idempotency is mandatory for anything that touches the filesystem. Every hook must be safe to re-run.
- **No duplication**: If a pattern appears twice, extract it immediately. Zero tolerance.
  - Before writing new logic, check `packages/shared`. Shared logic, types, and configs live there.
  - Do not duplicate information already in a canonical source file.
- No abstractions for hypothetical needs. Build for what's asked; symmetry over flexibility when adding hooks (if there's onAdded, there's probably onRemoved).
- No backward-compat shims when redesigning: Clean cutover, migrate built-ins in the same change.
- Read existing patterns before inventing one. Codebase is small; grep first.
