import type { Locale } from "@/i18n/config"
import type { en } from "@/data/locale/en"

export type Dictionary = typeof en

export const getDictionary = async (locale: Locale): Promise<Dictionary> => {
	const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
		en: () => import("@/data/locale/en").then(({ en }) => en)
	}

	return dictionaries[locale]()
}
