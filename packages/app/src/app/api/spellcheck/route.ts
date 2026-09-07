import { Buffer } from "node:buffer"

import dictionary from "dictionary-en"
import { NextResponse } from "next/server"
import nspell from "nspell"
import { z } from "zod"

import { requireSessionPrincipal } from "@/guards/authentication"
import type { SpellcheckResponse } from "@/schemas/spellcheck/response"
import {
	assertTrustedOrigin,
	handleRoute,
	noStoreHeaders,
	parseJsonRequest
} from "@/utils/http"

const spellcheckRequestSchema = z.object({
	words: z.array(z.string().trim().min(1).max(64)).min(1).max(200)
})

const englishSpellchecker = nspell({
	aff: Buffer.from(dictionary.aff),
	dic: Buffer.from(dictionary.dic)
})

export const dynamic = "force-dynamic"

export const POST = (request: Request) =>
	handleRoute(async () => {
		assertTrustedOrigin(request)
		await requireSessionPrincipal()
		const { words } = await parseJsonRequest(request, spellcheckRequestSchema)
		const uniqueWords = [...new Set(words)]
		const misspellings: SpellcheckResponse["misspellings"] = []

		for (const word of uniqueWords) {
			if (!englishSpellchecker.correct(word)) {
				misspellings.push({
					suggestions: englishSpellchecker.suggest(word).slice(0, 5),
					word
				})
			}
		}

		return NextResponse.json({ misspellings } satisfies SpellcheckResponse, {
			headers: noStoreHeaders
		})
	})
