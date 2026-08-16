import type { Metadata } from "next"
import type { ReactNode } from "react"

import favicon from "@leadtech/common/assets/favicon.svg"
import { brandLocale } from "@leadtech/common/data/locale/en"

import "./globals.css"

export const metadata: Metadata = {
	title: {
		default: brandLocale.name,
		template: `%s · ${brandLocale.name}`
	},
	description: "A quiet, dependable writing workspace.",
	icons: { icon: favicon.src }
}

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
	return (
		<html
			data-scroll-behavior='smooth'
			lang='en'>
			<body>{children}</body>
		</html>
	)
}
