## Components architecture

Always follow these rules when writting react components:

- Use the **Atomic Design Principles** to organize components.
- Use **Slot-based composition** to when a component has multiple named layout regions, and its parts may not be reused by other components.
- Place each component in its own folder, following the atomic design principles and slot-based composition rules.
- Components are for presentation. Extract complex logic into hooks.

### Writting components

- Keep `props` surface as small as possible.
- Use a store instead of props when:
  - a prop has to be passed down more than one level.
  - a prop must be consumed by more than one component.
  - it helps to avoid prop-drilling.
- Always use `PropsWithChildren`. Avoid manually typing children.
- Modularize components into independent files, unless the components are closely related and their surface is small.
- Do not use thin wrapper components (components that wrap and export anothe component without handling any logic).

#### Example

```jsx
// MyComponent.tsx
type MyComponentProps = PropsWithChildren<{ /* ... */ }>

export const MyComponent = ({ ...props }: MyComponentProps) => { /* ... */ }
```

### Atomic design principles

When designing, building, and organizing components, assess their level in the following scale according to its responsibility and composition, and use the level to place them in the correct directory:

1. **Atoms**: located at `src/components/atoms/`. The smallest indivisible UI elements, such as buttons, icons, labels, inputs, and typography. They provide basic styling and behavior but little meaning on their own.
2. **Molecules**: located at `src/components/molecules/`. Small combinations of atoms that perform one focused task. For example, a labeled input, search field with a button, or avatar with a username.
3. **Organisms**: located at `src/components/organisms/`. Larger, self-contained interface sections composed of atoms and molecules. Examples include navigation headers, product cards, forms, and data tables.
4. **Templates**: located at `src/components/templates/`. Page-level structures that arrange organisms into a reusable layout. They define content hierarchy and placement without depending on final, page-specific content.
5. **Pages**: located at `src/components/pages/`. Concrete instances of templates populated with real content and application data. Pages represent what users actually visit and are useful for validating the complete experience.

The dependency direction (from higher levels to lower ones) is `Page → Template → Organism → Molecule → Atom`, where the higher levels may import form lower levels, but lower leves may never import from higher ones.

### Slot-based composition

- Avoid slots when a component has only one content region.
- Slot-based components have:
  1. A `host` component to own the layout: structure, order, responsiveness, and accessibility.
  2. One or many `slots` components to declare the presentation of each of the layout's regions.
- Keep host-specific components and hooks private.
- Consumers components provide the content.

#### Rules for host components

Host components must:

- Be declared using **arrow functions**.
- Use `useComponentSlots` to define the allowed slot components for a parent component.
- Use `index.tsx` to export the compound host.
- Expose slots only through `Host.Slot` from `index.tsx`. Never allow direct imports from `components/` and `hooks/`.

#### Rules for slot components

Slot components must:

- Be declared using **named functions**.
- Use semantic slot names such as `Header`, `Content`, `Actions`, `Filters`, etc...
- Not be used for data-driven repeated content.

Move a slot component to the repective level in `src/components/` when any of these conditions apply:

- It gains a second consumer.
- It has an independent purpose outside its parent.
- It no longer depends on its parent’s internals.

Do not move it based only on size or hypothetical reuse.

#### Folder structure

```text
Host/
  index.tsx
  components/
    Slot/
      index.tsx
  hooks/
    useHook.ts
```

#### Example

Declare the slot component:

```jsx
// Host/components/Slot/index.tsx
type SlotProps = PropsWithChildren<{ /* ... */ }>

export function Slot({ ...props }: SlotProps) {
  /* ... */
}
```

Declare the host component:

```jsx
// Host/index.tsx
import { Slot } from 'Slot'

type HostProps = PropsWithChildren<{ /* ... */ }>

const Host = ({ children, ...props }: HostProps) => {
  const slots = useComponentSlots({ slot: Slot }, children)

  return <div>
    {/* ... */}
    {slots.slot}
    {/* ... */}
  </div>
}

// Compound and export the host component
Host.Slot = Slot

export { Host }
```

Consume the slot-based component:

```jsx
// MyComponent.tsx
import { Host } from "Host"

const { Slot } = Host

export const MyComponent = () => (
	<Host>
		<Slot />
	</Host>
)
```

### Form components

- Place each form in `src/components/forms/<Form>/`.
- Manage forms with Mantine's `useForm`.
- Use controlled mode. Do not use `form.key(<field>)`.
- Provide complete `initialValues` on the first render.
- Do not gate input props on `form.initialized`.
- Use uncontrolled mode only to solve a measured rendering problem.
- Use `FunctionArgs<typeof api.<mutation>>` for payload types.
- Do not derive form types from `Doc<...>`.
- Use `form.submitting` instead of duplicate submission state.
- Return the submission promise so `form.submitting` remains accurate.
- Use `requestSubmit()` for triggers outside `<form>`.
- Do not add stories to forms. Add stories to their reusable atoms and molecules.

