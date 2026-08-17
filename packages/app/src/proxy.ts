import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

import { defaultLocale, locales } from "@/i18n/config"

export const proxy = (request: NextRequest) => {
	const { pathname } = request.nextUrl
	const hasLocale = locales.some(
		locale => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
	)

	if (hasLocale) {
		return NextResponse.next()
	}

	const redirectUrl = request.nextUrl.clone()
	redirectUrl.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`

	return NextResponse.redirect(redirectUrl)
}

export const config = {
	matcher: ["/((?!_next|api|opengraph-image|.*\\..*).*)"]
}
