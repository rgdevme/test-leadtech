import { z } from "zod"

export const apiErrorCodes = [
	"unauthenticated",
	"forbidden",
	"subscription_required",
	"invalid_request",
	"not_found",
	"conflict",
	"rate_limited",
	"upstream_error",
	"internal_error"
] as const

export const apiErrorCodeSchema = z.enum(apiErrorCodes)

export type ApiErrorCode = z.infer<typeof apiErrorCodeSchema>

export type JsonPrimitive = string | number | boolean | null

export type JsonValue = JsonPrimitive | JsonObject | JsonValue[]

export type JsonObject = {
	[key: string]: JsonValue
}

export const apiErrorResponseSchema = z.object({
	error: z.object({
		code: apiErrorCodeSchema,
		message: z.string(),
		fieldErrors: z.record(z.string(), z.array(z.string())).optional(),
		requestId: z.string()
	})
})

export type ApiErrorResponse = z.infer<typeof apiErrorResponseSchema>
