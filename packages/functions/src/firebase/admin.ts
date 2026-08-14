import { getApps, initializeApp } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

let firestore: Firestore | undefined;

export const initializeFirebaseAdmin = () => {
  const app = getApps()[0] ?? initializeApp();
  firestore = getFirestore(app);

  return firestore;
};

export const getFirestoreDatabase = () => {
  if (!firestore) {
    throw new Error("Firebase Admin has not been initialized.");
  }

  return firestore;
};
