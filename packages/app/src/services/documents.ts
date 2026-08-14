import "server-only"

import type { UpdateDocumentRequest } from "@leadtech/contracts"

import { ApiError } from "@/errors/apiError"
import { requireMutationEntitlement } from "@/guards/subscription"
import {
	createDocument as createDocumentRecord,
	deleteDocument as deleteDocumentRecord,
	DocumentNotFoundError,
	DocumentVersionConflictError,
	getDocument,
	updateDocument as updateDocumentRecord
} from "@/repositories/documents"

export const createOwnedDocument = async (uid: string) => {
	await requireMutationEntitlement(uid)
	return createDocumentRecord(uid)
}

export const updateOwnedDocument = async (
	uid: string,
	documentId: string,
	update: UpdateDocumentRequest
) => {
	const existing = await getDocument(uid, documentId)
	if (!existing) {
		throw new ApiError(404, "not_found", "Document not found.")
	}

	await requireMutationEntitlement(uid)

	try {
		return await updateDocumentRecord(uid, documentId, update)
	} catch (error) {
		if (error instanceof DocumentNotFoundError) {
			throw new ApiError(404, "not_found", "Document not found.", { cause: error })
		}
		if (error instanceof DocumentVersionConflictError) {
			throw new ApiError(409, "conflict", error.message, {
				cause: error,
				headers: { "X-Document-Version": String(error.currentVersion) }
			})
		}

		throw error
	}
}

export const deleteOwnedDocument = async (uid: string, documentId: string) => {
	const existing = await getDocument(uid, documentId)
	if (!existing) {
		throw new ApiError(404, "not_found", "Document not found.")
	}

	await requireMutationEntitlement(uid)

	try {
		await deleteDocumentRecord(uid, documentId)
	} catch (error) {
		if (error instanceof DocumentNotFoundError) {
			throw new ApiError(404, "not_found", "Document not found.", { cause: error })
		}

		throw error
	}
}
