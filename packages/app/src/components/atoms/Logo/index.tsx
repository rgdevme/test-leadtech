import logo from "@leadtech/common/assets/logo.svg"
import { brandLocale } from "@leadtech/common/data/locale/en"
import Image from "next/image"
import NextLink from "next/link"
import type { PropsWithChildren } from "react"

import styles from "./index.module.css"

type LogoProps = PropsWithChildren<{
	href: string
	size?: "compact" | "default"
}>

export const Logo = ({ href, size = "default" }: LogoProps) => (
	<NextLink
		aria-label={brandLocale.logoLabel}
		className={styles.logo}
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
