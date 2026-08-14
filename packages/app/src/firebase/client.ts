"use client"

import { getApp, initializeApp } from "firebase/app"
import { connectAuthEmulator, getAuth, inMemoryPersistence, setPersistence } from "firebase/auth"
import firebaseConfig from "../../../../firebase.config.json"

const getFirebaseApp = () => {
	try {
		return getApp()
	} catch {
		return initializeApp(firebaseConfig)
	}
}

const firebaseApp = getFirebaseApp()
const firebaseAuth = getAuth(firebaseApp)

if (firebaseAuth.emulatorConfig === null) {
	connectAuthEmulator(firebaseAuth, `http://127.0.0.1:9099`, {
		disableWarnings: true
	})
}

export { firebaseApp, firebaseAuth }

export const prepareFirebaseAuth = async () => {
	await setPersistence(firebaseAuth, inMemoryPersistence)
}
