"use client"

import { spellcheckResponseSchema } from "@/schemas/spellcheck/response"
import { requestJson } from "@/utils/apiClient"

const WORD_BATCH_SIZE = 200

export const checkEnglishWords = async (words: string[]) => {
	const batches = Array.from(
		{ length: Math.ceil(words.length / WORD_BATCH_SIZE) },
		(_, index) => words.slice(index * WORD_BATCH_SIZE, (index + 1) * WORD_BATCH_SIZE)
	)
	const responses = await Promise.all(
		batches.map(wordsBatch =>
			requestJson(
				"/api/spellcheck",
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ words: wordsBatch })
				},
				spellcheckResponseSchema
			)
		)
	)

	return new Map(
		responses.flatMap(response =>
			response.misspellings.map(({ suggestions, word }) => [word, suggestions] as const)
		)
	)
}
