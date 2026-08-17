"use client"

import { FirebaseError } from "firebase/app"
import { useRouter } from "next/navigation"
import { useState, type PropsWithChildren } from "react"

import { Button } from "@/components/atoms/Button"
import { Link } from "@/components/atoms/Link"
import { Text } from "@/components/atoms/Text"
import { SignUpForm, useSignUpForm, type SignUpFormValues } from "@/components/forms/SignUpForm"
import { AuthTemplate } from "@/components/templates/AuthTemplate"
import { useLocale } from "@/hooks/useLocale"
import { routes } from "@/i18n/routes"
import { ApiClientError } from "@/utils/apiClient"
import styles from "./index.module.css"

type SignUpPageProps = PropsWithChildren<{
	intent?: "subscribe"
	planKey?: string
}>

const translateError = (error: unknown, copy: ReturnType<typeof useLocale>["dictionary"]) => {
	if (error instanceof ApiClientError && error.code === "rate_limited") {
		return copy.workspace.auth.errors.tooManyAttempts
	}
	if (error instanceof FirebaseError) {
		if (error.code === "auth/email-already-in-use") {
			return copy.workspace.auth.errors.emailInUse
		}
		if (error.code === "auth/weak-password") {
			return copy.workspace.auth.errors.weakPassword
		}
		if (error.code === "auth/too-many-requests") {
			return copy.workspace.auth.errors.tooManyAttempts
		}
	}

	return copy.workspace.auth.errors.generic
}

export const SignUpPage = ({ intent, planKey }: SignUpPageProps) => {
	const { dictionary, locale } = useLocale()
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
			router.replace(`${routes.documents(locale)}${query.size > 0 ? `?${query.toString()}` : ""}`)
			router.refresh()
		} catch (submitError) {
			setError(translateError(submitError, dictionary))
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
			description={dictionary.workspace.auth.signUp.description}
			title={dictionary.workspace.auth.signUp.title}>
			<form onSubmit={form.onSubmit(handleSubmit)}>
				<SignUpForm form={form} />
				{error ? (
					<Text
						className={styles.error}
						role='alert'
						unstyled>
						{error}
					</Text>
				) : null}
				<Button
					className={styles.action}
					loading={form.submitting}
					type='submit'>
					{form.submitting
						? dictionary.workspace.auth.signUp.submitting
						: dictionary.workspace.auth.signUp.submit}
				</Button>
			</form>
			<Text
				className={styles.text}
				unstyled>
				{dictionary.workspace.auth.signUp.alternatePrompt}{" "}
				<Link
					href={`${routes.signIn(locale)}${signInQuery.size > 0 ? `?${signInQuery.toString()}` : ""}`}>
					{dictionary.workspace.auth.signUp.alternateAction}
				</Link>
			</Text>
		</AuthTemplate>
	)
}
