import type { z } from "zod"

export const validateFormWith =
	<Values extends Record<string, unknown>>(schema: z.ZodType<Values>) =>
	(values: Values) => {
		const result = schema.safeParse(values)
		if (result.success) {
			return {}
		}

		return Object.fromEntries(
			Object.entries(result.error.flatten().fieldErrors).flatMap(([field, messages]) => {
				const message = messages?.[0]
				return message ? [[field, message]] : []
			})
		)
	}

export const enhanceInputPropsWithDisable =
	() =>
	({ form }: { form: { submitting: boolean } }) => ({ disabled: form.submitting })
