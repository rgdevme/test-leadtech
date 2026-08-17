import type { PropsWithChildren } from "react"
import type { SubscriptionPlan } from "@leadtech/common/contracts"

import { Button } from "@/components/atoms/Button"
import { Logo } from "@/components/atoms/Logo"
import { BenefitsSection } from "@/components/organisms/BenefitsSection"
import { FaqSection } from "@/components/organisms/FaqSection"
import { Footer } from "@/components/organisms/Footer"
import { Hero } from "@/components/organisms/Hero"
import { PricingSection } from "@/components/organisms/PricingSection"
import { SiteHeader } from "@/components/organisms/SiteHeader"
import { TrustSection } from "@/components/organisms/TrustSection"
import { WorkflowSection } from "@/components/organisms/WorkflowSection"
import { MarketingTemplate } from "@/components/templates/MarketingTemplate"
import { applicationUrl } from "@/config/environment"
import type { Locale } from "@/i18n/config"
import type { Dictionary } from "@/i18n/getDictionary"
import { createSubscribePath, routes } from "@/i18n/routes"

type LandingPageProps = PropsWithChildren<{
	copy: Dictionary["marketing"]
	locale: Locale
	metadata: Dictionary["metadata"]
	plans: readonly SubscriptionPlan[]
}>

export const LandingPage = ({ copy, locale, metadata, plans }: LandingPageProps) => {
	const homeHref = routes.home(locale)
	const signInHref = routes.signIn(locale)
	const subscribeHref = createSubscribePath(locale)
	const softwareApplicationSchema = {
		"@context": "https://schema.org",
		"@type": "SoftwareApplication",
		name: metadata.applicationName,
		applicationCategory: "ProductivityApplication",
		operatingSystem: "Web browser",
		description: metadata.description,
		url: new URL(homeHref, applicationUrl).toString(),
		offers: plans.map(plan => ({
			"@type": "Offer",
			price: (plan.unitAmount / 100).toFixed(2),
			priceCurrency: plan.currency,
			category: "subscription",
			url: createSubscribePath(locale, plan.key)
		}))
	}
	const faqSchema = {
		"@context": "https://schema.org",
		"@type": "FAQPage",
		mainEntity: copy.faq.items.map(({ answer, question }) => ({
			"@type": "Question",
			name: question,
			acceptedAnswer: {
				"@type": "Answer",
				text: answer
			}
		}))
	}
	const { Actions, Brand, Navigation } = SiteHeader
	const { Footer: FooterSlot, Header, Main } = MarketingTemplate

	return (
		<>
			<MarketingTemplate skipLinkLabel={copy.accessibility.skipToContent}>
				<Header>
					<SiteHeader menuLabel={copy.accessibility.toggleNavigation}>
						<Brand>
							<Logo href={homeHref} />
						</Brand>
						<Navigation>
							<a href='#benefits'>{copy.navigation.benefits}</a>
							<a href='#workflow'>{copy.navigation.workflow}</a>
							<a href='#pricing'>{copy.navigation.pricing}</a>
							<a href='#faq'>{copy.navigation.faq}</a>
						</Navigation>
						<Actions>
							<Button
								href={signInHref}
								showArrow={false}
								variant='text'>
								{copy.navigation.signIn}
							</Button>
							<Button href={subscribeHref}>{copy.navigation.primaryAction}</Button>
						</Actions>
					</SiteHeader>
				</Header>
				<Main>
					<Hero copy={copy.hero} />
					<BenefitsSection copy={copy.benefits} />
					<WorkflowSection copy={copy.workflow} />
					<TrustSection copy={copy.trust} />
					<PricingSection
						copy={copy.pricing}
						locale={locale}
						plans={plans}
					/>
					<FaqSection copy={copy.faq} />
				</Main>
				<FooterSlot>
					<Footer
						copy={copy.footer}
						homeHref={homeHref}
						primaryHref={subscribeHref}
						signInHref={signInHref}
					/>
				</FooterSlot>
			</MarketingTemplate>
			<script
				dangerouslySetInnerHTML={{
					__html: JSON.stringify([softwareApplicationSchema, faqSchema]).replaceAll("<", "\\u003c")
				}}
				type='application/ld+json'
			/>
		</>
	)
}
