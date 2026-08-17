# Task details

## 1. How does the application decide that a user is an active subscriber?

DraftRoom treats a user as an active subscriber only when the server-side subscription record in Firestore has an active entitlement.

Stripe Checkout does not grant access through the browser redirect. A signed Stripe webhook resolves the subscription, confirms that its status is `active` or `trialing`, verifies that it uses an allowed price, and writes the resulting entitlement to `subscriptions/{uid}` in Firestore.

The authenticated application reads that record on the server. Every document mutation checks the current entitlement before allowing creation, editing, renaming, or deletion. A missing or inactive subscription record leaves the workspace read-only.

## 2. What happens if payment succeeds but the webhook is delayed?

After Stripe Checkout succeeds, the user is redirected to a pending subscription page. The redirect does not grant subscriber access.

The pending page checks the server-side subscription status every two seconds. When the signed webhook arrives, Firebase Functions validates it and writes the active subscription projection to Firestore. The next status check sees the active entitlement and redirects the user to the document workspace with subscriber features enabled.

If confirmation takes longer than 30 seconds, the page shows a delayed state and lets the user check again. The payment remains recorded by Stripe, but editing stays locked until the webhook has updated the server-side entitlement.

## 3. One security decision and why

Direct browser access to Firestore is denied through its rules file.

Every document operation passes through server routes that verify the Firebase session, document ownership, and subscription entitlement.

Authorization remains on the server, so hiding or enabling controls in the browser never determines whether a document operation is allowed.

This prevents a modified client from bypassing access controls, and becomes easier to maintain due to the fragility of Firestore rules.