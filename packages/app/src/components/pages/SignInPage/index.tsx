"use client"

import { FirebaseError } from "firebase/app"
import { useRouter } from "next/navigation"
import { useState, type PropsWithChildren } from "react"

import { Button } from "@/components/atoms/Button"
import { Link } from "@/components/atoms/Link"
import { Text } from "@/components/atoms/Text"
import { SignInForm, useSignInForm, type SignInFormValues } from "@/components/forms/SignInForm"
import { AuthTemplate } from "@/components/templates/AuthTemplate"
import { en } from "@/data/locale/en"
import { ApiClientError } from "@/utils/apiClient"

type SignInPageProps = PropsWithChildren<{
	intent?: "subscribe"
	planKey?: string
	sessionExpired?: boolean
}>

const translateError = (error: unknown) => {
	if (error instanceof ApiClientError && error.code === "rate_limited") {
		return en.auth.errors.tooManyAttempts
	}
	if (error instanceof FirebaseError) {
		if (error.code === "auth/too-many-requests") {
			return en.auth.errors.tooManyAttempts
		}
		if (error.code === "auth/invalid-credential" || error.code === "auth/user-not-found") {
			return en.auth.errors.invalidCredentials
		}
	}

	return en.auth.errors.generic
}

export const SignInPage = ({ intent, planKey, sessionExpired = false }: SignInPageProps) => {
	const { form, submit } = useSignInForm()
	const router = useRouter()
	const [error, setError] = useState<string | null>(
		sessionExpired ? en.auth.errors.sessionExpired : null
	)

	const handleSubmit = async (values: SignInFormValues) => {
		setError(null)
		try {
			await submit(values)
			const query = new URLSearchParams()
			if (intent === "subscribe") {
				query.set("intent", "subscribe")
				if (planKey) {
					query.set("plan", planKey)
				}
			}
			router.replace(`/documents${query.size > 0 ? `?${query.toString()}` : ""}`)
			router.refresh()
		} catch (submitError) {
			setError(translateError(submitError))
		}
	}

	const signUpQuery = new URLSearchParams()
	if (intent === "subscribe") {
		signUpQuery.set("intent", "subscribe")
		if (planKey) {
			signUpQuery.set("plan", planKey)
		}
	}

	return (
		<AuthTemplate
			description={en.auth.signIn.description}
			title={en.auth.signIn.title}>
			<form onSubmit={form.onSubmit(handleSubmit)}>
				<SignInForm form={form} />
				{error ? (
					<Text
						className='mt-5 text-sm text-red-700'
						role='alert'
						unstyled>
						{error}
					</Text>
				) : null}
				<Button
					className='mt-7 w-full'
					loading={form.submitting}
					type='submit'>
					{form.submitting ? en.auth.signIn.submitting : en.auth.signIn.submit}
				</Button>
			</form>
			<Text
				className='mt-6 text-center text-sm text-sage-600'
				unstyled>
				{en.auth.signIn.alternatePrompt}{" "}
				<Link href={`/sign-up${signUpQuery.size > 0 ? `?${signUpQuery.toString()}` : ""}`}>
					{en.auth.signIn.alternateAction}
				</Link>
			</Text>
		</AuthTemplate>
	)
}
