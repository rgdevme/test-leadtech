import type { PropsWithChildren, ReactNode } from "react"

type FormFieldProps = PropsWithChildren<{
	error?: ReactNode
	label: string
	name: string
}>

export const FormField = ({ children, error, label, name }: FormFieldProps) => (
	<div className='grid gap-2'>
		<label
			className='text-sm font-semibold text-charcoal'
			htmlFor={name}>
			{label}
		</label>
		{children}
		{error ? (
			<p
				className='text-sm leading-5 text-danger'
				id={`${name}-error`}
				role='alert'>
				{error}
			</p>
		) : null}
	</div>
)
