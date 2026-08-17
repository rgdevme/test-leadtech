import { randomUUID } from "node:crypto"

export type TestIdentity = {
	email: string
	password: string
	uid: string
}

export const createTestIdentity = (prefix: string, password = "DraftRoom!234"): TestIdentity => {
	const identifier = randomUUID().replaceAll("-", "")

	return {
		email: `${prefix}.${identifier}@example.test`,
		password,
		uid: `${prefix}_${identifier}`
	}
}
