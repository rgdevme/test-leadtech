import NextLink, { type LinkProps } from "next/link"
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, PropsWithChildren } from "react"

import { Spinner } from "@/components/atoms/Spinner"
import styles from "./index.module.css"

type ButtonVariant = "danger" | "primary" | "quiet" | "secondary" | "text"

type SharedButtonProps = {
	className?: string
	showArrow?: boolean
	variant?: ButtonVariant
}

type ButtonLinkProps = SharedButtonProps
	& Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
		href: LinkProps["href"]
		loading?: never
	}

type ButtonActionProps = SharedButtonProps
	& ButtonHTMLAttributes<HTMLButtonElement> & {
		href?: never
		loading?: boolean
	}

type ButtonProps = PropsWithChildren<ButtonActionProps | ButtonLinkProps>

export const Button = (props: ButtonProps) => {
	if ("href" in props && props.href !== undefined) {
		const {
			children,
			className = "",
			href,
			showArrow = true,
			variant = "primary",
			...linkProps
		} = props

		return (
			<NextLink
				{...linkProps}
				className={[styles.button, className].filter(Boolean).join(" ")}
				data-variant={variant}
				href={href}>
				{children}
				{showArrow ? (
					<span
						aria-hidden='true'
						className={styles.icon}>
						↗
					</span>
				) : null}
			</NextLink>
		)
	}

	const {
		children,
		className = "",
		disabled,
		loading = false,
		showArrow = false,
		type = "button",
		variant = "primary",
		...buttonProps
	} = props

	return (
		<button
			{...buttonProps}
			className={[styles.button, className].filter(Boolean).join(" ")}
			data-variant={variant}
			disabled={disabled || loading}
			type={type}>
			{loading ? <Spinner size='small' /> : children}
			{showArrow ? (
				<span
					aria-hidden='true'
					className={styles.icon}>
					↗
				</span>
			) : null}
		</button>
	)
}
