"use client"

import { createUserWithEmailAndPassword, signOut } from "firebase/auth"
import { useForm } from "@mantine/form"

import { csrfTokenResponseSchema } from "@leadtech/common/contracts"

import { firebaseAuth, prepareFirebaseAuth } from "@/firebase/client"
import { useLocale } from "@/hooks/useLocale"
import { requestJson, requestNoContent } from "@/utils/apiClient"
import { enhanceInputPropsWithDisable, validateFormWith } from "@/utils/forms"
import { createSignUpFormSchema, type SignUpFormValues } from "./schemas"

const createAccount = async ({ email, password }: SignUpFormValues) => {
	await prepareFirebaseAuth()
	const csrf = await requestJson(
		"/api/auth/csrf",
		{ method: "GET", cache: "no-store" },
		csrfTokenResponseSchema
	)
	const credential = await createUserWithEmailAndPassword(firebaseAuth, email, password)
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

export const useSignUpForm = () => {
	const { dictionary } = useLocale()
	const form = useForm<SignUpFormValues>({
		mode: "controlled",
		initialValues: { email: "", password: "", confirmPassword: "" },
		validate: validateFormWith(createSignUpFormSchema(dictionary.workspace.auth.errors)),
		enhanceGetInputProps: enhanceInputPropsWithDisable()
	})

	return { form, submit: createAccount }
}
