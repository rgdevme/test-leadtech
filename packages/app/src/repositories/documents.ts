import "server-only"

import {
	documentPersistenceSchema,
	emptyRichTextDocument,
	type DocumentRecord,
	type DocumentSummary,
	type UpdateDocumentRequest
} from "@leadtech/contracts"
import { FieldValue } from "firebase-admin/firestore"

import { getFirebaseAdminFirestore } from "@/firebase/server"

export class DocumentNotFoundError extends Error {
	constructor() {
		super("Document not found.")
		this.name = "DocumentNotFoundError"
	}
}

export class DocumentVersionConflictError extends Error {
	readonly currentVersion: number

	constructor(currentVersion: number) {
		super("The document changed in another session.")
		this.name = "DocumentVersionConflictError"
		this.currentVersion = currentVersion
	}
}

const documentsCollection = () => getFirebaseAdminFirestore().collection("documents")

const toIsoString = (seconds: number, nanoseconds: number) =>
	new Date(seconds * 1000 + nanoseconds / 1_000_000).toISOString()

const toDocumentRecord = (id: string, value: unknown): DocumentRecord => {
	const document = documentPersistenceSchema.parse(value)

	return {
		id,
		title: document.title,
		content: document.content,
		version: document.version,
		createdAt: toIsoString(document.createdAt.seconds, document.createdAt.nanoseconds),
		updatedAt: toIsoString(document.updatedAt.seconds, document.updatedAt.nanoseconds)
	}
}

export const listDocuments = async (ownerId: string): Promise<DocumentSummary[]> => {
	const snapshot = await documentsCollection()
		.where("ownerId", "==", ownerId)
		.orderBy("updatedAt", "desc")
		.get()

	return snapshot.docs.map(document => {
		const record = toDocumentRecord(document.id, document.data())
		return {
			id: record.id,
			title: record.title,
			version: record.version,
			createdAt: record.createdAt,
			updatedAt: record.updatedAt
		}
	})
}

export const getDocument = async (
	ownerId: string,
	documentId: string
): Promise<DocumentRecord | null> => {
	const snapshot = await documentsCollection().doc(documentId).get()
	const data = snapshot.data()

	if (!snapshot.exists || data?.ownerId !== ownerId) {
		return null
	}

	return toDocumentRecord(snapshot.id, data)
}

export const createDocument = async (ownerId: string): Promise<DocumentRecord> => {
	const reference = documentsCollection().doc()
	const timestamp = FieldValue.serverTimestamp()

	await reference.set({
		ownerId,
		title: "Untitled document",
		content: emptyRichTextDocument,
		version: 1,
		createdAt: timestamp,
		updatedAt: timestamp
	})

	const snapshot = await reference.get()
	return toDocumentRecord(snapshot.id, snapshot.data())
}

export const updateDocument = async (
	ownerId: string,
	documentId: string,
	update: UpdateDocumentRequest
): Promise<DocumentRecord> => {
	const firestore = getFirebaseAdminFirestore()
	const reference = documentsCollection().doc(documentId)

	await firestore.runTransaction(async transaction => {
		const snapshot = await transaction.get(reference)
		const data = snapshot.data()

		if (!snapshot.exists || data?.ownerId !== ownerId) {
			throw new DocumentNotFoundError()
		}

		const current = documentPersistenceSchema.parse(data)
		if (current.version !== update.expectedVersion) {
			throw new DocumentVersionConflictError(current.version)
		}

		transaction.update(reference, {
			...(update.title !== undefined ? { title: update.title } : {}),
			...(update.content !== undefined ? { content: update.content } : {}),
			updatedAt: FieldValue.serverTimestamp(),
			version: current.version + 1
		})
	})

	const snapshot = await reference.get()
	return toDocumentRecord(snapshot.id, snapshot.data())
}

export const deleteDocument = async (ownerId: string, documentId: string) => {
	const firestore = getFirebaseAdminFirestore()
	const reference = documentsCollection().doc(documentId)

	await firestore.runTransaction(async transaction => {
		const snapshot = await transaction.get(reference)
		if (!snapshot.exists || snapshot.data()?.ownerId !== ownerId) {
			throw new DocumentNotFoundError()
		}

		transaction.delete(reference)
	})
}
