"use client"

import { signInWithEmailAndPassword, signOut } from "firebase/auth"
import { useForm } from "@mantine/form"

import { firebaseAuth, prepareFirebaseAuth } from "@/firebase/client"
import { requestJson, requestNoContent } from "@/utils/apiClient"
import { enhanceInputPropsWithDisable, validateFormWith } from "@/utils/forms"
import { csrfTokenResponseSchema } from "@leadtech/common/contracts"
import { signInFormSchema, type SignInFormValues } from "./schemas"

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
	const form = useForm<SignInFormValues>({
		mode: "controlled",
		initialValues: { email: "", password: "" },
		validate: validateFormWith(signInFormSchema),
		enhanceGetInputProps: enhanceInputPropsWithDisable()
	})

	return { form, submit: createSession }
}
