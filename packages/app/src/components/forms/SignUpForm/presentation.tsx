"use client"

import type { PropsWithChildren } from "react"

import type { UseFormReturnType } from "@mantine/form"

import { Input } from "@/components/atoms/Input"
import { FormField } from "@/components/molecules/FormField"
import { en } from "@/data/locale/en"
import type { SignUpFormValues } from "./schemas"

type SignUpFormProps = PropsWithChildren<{
	form: UseFormReturnType<SignUpFormValues>
}>

export const SignUpForm = ({ form }: SignUpFormProps) => (
	<div className='grid gap-5'>
		<FormField
			error={form.errors.email}
			label={en.auth.fields.email}
			name='email'>
			<Input
				autoComplete='email'
				id='email'
				placeholder={en.auth.fields.emailPlaceholder}
				type='email'
				{...form.getInputProps("email")}
			/>
		</FormField>
		<FormField
			error={form.errors.password}
			label={en.auth.fields.password}
			name='password'>
			<Input
				autoComplete='new-password'
				id='password'
				placeholder={en.auth.fields.passwordPlaceholder}
				type='password'
				{...form.getInputProps("password")}
			/>
		</FormField>
		<FormField
			error={form.errors.confirmPassword}
			label={en.auth.fields.confirmPassword}
			name='confirmPassword'>
			<Input
				autoComplete='new-password'
				id='confirmPassword'
				placeholder={en.auth.fields.passwordPlaceholder}
				type='password'
				{...form.getInputProps("confirmPassword")}
			/>
		</FormField>
	</div>
)
