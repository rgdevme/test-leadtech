import { defineSecret } from "firebase-functions/params"
import { z } from "zod"

export const stripeAPIKey = defineSecret("STRIPE_API_KEY")
export const stripeWebhookSigningSecret = defineSecret("STRIPE_WEBHOOK_SIGNING_SECRET")

const secretSchema = (name: string) =>
	z.string(`${name} must be configured.`).nonempty().nonoptional()

const envSchema = z.object({
	stripeAPIKey: secretSchema("STRIPE_API_KEY"),
	stripeWebhookSigningSecret: secretSchema("STRIPE_WEBHOOK_SIGNING_SECRET")
})

let environment: z.infer<typeof envSchema> | undefined

export const initializeEnvironment = () => {
	const result = envSchema.safeParse({
		stripeAPIKey: stripeAPIKey.value(),
		stripeWebhookSigningSecret: stripeWebhookSigningSecret.value()
	})

	if (result.error) throw result.error
	environment = result.data
	return environment
}

export const getEnvironment = () => {
	if (environment) return environment
	throw new Error("The Functions environment has not been initialized.")
}
