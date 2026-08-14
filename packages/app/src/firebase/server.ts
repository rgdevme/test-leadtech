import "server-only";

import { getApp, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import firebaseConfig from "../../../../firebase.config.json";

const projectId = firebaseConfig.projectId;

const getFirebaseAdminApp = () => {
  try {
    return getApp();
  } catch (error) {
    return initializeApp({ projectId }, projectId);
  }
};

export const getFirebaseAdminAuth = () => getAuth(getFirebaseAdminApp());

export const getFirebaseAdminFirestore = () => getFirestore(getFirebaseAdminApp());
