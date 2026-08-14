import "server-only"

import { ApiError } from "@/errors/apiError"

type RateLimitEntry = {
	count: number
	resetAt: number
}

const rateLimitGlobal = globalThis as typeof globalThis & {
	sessionRateLimits?: Map<string, RateLimitEntry>
}

const sessionRateLimits = rateLimitGlobal.sessionRateLimits ?? new Map<string, RateLimitEntry>()
rateLimitGlobal.sessionRateLimits = sessionRateLimits

export const assertSessionRateLimit = (request: Request) => {
	const forwardedAddress = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
	const key = forwardedAddress || request.headers.get("x-real-ip") || "local"
	const now = Date.now()
	const current = sessionRateLimits.get(key)

	if (!current || current.resetAt <= now) {
		sessionRateLimits.set(key, { count: 1, resetAt: now + 10 * 60 * 1000 })
		return
	}

	if (current.count >= 10) {
		const retryAfter = Math.max(1, Math.ceil((current.resetAt - now) / 1000))
		throw new ApiError(429, "rate_limited", "Too many sign-in attempts. Try again shortly.", {
			headers: { "Retry-After": String(retryAfter) }
		})
	}

	current.count += 1
}
