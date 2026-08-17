import { NextResponse } from "next/server"

import { requireSessionPrincipal } from "@/guards/authentication"
import { publicSubscriptionPlans } from "@/data/subscriptionPlans"
import { handleRoute, noStoreHeaders } from "@/utils/http"

export const dynamic = "force-dynamic"

export const GET = () =>
	handleRoute(async () => {
		await requireSessionPrincipal()
		return NextResponse.json({ items: publicSubscriptionPlans }, { headers: noStoreHeaders })
	})
