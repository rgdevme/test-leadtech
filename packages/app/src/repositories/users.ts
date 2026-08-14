import "server-only"

import { FieldValue } from "firebase-admin/firestore"

import { getFirebaseAdminFirestore } from "@/firebase/server"

export type UserAccount = {
	uid: string
	email: string | null
	stripeCustomerId: string | null
}

const usersCollection = () => getFirebaseAdminFirestore().collection("users")

export const upsertUser = async (uid: string, email: string | null) => {
	const reference = usersCollection().doc(uid)
	const snapshot = await reference.get()
	const now = FieldValue.serverTimestamp()

	await reference.set(
		{
			uid,
			email,
			...(snapshot.exists ? {} : { createdAt: now }),
			updatedAt: now
		},
		{ merge: true }
	)
}

export const getUserAccount = async (uid: string): Promise<UserAccount> => {
	const snapshot = await usersCollection().doc(uid).get()
	const data = snapshot.data()

	return {
		uid,
		email: typeof data?.email === "string" ? data.email : null,
		stripeCustomerId: typeof data?.stripeCustomerId === "string" ? data.stripeCustomerId : null
	}
}

export const setStripeCustomerId = async (uid: string, stripeCustomerId: string) => {
	await usersCollection().doc(uid).set(
		{
			stripeCustomerId,
			updatedAt: FieldValue.serverTimestamp()
		},
		{ merge: true }
	)
}
