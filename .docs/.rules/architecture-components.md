---
type: Rule
title: Components architecture
description: Organize and write React components, slots, and forms.
resource: ""
tags:
  - components
  - react
timestamp: 2026-08-03T00:00:00Z
---

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
