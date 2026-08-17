import { loadEnvFile } from "node:process"

loadEnvFile(new URL(".env.local", import.meta.url))
loadEnvFile(new URL(".secret.local", import.meta.url))

export const applicationUrl = process.env.NEXT_PUBLIC_APP_URL as string
export const stripeApiKey = process.env.STRIPE_API_KEY
export const stripeWebhookSigningSecret = process.env.STRIPE_WEBHOOK_SIGNING_SECRET as string
