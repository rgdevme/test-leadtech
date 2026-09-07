import { z } from "zod"

export const spellcheckResponseSchema = z.object({
	misspellings: z.array(
		z.object({
			suggestions: z.array(z.string()),
			word: z.string()
		})
	)
})

export type SpellcheckResponse = z.infer<typeof spellcheckResponseSchema>
