import { NextResponse } from "next/server"

import { requireSessionPrincipal } from "@/guards/authentication"
import { listDocuments } from "@/repositories/documents"
import { createOwnedDocument } from "@/services/documents"
import { assertTrustedOrigin, handleRoute, noStoreHeaders } from "@/utils/http"

export const dynamic = "force-dynamic"

export const GET = () =>
	handleRoute(async () => {
		const principal = await requireSessionPrincipal()
		const items = await listDocuments(principal.uid)
		return NextResponse.json({ items }, { headers: noStoreHeaders })
	})

export const POST = (request: Request) =>
	handleRoute(async () => {
		assertTrustedOrigin(request)
		const principal = await requireSessionPrincipal()
		const document = await createOwnedDocument(principal.uid)
		return NextResponse.json(document, { status: 201, headers: noStoreHeaders })
	})
