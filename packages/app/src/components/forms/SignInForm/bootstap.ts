"use client"

import { signInWithEmailAndPassword, signOut } from "firebase/auth"
import { useForm } from "@mantine/form"

import { firebaseAuth, prepareFirebaseAuth } from "@/firebase/client"
import { useLocale } from "@/hooks/useLocale"
import { requestJson, requestNoContent } from "@/utils/apiClient"
import { enhanceInputPropsWithDisable, validateFormWith } from "@/utils/forms"
import { csrfTokenResponseSchema } from "@leadtech/common/contracts"
import { createSignInFormSchema, type SignInFormValues } from "./schemas"

const createSession = async ({ email, password }: SignInFormValues) => {
	await prepareFirebaseAuth()
	const csrf = await requestJson(
		"/api/auth/csrf",
		{ method: "GET", cache: "no-store" },
		csrfTokenResponseSchema
	)
	const credential = await signInWithEmailAndPassword(firebaseAuth, email, password)
	const idToken = await credential.user.getIdToken(true)

	try {
		await requestNoContent("/api/auth/session", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ idToken, csrfToken: csrf.csrfToken })
		})
	} finally {
		await signOut(firebaseAuth)
	}
}

export const useSignInForm = () => {
	const { dictionary } = useLocale()
	const form = useForm<SignInFormValues>({
		mode: "controlled",
		initialValues: { email: "", password: "" },
		validate: validateFormWith(createSignInFormSchema(dictionary.workspace.auth.errors)),
		enhanceGetInputProps: enhanceInputPropsWithDisable()
	})

	return { form, submit: createSession }
}
