"use client";

import { getApp, getApps, initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
};

const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const firebaseAuth = getAuth(firebaseApp);
const firestore = getFirestore(firebaseApp);

const authEmulatorHost = process.env.NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST;
const authEmulatorPortValue = process.env.NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_PORT;
const firestoreEmulatorHost = process.env.NEXT_PUBLIC_FIRESTORE_EMULATOR_HOST;
const firestoreEmulatorPortValue = process.env.NEXT_PUBLIC_FIRESTORE_EMULATOR_PORT;

if (
  !authEmulatorHost ||
  !authEmulatorPortValue ||
  !firestoreEmulatorHost ||
  !firestoreEmulatorPortValue
) {
  throw new Error("Firebase client emulator endpoints must be configured.");
}

const authEmulatorPort = Number(authEmulatorPortValue);
const firestoreEmulatorPort = Number(firestoreEmulatorPortValue);

if (firebaseAuth.emulatorConfig === null) {
  connectAuthEmulator(firebaseAuth, "http://" + authEmulatorHost + ":" + authEmulatorPort, {
    disableWarnings: true,
  });
}

const firebaseGlobal = globalThis as typeof globalThis & {
  firestoreEmulatorConnected?: boolean;
};

if (firebaseGlobal.firestoreEmulatorConnected !== true) {
  connectFirestoreEmulator(firestore, firestoreEmulatorHost, firestoreEmulatorPort);
  firebaseGlobal.firestoreEmulatorConnected = true;
}

export { firebaseApp, firebaseAuth, firestore };
