import { readFileSync } from "node:fs"
import { resolve } from "node:path"

import {
	assertFails,
	initializeTestEnvironment,
	type RulesTestEnvironment
} from "@firebase/rules-unit-testing"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { afterAll, beforeAll, describe, test } from "vitest"

import input from "./input.json" with { type: "json" }
import seed from "./seed.json" with { type: "json" }
import { firebaseProjectId, repositoryRoot } from "../helpers/environment.js"

let testEnvironment: RulesTestEnvironment

beforeAll(async () => {
	testEnvironment = await initializeTestEnvironment({
		firestore: {
			rules: readFileSync(resolve(repositoryRoot, "firestore.rules"), "utf8")
		},
		projectId: firebaseProjectId
	})
})

afterAll(async () => {
	await testEnvironment.cleanup()
})

/** As an operator, I can rely on Firestore Rules to deny every direct browser request. */
describe("to keep persistence behind trusted servers as an operator, I...", () => {
	test("can't read or write directly without authentication", async () => {
		const firestore = testEnvironment.unauthenticatedContext().firestore()
		const reference = doc(firestore, input.documentPath)

		await assertFails(getDoc(reference))
		await assertFails(setDoc(reference, { title: seed.title }))
	})

	test("can't read or write directly with authentication", async () => {
		const firestore = testEnvironment.authenticatedContext(seed.authenticatedUid).firestore()
		const reference = doc(firestore, input.documentPath)

		await assertFails(getDoc(reference))
		await assertFails(setDoc(reference, { title: seed.title }))
	})
})
