import NextLink, { type LinkProps as NextLinkProps } from "next/link"
import type { AnchorHTMLAttributes, PropsWithChildren } from "react"
import styles from "./index.module.css"

type LinkProps = PropsWithChildren<NextLinkProps & AnchorHTMLAttributes<HTMLAnchorElement>>

export const Link = ({ children, className = "", ...props }: LinkProps) => (
	<NextLink
		className={[styles.link, className].filter(Boolean).join(" ")}
		{...props}>
		{children}
	</NextLink>
)
