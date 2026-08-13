---
title: Managing and authoring Documentation and Rules
---

### Authoring conditions

- Author rules files when:
  - The user asks for a specific pattern to be implemented. For example: "use arrow functions", "names must be cammelCased".
  - An audit reveal a patter that can benefit the codebase.

- Author documentation when a task:
  - **changes how a system works**: auth flow, data model, API pattern, subscription logic, etc.
  - introduces an **architectural decision**: introducing a **new pattern, library, or architectural approach**.

### Authoring rules
- Never author docs or rules without explicit approval form the user.
- Any authoring proposal must be flag at the end of your response with the following format:
  > ⚠️ **<Doc|Rule> gap detected:** <decision-summary>.
  > Recommendation: <recommended-action>
  > _Consider updating [`<filename>`](<targeted-file-path.md>)_.
- Review your skills to author docs and rules correctly.
- Use `pnpm exec agnos docs --once` regenerate the docs.
- Use `pnpm exec agnos rules --once` regenerate the rules.
- Use `pnpm exec agnos --once` to regenerate both.
