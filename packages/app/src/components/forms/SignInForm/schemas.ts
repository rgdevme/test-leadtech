import { z } from "zod"

import type { Dictionary } from "@/i18n/getDictionary"

export type SignInFormValues = {
	email: string
	password: string
}

export const createSignInFormSchema = (
	errors: Dictionary["workspace"]["auth"]["errors"]
): z.ZodType<SignInFormValues> =>
	z.object({
		email: z.email(errors.invalidEmail),
		password: z.string().min(1, errors.passwordRequired)
	})
