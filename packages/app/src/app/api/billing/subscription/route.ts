import { NextResponse } from "next/server"

import { requireSessionPrincipal } from "@/guards/authentication"
import { getSubscription } from "@/repositories/subscriptions"
import { handleRoute, noStoreHeaders } from "@/utils/http"

export const dynamic = "force-dynamic"

export const GET = () =>
	handleRoute(async () => {
		const principal = await requireSessionPrincipal()
		const subscription = await getSubscription(principal.uid)
		return NextResponse.json(subscription, { headers: noStoreHeaders })
	})
