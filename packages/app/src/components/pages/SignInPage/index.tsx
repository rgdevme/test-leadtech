"use client"

import { FirebaseError } from "firebase/app"
import { useRouter } from "next/navigation"
import { useState, type PropsWithChildren } from "react"

import { Button } from "@/components/atoms/Button"
import { Link } from "@/components/atoms/Link"
import { Text } from "@/components/atoms/Text"
import { SignInForm, useSignInForm, type SignInFormValues } from "@/components/forms/SignInForm"
import { AuthTemplate } from "@/components/templates/AuthTemplate"
import { useLocale } from "@/hooks/useLocale"
import { routes } from "@/i18n/routes"
import { ApiClientError } from "@/utils/apiClient"
import styles from "./index.module.css"

type SignInPageProps = PropsWithChildren<{
	intent?: "subscribe"
	planKey?: string
	sessionExpired?: boolean
}>

const translateError = (error: unknown, copy: ReturnType<typeof useLocale>["dictionary"]) => {
	if (error instanceof ApiClientError && error.code === "rate_limited") {
		return copy.workspace.auth.errors.tooManyAttempts
	}
	if (error instanceof FirebaseError) {
		if (error.code === "auth/too-many-requests") {
			return copy.workspace.auth.errors.tooManyAttempts
		}
		if (error.code === "auth/invalid-credential" || error.code === "auth/user-not-found") {
			return copy.workspace.auth.errors.invalidCredentials
		}
	}

	return copy.workspace.auth.errors.generic
}

export const SignInPage = ({ intent, planKey, sessionExpired = false }: SignInPageProps) => {
	const { dictionary, locale } = useLocale()
	const { form, submit } = useSignInForm()
	const router = useRouter()
	const [error, setError] = useState<string | null>(
		sessionExpired ? dictionary.workspace.auth.errors.sessionExpired : null
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
			router.replace(`${routes.documents(locale)}${query.size > 0 ? `?${query.toString()}` : ""}`)
			router.refresh()
		} catch (submitError) {
			setError(translateError(submitError, dictionary))
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
			description={dictionary.workspace.auth.signIn.description}
			title={dictionary.workspace.auth.signIn.title}>
			<form onSubmit={form.onSubmit(handleSubmit)}>
				<SignInForm form={form} />
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
						? dictionary.workspace.auth.signIn.submitting
						: dictionary.workspace.auth.signIn.submit}
				</Button>
			</form>
			<Text
				className={styles.text}
				unstyled>
				{dictionary.workspace.auth.signIn.alternatePrompt}{" "}
				<Link
					href={`${routes.signUp(locale)}${signUpQuery.size > 0 ? `?${signUpQuery.toString()}` : ""}`}>
					{dictionary.workspace.auth.signIn.alternateAction}
				</Link>
			</Text>
		</AuthTemplate>
	)
}
