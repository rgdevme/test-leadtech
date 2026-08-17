import { createRequire } from "node:module"

import type { App } from "firebase-admin/app"

import { emptyRichTextDocument, subscriptionPlanIds } from "@leadtech/common/contracts"

import { firebaseProjectId } from "./environment.js"
import type { TestIdentity } from "./identity.js"

const require = createRequire(import.meta.url)
const { deleteApp, getApps, initializeApp } =
	require("firebase-admin/app") as typeof import("firebase-admin/app")
const { getAuth } = require("firebase-admin/auth") as typeof import("firebase-admin/auth")
const { FieldValue, getFirestore, Timestamp } =
	require("firebase-admin/firestore") as typeof import("firebase-admin/firestore")

const TEST_APP_NAME = "leadtech-tests"

const getTestApp = (): App => {
	const current = getApps().find(app => app.name === TEST_APP_NAME)
	if (current) {
		return current
	}

	return initializeApp(
		{
			projectId: firebaseProjectId
		},
		TEST_APP_NAME
	)
}

export const getTestAuth = () => getAuth(getTestApp())
export const getTestFirestore = () => getFirestore(getTestApp())

export const createFirebaseUser = async (identity: TestIdentity) => {
	await getTestAuth().createUser({
		displayName: identity.uid,
		email: identity.email,
		password: identity.password,
		uid: identity.uid
	})
}

export const deleteFirebaseUser = async (uid: string) => {
	try {
		await getTestAuth().deleteUser(uid)
	} catch (error) {
		if (
			typeof error === "object"
			&& error !== null
			&& "code" in error
			&& error.code === "auth/user-not-found"
		) {
			return
		}

		throw new Error(`Could not delete Firebase test user ${uid}.`, { cause: error })
	}
}

export const seedDocument = async (ownerId: string, documentId: string, title: string) => {
	const now = Timestamp.now()
	await getTestFirestore().collection("documents").doc(documentId).set({
		content: emptyRichTextDocument,
		createdAt: now,
		ownerId,
		title,
		updatedAt: now,
		version: 1
	})
}

export const seedSubscription = async (
	uid: string,
	entitlement: "active" | "inactive" = "active"
) => {
	const stripeIdentifier = uid.replaceAll(/[^A-Za-z0-9]/g, "")

	await getTestFirestore()
		.collection("subscriptions")
		.doc(uid)
		.set({
			cancelAtPeriodEnd: false,
			entitlement,
			lastStripeEventId: `evt_${stripeIdentifier}`,
			status: entitlement === "active" ? "active" : "canceled",
			stripeCustomerId: `cus_${stripeIdentifier}`,
			stripePriceId: subscriptionPlanIds.write,
			stripeSubscriptionId: `sub_${stripeIdentifier}`,
			uid,
			updatedAt: FieldValue.serverTimestamp()
		})
}

export const deleteSubscription = async (uid: string) => {
	await getTestFirestore().collection("subscriptions").doc(uid).delete()
}

export const getStoredUser = async (uid: string) =>
	getTestFirestore().collection("users").doc(uid).get()

export const getStoredSubscription = async (uid: string) =>
	getTestFirestore().collection("subscriptions").doc(uid).get()

export const getStoredWebhookEvent = async (eventId: string) =>
	getTestFirestore().collection("stripeWebhookEvents").doc(eventId).get()

export const cleanupFirebaseState = async (uids: string[], documentIds: string[] = []) => {
	const firestore = getTestFirestore()
	const references = [
		...uids.flatMap(uid => [
			firestore.collection("users").doc(uid),
			firestore.collection("subscriptions").doc(uid)
		]),
		...documentIds.map(documentId => firestore.collection("documents").doc(documentId))
	]

	for (const uid of uids) {
		const ownedDocuments = await firestore.collection("documents").where("ownerId", "==", uid).get()
		references.push(...ownedDocuments.docs.map(document => document.ref))
	}

	await Promise.all(references.map(reference => reference.delete()))
	await Promise.all(uids.map(deleteFirebaseUser))
}

export const cleanupWebhookState = async (eventIds: string[], uids: string[]) => {
	const firestore = getTestFirestore()
	await Promise.all([
		...eventIds.map(eventId => firestore.collection("stripeWebhookEvents").doc(eventId).delete()),
		...uids.map(uid => firestore.collection("subscriptions").doc(uid).delete())
	])
}

export const closeFirebaseAdmin = async () => {
	const app = getApps().find(candidate => candidate.name === TEST_APP_NAME)
	if (app) {
		await deleteApp(app)
	}
}
