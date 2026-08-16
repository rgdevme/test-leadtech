import { z } from "zod"

import type { JsonObject } from "./api.js"

export type RichTextMark = {
	type: string
	attrs?: JsonObject
}

export type RichTextNode = {
	type: string
	attrs?: JsonObject
	content?: RichTextNode[]
	marks?: RichTextMark[]
	text?: string
}

export type RichTextDocument = RichTextNode & {
	type: "doc"
}

const jsonPrimitiveSchema = z.union([z.string(), z.number(), z.boolean(), z.null()])

type JsonSchemaValue = z.infer<typeof jsonPrimitiveSchema> | JsonSchemaValue[] | JsonObject

const jsonValueSchema: z.ZodType<JsonSchemaValue> = z.lazy(() =>
	z.union([jsonPrimitiveSchema, z.array(jsonValueSchema), z.record(z.string(), jsonValueSchema)])
)

export const richTextMarkSchema: z.ZodType<RichTextMark> = z.object({
	type: z.string().min(1),
	attrs: z.record(z.string(), jsonValueSchema).optional()
})

export const richTextNodeSchema: z.ZodType<RichTextNode> = z.lazy(() =>
	z.object({
		type: z.string().min(1),
		attrs: z.record(z.string(), jsonValueSchema).optional(),
		content: z.array(richTextNodeSchema).optional(),
		marks: z.array(richTextMarkSchema).optional(),
		text: z.string().optional()
	})
)

const countTree = (root: RichTextNode) => {
	let count = 0
	let maxDepth = 0
	const stack: Array<{ node: RichTextNode; depth: number }> = [{ node: root, depth: 1 }]

	while (stack.length > 0) {
		const current = stack.pop()
		if (!current) {
			continue
		}
		count += 1
		maxDepth = Math.max(maxDepth, current.depth)
		current.node.content?.forEach(node => stack.push({ node, depth: current.depth + 1 }))
	}

	return { count, maxDepth }
}

export const richTextDocumentSchema: z.ZodType<RichTextDocument> = richTextNodeSchema
	.and(z.object({ type: z.literal("doc") }))
	.superRefine((document, context) => {
		const serializedBytes = new TextEncoder().encode(JSON.stringify(document)).byteLength
		const { count, maxDepth } = countTree(document)

		if (serializedBytes > 500_000) {
			context.addIssue({ code: "custom", message: "Document content must be 500 KB or smaller." })
		}
		if (maxDepth > 32) {
			context.addIssue({ code: "custom", message: "Document content is nested too deeply." })
		}
		if (count > 10_000) {
			context.addIssue({ code: "custom", message: "Document content contains too many nodes." })
		}
	})

export const emptyRichTextDocument: RichTextDocument = {
	type: "doc",
	content: [{ type: "paragraph" }]
}

export const documentIdSchema = z
	.string()
	.min(1)
	.max(128)
	.regex(/^[A-Za-z0-9_-]+$/)
export const documentTitleSchema = z.string().trim().min(1).max(120)

export const documentSummarySchema = z.object({
	id: documentIdSchema,
	title: documentTitleSchema,
	version: z.int().positive(),
	createdAt: z.iso.datetime(),
	updatedAt: z.iso.datetime()
})

export const documentRecordSchema = documentSummarySchema.extend({
	content: richTextDocumentSchema
})

export const listDocumentsResponseSchema = z.object({
	items: z.array(documentSummarySchema)
})

export const updateDocumentRequestSchema = z
	.object({
		title: documentTitleSchema.optional(),
		content: richTextDocumentSchema.optional(),
		expectedVersion: z.int().positive()
	})
	.refine(value => value.title !== undefined || value.content !== undefined, {
		message: "An update must include a title or document content."
	})

export type DocumentSummary = z.infer<typeof documentSummarySchema>
export type DocumentRecord = z.infer<typeof documentRecordSchema>
export type ListDocumentsResponse = z.infer<typeof listDocumentsResponseSchema>
export type UpdateDocumentRequest = z.infer<typeof updateDocumentRequestSchema>
