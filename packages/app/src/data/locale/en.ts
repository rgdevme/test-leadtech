import { brandLocale } from "@leadtech/common/data/locale/en"

export const en = {
	brand: brandLocale,
	navigation: {
		documents: "Documents",
		profile: "Account",
		signOut: "Sign out",
		backToDocuments: "Back to documents"
	},
	auth: {
		signIn: {
			title: "Return to your writing room.",
			description: "Your documents are waiting exactly where you left them.",
			submit: "Sign in",
			submitting: "Signing in",
			alternatePrompt: `New to ${brandLocale.name}?`,
			alternateAction: "Create an account"
		},
		signUp: {
			title: "Make room for the work that matters.",
			description: "Start a quiet, dependable home for every draft.",
			submit: "Create account",
			submitting: "Creating account",
			alternatePrompt: "Already have an account?",
			alternateAction: "Sign in"
		},
		fields: {
			email: "Email address",
			emailPlaceholder: "writer@example.com",
			password: "Password",
			passwordPlaceholder: "At least 8 characters",
			confirmPassword: "Confirm password"
		},
		errors: {
			generic: "We could not complete that request. Try again.",
			invalidCredentials: "The email or password is incorrect.",
			emailInUse: "An account already uses this email address.",
			weakPassword: "Use at least eight characters for your password.",
			tooManyAttempts: "Too many attempts. Wait a moment and try again.",
			sessionExpired: "Your previous session expired. Sign in again to continue.",
			passwordMismatch: "Passwords must match."
		},
		aside: {
			headline: "A writing space that keeps the page, not the noise.",
			principles: [
				"Every save is explicit, versioned, and visible.",
				"Canceled access stays readable. Your words remain yours.",
				"Billing confirms on the server before editing unlocks."
			],
			previous: "Previous note",
			next: "Next note"
		}
	},
	documents: {
		title: "Your writing, arranged.",
		description: "Open a draft, begin a new one, or return to work already in motion.",
		create: "New document",
		creating: "Creating document",
		emptyTitle: "The first page is still open.",
		emptyDescription: "Create a document when you are ready to begin.",
		readOnlyNotice: "Your archive is read-only until a subscription is active.",
		untitled: "Untitled document",
		updated: "Updated",
		rename: "Rename document",
		renameSave: "Save title",
		renameCancel: "Cancel rename",
		delete: "Delete document",
		deleteTitle: "Delete this document?",
		deleteDescription: "This removes the document and its contents permanently.",
		deleteConfirm: "Delete permanently",
		deleteCancel: "Keep document",
		loadError: "Your documents could not be loaded.",
		mutationError: "That change could not be saved. Try again."
	},
	editor: {
		titlePlaceholder: "Untitled document",
		canvasLabel: "Document editor",
		readOnly: "Read-only",
		toolbar: {
			bold: "Bold",
			italic: "Italic",
			headingOne: "Heading 1",
			headingTwo: "Heading 2",
			bulletList: "Bullet list",
			orderedList: "Numbered list",
			undo: "Undo",
			redo: "Redo"
		},
		save: {
			clean: "All changes saved",
			dirty: "Unsaved changes",
			saving: "Saving",
			failed: "Save failed",
			conflict: "Another version exists",
			retry: "Retry save",
			reload: "Reload latest version",
			navigationWarning: "This document has unsaved changes. Leave anyway?"
		}
	},
	subscription: {
		modalTitle: "Choose how you want to write.",
		modalDescription: "Select a plan. Checkout opens only after you confirm.",
		selectPlan: "Select plan",
		selectedPlan: "Selected",
		confirm: "Continue to secure checkout",
		confirming: "Opening checkout",
		dismiss: "Not now",
		featured: "Recommended",
		unavailable: "No plans are configured yet.",
		unavailableDescription: "Add Stripe Price IDs to make subscriptions available.",
		priceConnector: "per",
		status: "Subscription",
		active: "Active",
		inactive: "Inactive",
		trialing: "Trial",
		pending: "Payment received. Access is being confirmed.",
		pendingDescription:
			"The secure webhook is updating your workspace. This usually takes only a few seconds.",
		pendingStillWaiting: "Confirmation is taking longer than expected.",
		pendingStillWaitingDescription:
			"Your payment status is safe. Refresh the status when the webhook has arrived.",
		refresh: "Refresh status",
		checking: "Checking status",
		manageHeading: "Your access",
		manageDescription:
			"Documents always remain readable. Creating, editing, renaming, and deleting require active access.",
		subscribe: "Choose a plan",
		updated: "Last confirmed",
		notConfirmed: "Not confirmed yet",
		accessSteps: [
			{
				title: "Choose",
				description: "Pick a public plan in the workspace. Stripe identifiers stay on the server."
			},
			{
				title: "Confirm",
				description: "Complete payment in Stripe Checkout using its secure hosted flow."
			},
			{
				title: "Write",
				description: "Editing unlocks only after a signed webhook confirms the subscription."
			}
		]
	},
	profile: {
		title: "Account and access.",
		description: "See the identity attached to this archive and its current writing access.",
		signedInAs: "Signed in as"
	},
	common: {
		close: "Close",
		retry: "Try again",
		loading: "Loading"
	}
} as const
