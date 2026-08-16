import NextLink, { type LinkProps as NextLinkProps } from "next/link"
import type { AnchorHTMLAttributes, PropsWithChildren } from "react"

type LinkProps = PropsWithChildren<NextLinkProps & AnchorHTMLAttributes<HTMLAnchorElement>>

export const Link = ({ children, className = "", ...props }: LinkProps) => (
	<NextLink
		className={`text-sm font-semibold text-sage-950 underline decoration-sage-200 underline-offset-4 transition hover:decoration-sage-950 ${className}`}
		{...props}>
		{children}
	</NextLink>
)