#### Folder structure

```text
src/
  components/
    forms/
      <Form>/
        index.ts
        presentation.tsx
        bootstap.ts
        actions.ts       # optional
        schemas.ts       # optional
        codec.ts         # optional
  schemas/
    <entity>/
      <response>.ts
  utils/
    forms.ts
```

- `index.ts` exports `<Form>` and `use<Form>`.
- `presentation.tsx` contains fields and layout.
- `bootstap.ts` configures and exports `use<Form>`.
- `actions.ts` contains form-specific submission orchestration.
- Create `actions.ts` only when submission does more than invoke one mutation or function, such as formatting payloads or coordinating operations.
- Do not create `actions.ts` only to import, wrap, or re-export one mutation or function.
- `schemas.ts` contains form-specific presentation and payload schemas.
- `codec.ts` transforms between presentation values and payloads.
- `src/schemas/<entity>/` contains reusable response schemas.
- `src/utils/forms.ts` contains shared form helpers.
- Keep optional form files private. Move them only when they gain a consumer outside the form.

#### Data and schemas

- Type responses.
- Create `src/schemas/<entity>/<response>.ts` only when the response needs:
  - runtime validation.
  - normalization or transformation.
  - initial or default values.
- Use Zod `.default()` for response defaults.
- Share response schemas across forms, hooks, and views.
- Keep payload types and schemas inside the form.
- Create a payload schema when it needs runtime validation or differs from the presentation shape.
- Use the fetched response shape as the presentation shape when possible.
- Submit values directly when the presentation and payload shapes match.
- Create a transformer only when the shapes differ.
- Prefer a Zod codec for pure, bidirectional transformations.
- Use functions for one-way, lossy, contextual, or effectful transformations.
- Keep complex payload formatting and coordinated persistence in `actions.ts`.

```tsx
// src/schemas/<entity>/<response>.ts
export type Response = // ...
export const responseSchema: z.ZodType<Response> = z.object({
  <field>: z.string().default(""),
})

// src/components/forms/<Form>/schemas.ts
export type Payload = // ...
export const payloadSchema: z.ZodType<Payload> = z.object({
  <field>: z.string(),
})

// src/components/forms/<Form>/codec.ts
export const formCodec = z.codec(payloadSchema, responseSchema, {
  decode: (payload) => <toPresentationValues>,
  encode: (values) => <toPayload>,
})
```

#### Ownership

- `bootstap.ts` must:
  - configure `initialValues`, `validate`, `transformValues`, and `enhanceGetInputProps`.
  - accept data and configuration only. Do not accept callbacks such as `onSubmit`.
  - define `submit` directly when it only calls one mutation or function.
  - obtain `submit` from `actions.ts` when submission requires orchestration.
  - return `{ form, submit }`. Do not bind `form.onSubmit`.
  - hydrate asynchronous response data with `setInitialValues`, `setValues`, and `resetDirty`.
  - parse response data before hydration when a response schema exists.
  - use shared prop enhancers for lifecycle state such as `disabled`.
- When present, `actions.ts` must:
  - format the mutation payload and persist it.
  - not show notifications, navigate, close UI, or invoke consumer callbacks.
- `presentation.tsx` must:
  - receive the form through a `form` prop.
  - own field layout, state, and presentation.
  - not render `<form>`, fetch data, submit, or own submit triggers.
- The consumer must:
  - import the form and hook from `index.ts`.
  - render `<form>`.
  - declare `handleSubmit` and call `submit` inside it.
  - bind `handleSubmit` with `form.onSubmit`.
  - own submission triggers and effects.

```tsx
// src/components/forms/<Form>/bootstap.ts
export const use<Form> = () => {
	const form = useForm<Response, Payload>({
		initialValues: responseSchema.parse({}),
		validate: schemaResolver(responseSchema, { sync: true }),
		transformValues: (values) => z.encode(formCodec, values),
		enhanceGetInputProps: enhanceInputPropsWithDisable(),
	})
	const submit = useMutation(api.<entity>.<mutation>)

	return { form, submit }
}

// src/components/forms/<Form>/presentation.tsx
export const <Form> = ({ form }: <Form>Props) => (
  <Input {...form.getInputProps("<field>")} />
)

// src/components/forms/<Form>/index.ts
export { use<Form> } from "./bootstap"
export { <Form> } from "./presentation"
```

```tsx
// <Consumer>.tsx
export const Consumer = () => {
	const formRef = useRef<HTMLFormElement>(null)
	const { form, submit } = use<Form>()
	const handleSubmit = async (payload: Payload) => {
		await submit(payload)
		// <runConsumerEffects>
	}

	return (
		<>
			<form ref={formRef} onSubmit={form.onSubmit(handleSubmit)}>
				<Form form={form} />
			</form>
			<Button type="button" onClick={() => formRef.current?.requestSubmit()} />
		</>
	)
}
```

