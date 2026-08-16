"use client"

import { FirebaseError } from "firebase/app"
import { useRouter } from "next/navigation"
import { useState, type PropsWithChildren } from "react"

import { Button } from "@/components/atoms/Button"
import { Link } from "@/components/atoms/Link"
import { Text } from "@/components/atoms/Text"
import { SignUpForm, useSignUpForm, type SignUpFormValues } from "@/components/forms/SignUpForm"
import { AuthTemplate } from "@/components/templates/AuthTemplate"
import { en } from "@/data/locale/en"
import { ApiClientError } from "@/utils/apiClient"

type SignUpPageProps = PropsWithChildren<{
	intent?: "subscribe"
	planKey?: string
}>

const translateError = (error: unknown) => {
	if (error instanceof ApiClientError && error.code === "rate_limited") {
		return en.auth.errors.tooManyAttempts
	}
	if (error instanceof FirebaseError) {
		if (error.code === "auth/email-already-in-use") {
			return en.auth.errors.emailInUse
		}
		if (error.code === "auth/weak-password") {
			return en.auth.errors.weakPassword
		}
		if (error.code === "auth/too-many-requests") {
			return en.auth.errors.tooManyAttempts
		}
	}

	return en.auth.errors.generic
}

export const SignUpPage = ({ intent, planKey }: SignUpPageProps) => {
	const { form, submit } = useSignUpForm()
	const router = useRouter()
	const [error, setError] = useState<string | null>(null)

	const handleSubmit = async (values: SignUpFormValues) => {
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

	const signInQuery = new URLSearchParams()
	if (intent === "subscribe") {
		signInQuery.set("intent", "subscribe")
		if (planKey) {
			signInQuery.set("plan", planKey)
		}
	}

	return (
		<AuthTemplate
			description={en.auth.signUp.description}
			title={en.auth.signUp.title}>
			<form onSubmit={form.onSubmit(handleSubmit)}>
				<SignUpForm form={form} />
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
					{form.submitting ? en.auth.signUp.submitting : en.auth.signUp.submit}
				</Button>
			</form>
			<Text
				className='mt-6 text-center text-sm text-sage-600'
				unstyled>
				{en.auth.signUp.alternatePrompt}{" "}
				<Link href={`/sign-in${signInQuery.size > 0 ? `?${signInQuery.toString()}` : ""}`}>
					{en.auth.signUp.alternateAction}
				</Link>
			</Text>
		</AuthTemplate>
	)
}
