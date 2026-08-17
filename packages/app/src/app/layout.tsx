import type { Metadata, Viewport } from "next"
import type { PropsWithChildren } from "react"

import { applicationUrl } from "@/config/environment"
import { en } from "@/data/locale/en"
import { defaultLocale } from "@/i18n/config"

import "./globals.css"

export const metadata: Metadata = {
	metadataBase: applicationUrl,
	title: en.brand.name,
	description: en.metadata.description
}

export const viewport: Viewport = {
	colorScheme: "light",
	themeColor: "#f2efe6",
	width: "device-width",
	initialScale: 1
}

type RootLayoutProps = PropsWithChildren

const RootLayout = ({ children }: RootLayoutProps) => (
	<html
		data-scroll-behavior='smooth'
		lang={defaultLocale}>
		<body>{children}</body>
	</html>
)

export default RootLayout
