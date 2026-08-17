const brandLocale = {
	name: "DraftRoom",
	product: "Writing workspace",
	logoLabel: "DraftRoom home"
} as const

const marketingDictionary = {
	brand: brandLocale,
	locale: "en-US",
	metadata: {
		title: `${brandLocale.name} — Rich-text writing, without the noise`,
		description:
			"Create, format, and keep rich-text documents in a focused online editor. Choose one clear monthly plan and start writing in your browser.",
		applicationName: brandLocale.name,
		imageAlt: `The ${brandLocale.name} rich-text editor on a warm paper-inspired canvas`
	},
	accessibility: {
		skipToContent: "Skip to content",
		toggleNavigation: "Toggle navigation",
		generatedArtwork: "AI-generated product visualization"
	},
	navigation: {
		benefits: "Benefits",
		workflow: "How it works",
		pricing: "Pricing",
		faq: "FAQ",
		signIn: "Sign in",
		primaryAction: "Start writing"
	},
	hero: {
		eyebrow: "A calmer place to write",
		titleLead: "Write richly.",
		titleAccent: "Keep it yours.",
		description: `${brandLocale.name} is a focused online editor for creating, formatting, and keeping your rich-text documents in one calm browser workspace.`,
		scrollLabel: "Explore the benefits",
		imageAlt: `An angled ${brandLocale.name} browser editor showing formatting controls and a highlighted paragraph`,
		note: "Rich text. Browser based. Yours to keep."
	},
	benefits: {
		eyebrow: "Made for the page",
		title: "Everything between the idea and the final full stop.",
		description:
			"The tools you expect from rich text, arranged around the document instead of around distraction.",
		imageAlt: `A paper-inspired ${brandLocale.name} editor beside save and document archive modules`,
		items: [
			{
				index: "A",
				title: "Rich text without clutter",
				description:
					"Shape a clear hierarchy with headings, lists, emphasis, links, and blockquotes in one focused canvas."
			},
			{
				index: "B",
				title: "Saved to your account",
				description:
					"Create, rename, organize, and return to your documents from your browser workspace."
			},
			{
				index: "C",
				title: "Readable after cancellation",
				description:
					"Your saved documents remain available to list, open, and read even when your paid access ends."
			}
		]
	},
	workflow: {
		eyebrow: "A direct workflow",
		title: "From blank page to saved document—without leaving the flow.",
		description:
			"The workspace keeps the essential actions close and the document itself in charge.",
		imageAlt: `Three layered ${brandLocale.name} browser panels showing document creation, editing, and a saved state`,
		steps: [
			{
				index: "01",
				title: "Create",
				description: "Open a fresh document from your personal document list."
			},
			{
				index: "02",
				title: "Shape",
				description: "Write and format with familiar rich-text controls."
			},
			{
				index: "03",
				title: "Save",
				description: "Keep the latest version ready for your next session."
			}
		]
	},
	trust: {
		eyebrow: "Clear by design",
		title: "No inflated promises. Just concrete product assurances.",
		description: `${brandLocale.name} keeps the subscription boundary explicit so you always know what payment enables and what remains yours.`,
		imageAlt: "An archival folio of tactile document sheets with a precise version rail",
		items: [
			{
				title: "Owner-scoped documents",
				description: "Only the authenticated owner can access their document records."
			},
			{
				title: "Read access remains",
				description:
					"Cancellation removes editing access, not your ability to list, open, and read saved work."
			},
			{
				title: "Confirmed before access",
				description:
					"Paid editing unlocks only after the payment state has been securely confirmed."
			}
		],
		proofLabel: "Product assurances—not certification claims"
	},
	pricing: {
		eyebrow: "One plan. No maze.",
		title: "A straightforward monthly home for your documents.",
		description:
			"Subscribe to create and edit. Cancel when you need to; your existing documents remain available to read.",
		imageAlt: "A single charcoal subscription card nested in a warm paper tray",
		billedMonthly: "Billed monthly",
		perInterval: {
			month: "per month",
			year: "per year"
		},
		action: "Choose this plan",
		terms:
			"Payment is confirmed before editing access is enabled. Cancel anytime; saved documents remain readable."
	},
	faq: {
		eyebrow: "The practical details",
		title: "Questions, answered plainly.",
		imageAlt: "Four tactile paper accordion rows with one expanded document detail",
		items: [
			{
				question: "How does billing unlock the editor?",
				answer:
					"After registration, your selected plan continues to secure checkout. Editing access begins only after the payment state is confirmed—not from the success redirect alone."
			},
			{
				question: "What happens when I cancel?",
				answer:
					"When paid access ends, creating, editing, renaming, and deleting are disabled. You can still list, open, and read the documents you already own."
			},
			{
				question: "Who owns my documents?",
				answer:
					"Your documents stay attached to your account. Access is owner-scoped, and cancellation does not transfer or erase that ownership."
			},
			{
				question: `Where can I use ${brandLocale.name}?`,
				answer: `${brandLocale.name} runs in a modern web browser on responsive screens. Native apps and offline editing are not part of the current product scope.`
			}
		]
	},
	footer: {
		title: "Give the next idea a place to become clear.",
		description: `Open ${brandLocale.name} in your browser and begin with a blank page.`,
		action: "Start writing",
		signIn: "Already have an account? Sign in",
		imageAlt: "A blank warm paper sheet with a bright text caret on a dark desk",
		descriptor: "Online rich-text documents",
		copyright: "Built for focused writing."
	}
} as const

