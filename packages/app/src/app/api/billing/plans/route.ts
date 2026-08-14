import { NextResponse } from "next/server"

import { requireSessionPrincipal } from "@/guards/authentication"
import { handleRoute, noStoreHeaders } from "@/utils/http"
import { publicSubscriptionPlans } from "@leadtech/contracts"

export const dynamic = "force-dynamic"

export const GET = () =>
	handleRoute(async () => {
		await requireSessionPrincipal()
		return NextResponse.json({ items: publicSubscriptionPlans }, { headers: noStoreHeaders })
	})
