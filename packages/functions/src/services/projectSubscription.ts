import {
	entitledStripeStatuses,
	firebaseUidSchema,
	projectedSubscriptionStatusSchema,
	stripeEventIdSchema,
	stripePriceIdSchema,
	stripeProductIdSchema,
	stripeMetadataKeys,
	subscriptionPersistenceDataSchema,
	type ProjectedSubscriptionStatus,
	type SubscriptionPersistenceData
} from "@leadtech/common/contracts"
import type Stripe from "stripe"

type ProjectSubscriptionInput = {
	eventId: string
	firebaseUid: string
	forceCanceled: boolean
	subscription: Stripe.Subscription
}

export class SubscriptionProjectionError extends Error {
	readonly code: "invalid_projection"

	constructor(message: string) {
		super(message)
		this.name = "SubscriptionProjectionError"
		this.code = "invalid_projection"
	}
}

const getStripeCustomerId = (customer: Stripe.Subscription["customer"]) =>
	typeof customer === "string" ? customer : customer.id

const getProjectedStatus = (subscription: Stripe.Subscription, forceCanceled: boolean) => {
	const status = forceCanceled ? "canceled" : subscription.status
	const parsed = projectedSubscriptionStatusSchema.safeParse(status)

	if (!parsed.success) {
		throw new SubscriptionProjectionError("Stripe returned an unsupported subscription status.")
	}

	return parsed.data
}

const isEntitledStatus = (
	status: ProjectedSubscriptionStatus
): status is (typeof entitledStripeStatuses)[number] =>
	entitledStripeStatuses.some(entitledStatus => entitledStatus === status)

const getStripeProductId = (product: Stripe.Price["product"]) =>
	typeof product === "string" ? product : product.id

export const projectSubscription = ({
	eventId,
	firebaseUid,
	forceCanceled,
	subscription
}: ProjectSubscriptionInput): SubscriptionPersistenceData => {
	const status = getProjectedStatus(subscription, forceCanceled)
	const configuredProductId = stripeProductIdSchema.safeParse(
		subscription.metadata[stripeMetadataKeys.subscriptionProductId]
	)
	const entitledItem = configuredProductId.success
		? subscription.items.data.find(
				item => getStripeProductId(item.price.product) === configuredProductId.data
			)
		: undefined
	const stripePriceId = entitledItem?.price.id ?? subscription.items.data[0]?.price.id

	if (!stripePriceId) {
		throw new SubscriptionProjectionError("Stripe returned a subscription without a Price.")
	}

	const projection = {
		uid: firebaseUidSchema.parse(firebaseUid),
		stripeCustomerId: getStripeCustomerId(subscription.customer),
		stripeSubscriptionId: subscription.id,
		stripePriceId: stripePriceIdSchema.parse(stripePriceId),
		status,
		entitlement:
			!forceCanceled && isEntitledStatus(status) && entitledItem
				? ("active" as const)
				: ("inactive" as const),
		cancelAtPeriodEnd: subscription.cancel_at_period_end,
		lastStripeEventId: stripeEventIdSchema.parse(eventId)
	}
	const parsed = subscriptionPersistenceDataSchema.safeParse(projection)

	if (!parsed.success) {
		throw new SubscriptionProjectionError("The normalized subscription projection is invalid.")
	}

	return parsed.data
}
