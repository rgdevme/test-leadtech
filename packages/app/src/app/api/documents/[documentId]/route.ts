import { documentIdSchema, updateDocumentRequestSchema } from "@leadtech/contracts"
import { NextResponse } from "next/server"

import { ApiError } from "@/errors/apiError"
import { requireSessionPrincipal } from "@/guards/authentication"
import { getDocument } from "@/repositories/documents"
import { deleteOwnedDocument, updateOwnedDocument } from "@/services/documents"
import { assertTrustedOrigin, handleRoute, noStoreHeaders, parseJsonRequest } from "@/utils/http"

type RouteContext = {
	params: Promise<{ documentId: string }>
}

const parseDocumentId = async ({ params }: RouteContext) => {
	const result = documentIdSchema.safeParse((await params).documentId)
	if (!result.success) {
		throw new ApiError(400, "invalid_request", "The document identifier is invalid.")
	}

	return result.data
}

export const GET = (_request: Request, context: RouteContext) =>
	handleRoute(async () => {
		const principal = await requireSessionPrincipal()
		const documentId = await parseDocumentId(context)
		const document = await getDocument(principal.uid, documentId)

		if (!document) {
			throw new ApiError(404, "not_found", "Document not found.")
		}

		return NextResponse.json(document, { headers: noStoreHeaders })
	})

export const PATCH = (request: Request, context: RouteContext) =>
	handleRoute(async () => {
		assertTrustedOrigin(request)
		const principal = await requireSessionPrincipal()
		const documentId = await parseDocumentId(context)
		const update = await parseJsonRequest(request, updateDocumentRequestSchema)
		const document = await updateOwnedDocument(principal.uid, documentId, update)
		return NextResponse.json(document, { headers: noStoreHeaders })
	})

export const DELETE = (request: Request, context: RouteContext) =>
	handleRoute(async () => {
		assertTrustedOrigin(request)
		const principal = await requireSessionPrincipal()
		const documentId = await parseDocumentId(context)
		await deleteOwnedDocument(principal.uid, documentId)
		return new NextResponse(null, { status: 204, headers: noStoreHeaders })
	})