const workspaceDictionary = {
	brand: brandLocale,
	navigation: {
		workspace: "Workspace navigation",
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
			invalidEmail: "Enter a valid email address.",
			passwordRequired: "Enter your password.",
			confirmPasswordRequired: "Confirm your password.",
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
		create: "New document",
		creating: "Creating document",
		emptyTitle: "The first page is still open.",
		emptyDescription: "Create a document when you are ready to begin.",
		readOnlyNotice: "Your archive is read-only until a subscription is active.",
		untitled: "Untitled document",
		updated: "Updated",
		rename: "Rename document",
		open: "Open document",
		actions: "Document actions",
		renameSave: "Save title",
		renameCancel: "Cancel rename",
		delete: "Delete document",
		deleteTitle: "Delete this document?",
		deleteDescription: "This removes the document and its contents permanently.",
		deleteConfirm: "Delete permanently",
		deleteCancel: "Keep document",
		notFoundTitle: "This document is not in your archive.",
		notFoundDescription: "It may have been removed, or it belongs to another account.",
		notFoundAction: "Return to documents",
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
			clean: "Saved",
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

export const en = {
	brand: brandLocale,
	locale: marketingDictionary.locale,
	metadata: marketingDictionary.metadata,
	common: workspaceDictionary.common,
	plans: {
		write: {
			name: "Writing",
			description: "A focused workspace for a steady writing practice.",
			features: ["Unlimited documents", "Rich-text editing", "Automatic version-safe saving"]
		},
		studio: {
			name: "Studio",
			description: "More room for long-form projects and an active archive.",
			features: [
				"Everything in Writing",
				"Priority workspace access",
				"Cancel without losing read access"
			]
		},
		studioYearly: {
			name: "Studio annual",
			description: "A full year of focused writing at a quieter monthly cost.",
			features: ["Everything in Studio", "Two months included", "One annual renewal"]
		}
	},
	marketing: {
		accessibility: marketingDictionary.accessibility,
		navigation: marketingDictionary.navigation,
		hero: marketingDictionary.hero,
		benefits: marketingDictionary.benefits,
		workflow: marketingDictionary.workflow,
		trust: marketingDictionary.trust,
		pricing: marketingDictionary.pricing,
		faq: marketingDictionary.faq,
		footer: marketingDictionary.footer
	},
	workspace: {
		navigation: workspaceDictionary.navigation,
		auth: workspaceDictionary.auth,
		documents: workspaceDictionary.documents,
		editor: workspaceDictionary.editor,
		subscription: workspaceDictionary.subscription,
		profile: workspaceDictionary.profile
	}
} as const
