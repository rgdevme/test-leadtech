import { createCheckoutRequestSchema } from "@leadtech/common/contracts"
import { NextResponse } from "next/server"
import { z } from "zod"

import { ApiError } from "@/errors/apiError"
import { requireSessionPrincipal } from "@/guards/authentication"
import { createSubscriptionCheckout } from "@/services/billing"
import { assertTrustedOrigin, handleRoute, noStoreHeaders, parseJsonRequest } from "@/utils/http"

const idempotencyKeySchema = z.uuid()

export const POST = (request: Request) =>
	handleRoute(async () => {
		assertTrustedOrigin(request)
		const principal = await requireSessionPrincipal()
		const payload = await parseJsonRequest(request, createCheckoutRequestSchema)
		const idempotencyHeader = request.headers.get("idempotency-key")
		const idempotencyKey = idempotencyKeySchema.safeParse(idempotencyHeader)

		if (!idempotencyKey.success) {
			throw new ApiError(400, "invalid_request", "Idempotency-Key must be a UUID.")
		}

		const checkout = await createSubscriptionCheckout(
			principal.uid,
			principal.email,
			payload.planKey,
			idempotencyKey.data
		)

		return NextResponse.json(checkout, { status: 201, headers: noStoreHeaders })
	})
