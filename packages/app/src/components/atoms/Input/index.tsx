import type { InputHTMLAttributes, PropsWithChildren } from "react"

type InputProps = PropsWithChildren<InputHTMLAttributes<HTMLInputElement>>

export const Input = ({ className = "", ...props }: InputProps) => (
	<input
		className={`min-h-12 w-full rounded-lg border border-sage-200 bg-sage-50 px-3.5 py-2.5 text-[0.95rem] text-sage-950 outline-none transition placeholder:text-sage-400 focus:border-sage-950 focus:ring-2 focus:ring-sage-950/5 disabled:cursor-not-allowed disabled:bg-sage-100 disabled:text-sage-600 ${className}`}
		{...props}
	/>
)
