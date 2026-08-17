import { fileURLToPath } from "node:url"

export const repositoryRoot = fileURLToPath(new URL("../../../../", import.meta.url))
export const authEmulatorUrl = `http://${process.env.FIREBASE_AUTH_EMULATOR_HOST}`
export const firebaseProjectId = process.env.GCLOUD_PROJECT as string
export const stripeWebhookUrl = `http://127.0.0.1:5001/${firebaseProjectId}/us-central1/stripeWebhook`
