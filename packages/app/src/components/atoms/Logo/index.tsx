import logo from "@/assets/logo.svg"
import { en } from "@/data/locale/en"
import Image from "next/image"
import NextLink from "next/link"
import type { PropsWithChildren } from "react"

import styles from "./index.module.css"

type LogoProps = PropsWithChildren<{
	href: string
	inverse?: boolean
	size?: "compact" | "default"
}>

export const Logo = ({ href, inverse = false, size = "default" }: LogoProps) => (
	<NextLink
		aria-label={en.brand.logoLabel}
		className={styles.logo}
		data-inverse={inverse}
		data-size={size}
		href={href}>
		<Image
			alt=''
			aria-hidden='true'
			className={styles.image}
			priority
			src={logo}
		/>
	</NextLink>
)
