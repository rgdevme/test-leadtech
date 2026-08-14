export const en = {
  locale: "en-US",
  metadata: {
    title: "doc.io — Rich-text writing, without the noise",
    description:
      "Create, format, and keep rich-text documents in a focused online editor. Choose one clear monthly plan and start writing in your browser.",
    applicationName: "doc.io",
    imageAlt: "The doc.io rich-text editor on a warm paper-inspired canvas",
  },
  accessibility: {
    skipToContent: "Skip to content",
    toggleNavigation: "Toggle navigation",
    generatedArtwork: "AI-generated product visualization",
  },
  navigation: {
    benefits: "Benefits",
    workflow: "How it works",
    pricing: "Pricing",
    faq: "FAQ",
    signIn: "Sign in",
    primaryAction: "Start writing",
  },
  hero: {
    eyebrow: "A calmer place to write",
    titleLead: "Write richly.",
    titleAccent: "Keep it yours.",
    description:
      "doc.io is a focused online editor for creating, formatting, and keeping your rich-text documents in one calm browser workspace.",
    scrollLabel: "Explore the benefits",
    imageAlt:
      "An angled doc.io browser editor showing formatting controls and a highlighted paragraph",
    note: "Rich text. Browser based. Yours to keep.",
  },
  benefits: {
    eyebrow: "Made for the page",
    title: "Everything between the idea and the final full stop.",
    description:
      "The tools you expect from rich text, arranged around the document instead of around distraction.",
    imageAlt: "A paper-inspired doc.io editor beside save and document archive modules",
    items: [
      {
        index: "A",
        title: "Rich text without clutter",
        description:
          "Shape a clear hierarchy with headings, lists, emphasis, links, and blockquotes in one focused canvas.",
      },
      {
        index: "B",
        title: "Saved to your account",
        description:
          "Create, rename, organize, and return to your documents from your browser workspace.",
      },
      {
        index: "C",
        title: "Readable after cancellation",
        description:
          "Your saved documents remain available to list, open, and read even when your paid access ends.",
      },
    ],
  },
  workflow: {
    eyebrow: "A direct workflow",
    title: "From blank page to saved document—without leaving the flow.",
    description:
      "The workspace keeps the essential actions close and the document itself in charge.",
    imageAlt:
      "Three layered doc.io browser panels showing document creation, editing, and a saved state",
    steps: [
      {
        index: "01",
        title: "Create",
        description: "Open a fresh document from your personal document list.",
      },
      {
        index: "02",
        title: "Shape",
        description: "Write and format with familiar rich-text controls.",
      },
      {
        index: "03",
        title: "Save",
        description: "Keep the latest version ready for your next session.",
      },
    ],
  },
  trust: {
    eyebrow: "Clear by design",
    title: "No inflated promises. Just concrete product assurances.",
    description:
      "doc.io keeps the subscription boundary explicit so you always know what payment enables and what remains yours.",
    imageAlt: "An archival folio of tactile document sheets with a precise version rail",
    items: [
      {
        title: "Owner-scoped documents",
        description: "Only the authenticated owner can access their document records.",
      },
      {
        title: "Read access remains",
        description:
          "Cancellation removes editing access, not your ability to list, open, and read saved work.",
      },
      {
        title: "Confirmed before access",
        description:
          "Paid editing unlocks only after the payment state has been securely confirmed.",
      },
    ],
    proofLabel: "Product assurances—not certification claims",
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
      year: "per year",
    },
    action: "Choose this plan",
    terms:
      "Payment is confirmed before editing access is enabled. Cancel anytime; saved documents remain readable.",
  },
  faq: {
    eyebrow: "The practical details",
    title: "Questions, answered plainly.",
    imageAlt: "Four tactile paper accordion rows with one expanded document detail",
    items: [
      {
        question: "How does billing unlock the editor?",
        answer:
          "After registration, your selected plan continues to secure checkout. Editing access begins only after the payment state is confirmed—not from the success redirect alone.",
      },
      {
        question: "What happens when I cancel?",
        answer:
          "When paid access ends, creating, editing, renaming, and deleting are disabled. You can still list, open, and read the documents you already own.",
      },
      {
        question: "Who owns my documents?",
        answer:
          "Your documents stay attached to your account. Access is owner-scoped, and cancellation does not transfer or erase that ownership.",
      },
      {
        question: "Where can I use doc.io?",
        answer:
          "doc.io runs in a modern web browser on responsive screens. Native apps and offline editing are not part of the current product scope.",
      },
    ],
  },
  footer: {
    title: "Give the next idea a place to become clear.",
    description: "Open doc.io in your browser and begin with a blank page.",
    action: "Start writing",
    signIn: "Already have an account? Sign in",
    imageAlt: "A blank warm paper sheet with a bright text caret on a dark desk",
    product: "doc.io",
    descriptor: "Online rich-text documents",
    copyright: "Built for focused writing.",
  },
} as const;
