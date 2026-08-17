import { NextResponse } from "next/server"

import { requireSessionPrincipal } from "@/guards/authentication"
import { listSubscriptionPlans } from "@/services/subscriptionPlans"
import { handleRoute, noStoreHeaders } from "@/utils/http"

export const dynamic = "force-dynamic"

export const GET = () =>
	handleRoute(async () => {
		await requireSessionPrincipal()
		const plans = await listSubscriptionPlans()
		return NextResponse.json({ items: plans }, { headers: noStoreHeaders })
	})
