import { z } from "zod"

import type { Dictionary } from "@/i18n/getDictionary"

export type SignUpFormValues = {
	confirmPassword: string
	email: string
	password: string
}

export const createSignUpFormSchema = (
	errors: Dictionary["workspace"]["auth"]["errors"]
): z.ZodType<SignUpFormValues> =>
	z
		.object({
			email: z.email(errors.invalidEmail),
			password: z.string().min(8, errors.weakPassword),
			confirmPassword: z.string().min(1, errors.confirmPasswordRequired)
		})
		.refine(values => values.password === values.confirmPassword, {
			path: ["confirmPassword"],
			message: errors.passwordMismatch
		})
