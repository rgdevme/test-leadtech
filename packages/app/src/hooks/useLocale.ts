"use client"

import { useParams } from "next/navigation"

import { en } from "@/data/locale/en"
import { isLocale } from "@/i18n/config"

export const useLocale = () => {
	const { locale } = useParams<{ locale: string }>()

	if (!isLocale(locale)) {
		throw new Error(`Unsupported locale: ${locale}`)
	}

	return { dictionary: en, locale }
}
