import "server-only";

import { subscriptionPersistenceSchema, type SubscriptionResponse } from "@leadtech/contracts";

import { getFirebaseAdminFirestore } from "@/firebase/server";

const subscriptionsCollection = () => getFirebaseAdminFirestore().collection("subscriptions");

export const getSubscription = async (uid: string): Promise<SubscriptionResponse> => {
  const snapshot = await subscriptionsCollection().doc(uid).get();

  if (!snapshot.exists) {
    return { status: "none", entitled: false, updatedAt: null };
  }

  const subscription = subscriptionPersistenceSchema.parse(snapshot.data());
  const updatedAt = new Date(
    subscription.updatedAt.seconds * 1000 + subscription.updatedAt.nanoseconds / 1_000_000,
  ).toISOString();

  return {
    status: subscription.status,
    entitled: subscription.entitlement === "active",
    updatedAt,
  };
};
