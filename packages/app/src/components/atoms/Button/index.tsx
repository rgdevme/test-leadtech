import type { ButtonHTMLAttributes, PropsWithChildren } from "react"

import { Spinner } from "@/components/atoms/Spinner"

type ButtonVariant = "primary" | "secondary" | "quiet" | "danger"

type ButtonProps = PropsWithChildren<
	ButtonHTMLAttributes<HTMLButtonElement> & {
		loading?: boolean
		variant?: ButtonVariant
	}
>

const variantClasses: Record<ButtonVariant, string> = {
	primary: "border-yellow-400 bg-yellow-400 text-sage-950 hover:bg-yellow-300",
	secondary: "border-sage-200 bg-sage-50 text-sage-950 hover:bg-sage-100",
	quiet: "border-sage-950/0 bg-sage-50/0 text-sage-600 hover:bg-sage-100 hover:text-sage-950",
	danger: "border-red-50 bg-red-50 text-red-700 hover:border-red-700"
}

export const Button = ({
	children,
	className = "",
	disabled,
	loading = false,
	type = "button",
	variant = "primary",
	...props
}: ButtonProps) => (
	<button
		className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-[6px] border px-4 py-2.5 text-sm font-semibold transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 ${variantClasses[variant]} ${className}`}
		disabled={disabled || loading}
		type={type}
		{...props}>
		{loading ? <Spinner size='small' /> : null}
		{children}
	</button>
)
