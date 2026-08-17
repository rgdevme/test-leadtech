"use client"

import type { PropsWithChildren } from "react"

import type { UseFormReturnType } from "@mantine/form"

import { Input } from "@/components/atoms/Input"
import { FormField } from "@/components/molecules/FormField"
import { useLocale } from "@/hooks/useLocale"
import type { SignUpFormValues } from "./schemas"
import styles from "./presentation.module.css"

type SignUpFormProps = PropsWithChildren<{
	form: UseFormReturnType<SignUpFormValues>
}>

export const SignUpForm = ({ form }: SignUpFormProps) => {
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
					autoComplete='new-password'
					id='password'
					placeholder={dictionary.workspace.auth.fields.passwordPlaceholder}
					type='password'
					{...form.getInputProps("password")}
				/>
			</FormField>
			<FormField
				error={form.errors.confirmPassword}
				label={dictionary.workspace.auth.fields.confirmPassword}
				name='confirmPassword'>
				<Input
					autoComplete='new-password'
					id='confirmPassword'
					placeholder={dictionary.workspace.auth.fields.passwordPlaceholder}
					type='password'
					{...form.getInputProps("confirmPassword")}
				/>
			</FormField>
		</div>
	)
}
