import type { ButtonHTMLAttributes, PropsWithChildren } from "react"

type IconButtonProps = PropsWithChildren<
	ButtonHTMLAttributes<HTMLButtonElement> & {
		label: string
	}
>

export const IconButton = ({
	children,
	className = "",
	label,
	type = "button",
	...props
}: IconButtonProps) => (
	<button
		aria-label={label}
		className={`inline-grid size-10 place-items-center rounded-[6px] border border-sage-950/0 text-sage-600 transition hover:border-sage-200 hover:bg-sage-50 hover:text-sage-950 active:scale-[0.96] disabled:cursor-not-allowed disabled:opacity-40 ${className}`}
		title={label}
		type={type}
		{...props}>
		{children}
	</button>
)
