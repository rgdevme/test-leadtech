"use client"

import { apiErrorResponseSchema } from "@leadtech/contracts"
import type { z } from "zod"

export class ApiClientError extends Error {
	readonly code: string
	readonly response: Response

	constructor(code: string, message: string, response: Response) {
		super(message)
		this.name = "ApiClientError"
		this.code = code
		this.response = response
	}
}

const parseError = async (response: Response) => {
	try {
		const parsed = apiErrorResponseSchema.safeParse(await response.json())
		if (parsed.success) {
			return new ApiClientError(parsed.data.error.code, parsed.data.error.message, response)
		}
	} catch {
		return new ApiClientError("internal_error", "The request could not be completed.", response)
	}

	return new ApiClientError("internal_error", "The request could not be completed.", response)
}

export const requestJson = async <Schema extends z.ZodType>(
	input: RequestInfo | URL,
	init: RequestInit,
	schema: Schema
): Promise<z.infer<Schema>> => {
	const response = await fetch(input, init)
	if (!response.ok) {
		throw await parseError(response)
	}

	return schema.parse(await response.json()) as z.infer<Schema>
}

export const requestNoContent = async (input: RequestInfo | URL, init: RequestInit) => {
	const response = await fetch(input, init)
	if (!response.ok) {
		throw await parseError(response)
	}
}
