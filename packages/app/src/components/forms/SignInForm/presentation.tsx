"use client"

import type { PropsWithChildren } from "react"

import type { UseFormReturnType } from "@mantine/form"

import { Input } from "@/components/atoms/Input"
import { FormField } from "@/components/molecules/FormField"
import { useLocale } from "@/hooks/useLocale"
import type { SignInFormValues } from "./schemas"
import styles from "./presentation.module.css"

type SignInFormProps = PropsWithChildren<{
	form: UseFormReturnType<SignInFormValues>
}>

export const SignInForm = ({ form }: SignInFormProps) => {
	const { dictionary } = useLocale()

	return (
		<div className={styles.grid}>
			<FormField
				error={form.errors.email}
				label={dictionary.workspace.auth.fields.email}
				name='email'>
				<Input
					autoComplete='email'
					id='email'
					placeholder={dictionary.workspace.auth.fields.emailPlaceholder}
					type='email'
					{...form.getInputProps("email")}
				/>
			</FormField>
			<FormField
				error={form.errors.password}
				label={dictionary.workspace.auth.fields.password}
				name='password'>
				<Input
					autoComplete='current-password'
					id='password'
					placeholder={dictionary.workspace.auth.fields.passwordPlaceholder}
					type='password'
					{...form.getInputProps("password")}
				/>
			</FormField>
		</div>
	)
}
