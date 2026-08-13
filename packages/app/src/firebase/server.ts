import "server-only";

import { getApp, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

if (!process.env.FIREBASE_AUTH_EMULATOR_HOST || !process.env.FIRESTORE_EMULATOR_HOST) {
  throw new Error("Firebase Admin SDK emulator hosts must be configured.");
}

const firebaseAdminApp =
  getApps().length === 0
    ? initializeApp({ projectId: process.env.FIREBASE_PROJECT_ID })
    : getApp();

const firebaseAdminAuth = getAuth(firebaseAdminApp);
const firebaseAdminFirestore = getFirestore(firebaseAdminApp);

export { firebaseAdminApp, firebaseAdminAuth, firebaseAdminFirestore };