#### References

- Read [`useForm`](https://mantine.dev/form/use-form/) for configuration and values.
- Read [schema validation](https://mantine.dev/form/schema-validation/) for Zod validation.
- Read [`getInputProps`](https://mantine.dev/form/get-input-props) for prop enhancers.
- Read [uncontrolled mode](https://mantine.dev/form/uncontrolled/) before using it.

## Managing and authoring Documentation and Rules

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

## Coding standards

Enforced repo-wide. Non-negotiable.

### Package Manager

**Use `pnpm` only.**

Never use other package manages, like `npm`, `yarn`, or `bun`.

### Turborepo

- **TurboRepo with remote caching**: Use remote caching to ensure fast build and deploy times.
  - subcommands like `<command>:<sub>` should write to the same cache as the parent `<command>`

### Language & module system

- **ESM only**: Use Node 24 or newer for repository tooling and packages unless a managed deployment platform does not support Node 24.
- **Managed runtime exception**: Use the newest Node version supported by the platform and pin the exception in both the package engine and deployment configuration. Firebase Functions must use Node 22 until Firebase supports Node 24.
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

## Conventions

### Reusability & modularization

- **Look for existing components**: Before creating any new component, check the existing component tree.
- Shared hooks live in `hooks/`. Shared state stores in `stores/`. Shared utilities in `utils/`.
- Barrel exports in `components/index.ts` must stay current.
- **Use the dictionary**: Duplicate user-facing strings are a defect. All strings live in `data/locale/en.ts`.

## Working with Git

### History management

- Maintain a linear history: Prioritize `rebase` and `squash` over `merge`.
- Never take credit for code authoring. The author is always the developer.
- Don't ever sign commits.

### Branch management

- **`main` branch is locked**: Never push to `main` directly, instead create a branch and a PR.
- Strictly adhere to **[conventional branches](conventionalbranch.org/#specification)**.
- Branch names can never be called `<ai-agent-name>/*`. They have to strictly follow the conventional names.

### Commit strategy

- Strictly adhere to **[conventional commits](conventionalcommits.org/en/v1.0.0/#specification)**
- Conventional multi-line messages: subject < 70 chars in imperative mood; body explains why.
- Always group related changes logically and split unrelated work. Do not do a big single commit. Do not commit atomically.
- Never amend pushed commits without explicit approval. Never --no-verify.
- Run the full `lint`, `format`, `typecheck`, and `test` suite before committing code.

### Pull-requests

- Use `gh auth switch -u <GH_USER>`: Always use the `GH_USER` secret declared in `.env.agents` to work with the gh cli.

## Secrets and environmet variables

- **Never** print secrets in `.env` files, nor environmental variables, keys, secrets, etc...
- Always keep the `.env.example` of every package up to date.
- `.env.example` must be segmented by platform like:

  ```env
  # ——————————————————————————————————————————————————————————————————————————
  # ——— <Platform>: <What is this patform used for?>

  # Use   : <What is this variable used for?>
  # Source: <Where to get it from?>
  # Path  : <Path > of > Nested > Menu > Items >
  # E.g.  : <example value or recommended default>
  <ENV_VAR_NAME>=<Recommended default or empty>
  ...
  ```

- `.env.agents` is meant to be read by agents. Never put secrets that are neede by other processes inside of it.

## State Management

Always use **Zustand** for all client-side global state managment.
If Zustand is not installed as a dependency in the project, install it.
Do not use React Context for state that is read by many components or updated frequently.

### Managing state with Zustand

Always follow these rules to manage state with Zustand:

- Each store lives in its own file under `stores/` named `use<Domain>Store.ts` (e.g. `stores/useCartStore.ts`).
- Keep stores minimal — only state that must be shared across unrelated components belongs in a store. Prefer co-located `useState` / `useReducer` for component-local state.
- Use **slices pattern** when a store grows beyond ~5 actions: split into slice creators and combine them in the store file.
- Always define a TypeScript interface for the store shape and use `create<StoreShape>()`.
- Derive computed values with selectors, not stored duplicates: `const total = useCartStore(s => s.items.length)`.
- Prefer **atomic selectors** over selecting the entire store to avoid unnecessary re-renders.
- Persist state to `localStorage` only when explicitly required (e.g. cart, theme preference) using Zustand's `persist` middleware.

## Testing

- Create tests only when:
  1. The user explicitly requests them.
  2. The user explicitly approves an agent's testing proposal.
- Do not create tests based only on risk, convention, coverage, or implementation changes.
- Agents may suggest tests when they would protect critical behavior.
- Present the proposed scope, cases, and test type before requesting approval.
- Run existing relevant tests after implementation changes without requiring approval.
- Write test stories, cases, and descriptions in assertive language.
- Describe the behavior a passing test guarantees.
- Write user stories as:
  - `As a <role>, I can <action> to <result>.`

### Tests structure

- Define each test with:
  1. A story or description.
  2. The behavior being tested.
  3. Passing and failing cases.
- Prefer the smallest test type that proves the behavior.
- Test observable behavior through public interfaces.
- Do not test implementation details.
- Keep tests deterministic, isolated, and repeatable.
- Give each test one clear reason to fail.
- Do not duplicate the same assertion across test types.

#### Data for input and seeding

- Use input data for values supplied during the tested action.
- Use seed data for state created by earlier or unrelated processes.
- Share `input.json` and `seed.json` across tests in the same domain.
- Use predictable values and never store secrets.
- Remove records created by a test, including after failures.
- Never change or remove data the test did not create.

#### Folder structure

```text
<domain>/
  <filename>.test.ts
  input.json
  seed.json
```

### Writing tests

1. Name the test file according to what it tests, using a short descriptive filename.
2. Discover the passing, failing, invalid, empty, and boundary cases that matter.
3. Define the observable result for each case.
4. Write the story as  jsdoc, for the corresponding group of tests for the flow.
5. Use assertive language to write:
   1. The description of the group, using the result and role.
   2. The description of each test form the action.

```ts
// <domain>/<filename>.test.ts

/** As a [role], I want to [action], to [result] */
describe(`to [result] as a [role], I...`, () => {
  test(`can [passing-action]`, () => {})
  test(`can't [failing-action]`, () => {})
  ...
})
```

### End-to-end tests

- Use Playwright.
- Assert outcomes visible to the user.
- Validate complete user flows through the browser.
- Validate:
  - Layout and visible state.
  - User interaction.
  - Route changes.
  - Application integrations.
  - Successful outcomes.
  - Expected failures.
- Seed only the state required by the story.
- Keep input and seed data at the nearest shared story scope.
- Use Playwright test agents to plan, generate, and repair tests.
- Do not use a test repair to hide a product defect.

When writting tests with Playwright, always review these tools and choose most convenient one:
- [paywright cli](http://playwright.dev/agent-cli/introduction)
- [playwright mcp server](https://playwright.dev/mcp/introduction)
- [playwright agents](https://playwright.dev/docs/test-agents)

### Unit tests

- Use unit tests for critical code in isolation.
- Give each unit test group a concise behavior description.
- Test critical:
  - Authentication and authorization.
  - Permissions.
  - Monetary calculations.
  - Data integrity.
  - Destructive actions.
  - State transitions.
  - Parsing and normalization.
  - Error translation.
- Do not unit test:
  - Framework behavior.
  - Generated code.
  - Static configuration.
  - Thin wrappers or adapters.
  - Trivial CRUD behavior.
  - Constants or type-only code.
- Use static input and seed data for provider-independent logic.
- Do not use fixtures, stubs, or mocks to imitate third-party services.
- Test third-party integrations against the real service in a separate integration suite.
- Use provider test modes, sandboxes, or dedicated test accounts.
- Skip provider tests when required credentials are unavailable.
- Never fall back to mocked provider behavior.

### Component tests

- Test components through Storybook stories.
- Use the story, tests, and cases structure.
- Prefer testing atoms and molecules.
- Test larger components only when their owned behavior cannot be proven at a smaller level.
- Do not test organisms, templates, or pages only to confirm that React or Next.js renders them.
- Use render-only stories for static visual states.
- Add Storybook interaction tests only for meaningful interaction.
- Validate:
  - Visual states.
  - User interaction.
  - Keyboard behavior.
  - Accessible names, roles, and states.
  - Relevant layout changes.
- Keep stories deterministic, isolated, and safe to rerun.
- Do not depend on mutable external state.
- Use Storybook args for component states and cases.
- Keep stories beside their component.

### Verification

- Run only the suites relevant to the changed or approved tests.
- Run integration tests only when provider credentials are available.
- Report product defects separately from test defects.
- Report provider outages and rate limits separately from product failures.
- Do not weaken assertions to make a failing test pass.

## Documentation Index

### roadmaps

- [Authenticated editor application roadmap](roadmaps/app.md): Delivery plan for authentication, subscription gating, document APIs, and the Tiptap workspace in @leadtech/app.
- [Firebase Functions roadmap](roadmaps/functions.md): Delivery plan for verified Stripe webhook processing and Firestore entitlement projection in @leadtech/functions.
- [Integration contracts and parallel delivery plan](roadmaps/integration-contracts.md): Canonical boundaries, API contracts, persistence schemas, and sequencing for the Leadtech take-home implementation.
- [Marketing website roadmap](roadmaps/website.md): Delivery plan for the public conversion surface in the @leadtech/website workspace.
